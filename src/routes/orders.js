const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const prisma = new PrismaClient();

// Rate limiting configuration
const createOrderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        success: false,
        error: 'Too many orders created from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Handle Prisma connection errors
prisma.$connect()
    .then(() => console.log('Successfully connected to database'))
    .catch((error) => {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    });

// Add connection health check endpoint
router.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: 'healthy' });
    } catch (error) {
        console.error('Database health check failed:', error);
        res.status(500).json({ status: 'unhealthy', error: error.message });
    }
});

// Utility function to validate and format phone number
const validateAndFormatPhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Check if it's a valid 10-digit number
    if (cleaned.length !== 10) {
        throw new Error('Phone number must be exactly 10 digits');
    }

    // Check if it's not all zeros or repeated digits
    if (/^(\d)\1{9}$/.test(cleaned)) {
        throw new Error('Invalid phone number pattern');
    }

    // Format as XXX-XXX-XXXX
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};

// POST /api/orders - Create a new order
router.post('/', createOrderLimiter, [
    body('customerName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Customer name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Customer name can only contain letters and spaces'),
    body('phoneNumber')
        .trim()
        .custom((value) => {
            try {
                validateAndFormatPhoneNumber(value);
                return true;
            } catch (error) {
                throw new Error(error.message);
            }
        })
        .withMessage('Please provide a valid 10-digit phone number'),
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),
    body('items.*._id')
        .exists()
        .withMessage('Each item must have an _id'),
    body('items.*.name')
        .exists()
        .withMessage('Each item must have a name'),
    body('items.*.price')
        .isFloat({ min: 0 })
        .withMessage('Each item must have a valid price'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    body('totalAmount')
        .isFloat({ min: 0 })
        .withMessage('Total amount must be a positive number'),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Special instructions cannot exceed 500 characters')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }

    try {
        // Sanitize input
        const orderData = {
            customerName: req.body.customerName.trim(),
            phoneNumber: validateAndFormatPhoneNumber(req.body.phoneNumber.trim()),
            items: req.body.items,
            totalAmount: parseFloat(req.body.totalAmount),
            notes: req.body.notes?.trim(),
            status: 'PENDING'
        };

        const order = await prisma.order.create({
            data: orderData
        });

        return res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Order creation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create order. Please try again later.'
        });
    }
});

// GET /api/orders/:phoneNumber - Get orders by phone number
router.get('/:phoneNumber',
    [
        param('phoneNumber')
            .trim()
            .custom((value) => {
                try {
                    validateAndFormatPhoneNumber(value);
                    return true;
                } catch (error) {
                    throw new Error(error.message);
                }
            })
            .withMessage('Please provide a valid 10-digit phone number')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const formattedPhoneNumber = validateAndFormatPhoneNumber(req.params.phoneNumber);
            console.log('Searching for orders with formatted phone:', formattedPhoneNumber);

            const orders = await prisma.order.findMany({
                where: {
                    phoneNumber: formattedPhoneNumber
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            console.log('Orders fetched successfully:', {
                phoneNumber: formattedPhoneNumber,
                orderCount: orders.length
            });

            res.json(orders);
        } catch (error) {
            console.error('Order fetch error:', {
                error: error.message,
                stack: error.stack,
                phoneNumber: req.params.phoneNumber
            });
            res.status(500).json({
                error: 'Error fetching orders',
                details: error.message
            });
        }
    }
);

// PUT /api/orders/:id - Update order status (admin only)
router.put('/:id',
    [
        param('id').isInt().withMessage('Valid order ID is required'),
        body('status').isIn(['pending', 'completed', 'cancelled'])
            .withMessage('Invalid order status')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const order = await prisma.order.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    status: req.body.status
                }
            });

            res.json(order);
        } catch (error) {
            console.error('Order update error:', error);
            res.status(500).json({ error: 'Error updating order' });
        }
    }
);

module.exports = router; 