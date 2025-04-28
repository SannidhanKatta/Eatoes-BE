const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/orders - Create a new order
router.post('/',
    [
        body('customerName').trim().notEmpty().withMessage('Customer name is required'),
        body('phoneNumber').trim().notEmpty()
            .matches(/^\+?[\d\s-]+$/).withMessage('Valid phone number is required'),
        body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
        body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const order = await prisma.order.create({
                data: {
                    customerName: req.body.customerName,
                    phoneNumber: req.body.phoneNumber,
                    items: req.body.items,
                    totalAmount: req.body.totalAmount,
                    notes: req.body.notes || ''
                }
            });

            res.status(201).json(order);
        } catch (error) {
            console.error('Order creation error:', error);
            res.status(500).json({ error: 'Error creating order' });
        }
    }
);

// GET /api/orders/:phoneNumber - Get orders by phone number
router.get('/:phoneNumber',
    [
        param('phoneNumber').trim().notEmpty()
            .matches(/^\+?[\d\s-]+$/).withMessage('Valid phone number is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const orders = await prisma.order.findMany({
                where: {
                    phoneNumber: req.params.phoneNumber
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            res.json(orders);
        } catch (error) {
            console.error('Order fetch error:', error);
            res.status(500).json({ error: 'Error fetching orders' });
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