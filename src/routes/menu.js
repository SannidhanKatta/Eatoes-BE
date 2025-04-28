const express = require('express');
const { body, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// GET /api/menu - Get all menu items
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ isAvailable: true });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching menu items' });
    }
});

// GET /api/menu/categories - Get menu items grouped by category
router.get('/categories', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ isAvailable: true });
        const categorizedMenu = menuItems.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});
        res.json(categorizedMenu);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categorized menu' });
    }
});

// POST /api/menu - Add a new menu item (admin only)
router.post('/',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('category').isIn(['Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Sides'])
            .withMessage('Invalid category')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const menuItem = new MenuItem(req.body);
            await menuItem.save();
            res.status(201).json(menuItem);
        } catch (error) {
            res.status(500).json({ error: 'Error creating menu item' });
        }
    }
);

// PUT /api/menu/:id - Update a menu item (admin only)
router.put('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ error: 'Error updating menu item' });
    }
});

// DELETE /api/menu/:id - Delete a menu item (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting menu item' });
    }
});

module.exports = router; 