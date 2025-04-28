const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Sides']
    },
    imageUrl: {
        type: String,
        required: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    nutritionalInfo: {
        calories: Number,
        protein: Number,
        carbohydrates: Number,
        fat: Number,
        allergens: [String]
    },
    customizationOptions: [{
        name: String,
        options: [{
            name: String,
            priceAdjustment: Number
        }]
    }]
}, {
    timestamps: true
});

// Create indexes for frequently queried fields
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem; 