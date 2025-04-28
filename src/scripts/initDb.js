require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const sampleMenuItems = [
    // Appetizers
    {
        name: 'Paneer Tikka',
        description: 'Marinated and grilled cottage cheese cubes with bell peppers and onions, served with mint chutney',
        price: 299,
        category: 'Appetizers',
        imageUrl: 'https://www.yummytummyaarthi.com/wp-content/uploads/2015/02/1-24.jpg',
        nutritionalInfo: {
            calories: 280,
            protein: 14,
            carbohydrates: 8,
            fat: 22,
            allergens: ['Dairy']
        }
    },
    {
        name: 'Samosa',
        description: 'Crispy pastry filled with spiced potatoes and green peas, served with tamarind chutney',
        price: 99,
        category: 'Appetizers',
        imageUrl: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2019/11/samosa-recipe.jpg',
        nutritionalInfo: {
            calories: 220,
            protein: 4,
            carbohydrates: 28,
            fat: 12,
            allergens: ['Gluten']
        }
    },

    // Main Courses
    {
        name: 'Butter Chicken',
        description: 'Tender chicken pieces in rich, creamy tomato-based curry with butter and cream',
        price: 399,
        category: 'Main Courses',
        imageUrl: 'https://www.simplyrecipes.com/thmb/LYwosfrO2cGCT2_bGS5wIeHRnd8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__01__Butter-Chicken-LEAD-1-f8a0cd09ea9442ce93651887f164db03.jpg',
        nutritionalInfo: {
            calories: 550,
            protein: 32,
            carbohydrates: 14,
            fat: 42,
            allergens: ['Dairy']
        }
    },
    {
        name: 'Palak Paneer',
        description: 'Fresh spinach curry with cottage cheese cubes and aromatic spices',
        price: 349,
        category: 'Main Courses',
        imageUrl: 'https://sarahsvegankitchen.com/wp-content/uploads/2025/01/Palak-Tofu-7.jpg',
        nutritionalInfo: {
            calories: 380,
            protein: 18,
            carbohydrates: 12,
            fat: 28,
            allergens: ['Dairy']
        }
    },

    // Breads
    {
        name: 'Butter Naan',
        description: 'Soft, buttery leavened bread baked in tandoor',
        price: 69,
        category: 'Sides',
        imageUrl: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/naan-recipe.jpg',
        nutritionalInfo: {
            calories: 180,
            protein: 4,
            carbohydrates: 28,
            fat: 6,
            allergens: ['Gluten', 'Dairy']
        }
    },
    {
        name: 'Garlic Roti',
        description: 'Whole wheat bread with roasted garlic',
        price: 49,
        category: 'Sides',
        imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2022/12/garlic-naan-1.jpg',
        nutritionalInfo: {
            calories: 120,
            protein: 3,
            carbohydrates: 22,
            fat: 2,
            allergens: ['Gluten']
        }
    },

    // Desserts
    {
        name: 'Gulab Jamun',
        description: 'Deep-fried milk solids soaked in sugar syrup, served warm',
        price: 149,
        category: 'Desserts',
        imageUrl: 'https://5.imimg.com/data5/SELLER/Default/2024/2/384944363/DN/MV/KT/144303146/gulab-jamun-desi-ghee.jpg',
        nutritionalInfo: {
            calories: 280,
            protein: 4,
            carbohydrates: 46,
            fat: 10,
            allergens: ['Dairy']
        }
    },
    {
        name: 'Rasmalai',
        description: 'Soft cottage cheese patties in saffron-flavored sweet milk',
        price: 179,
        category: 'Desserts',
        imageUrl: 'https://eatsbyramya.com/wp-content/uploads/2024/10/rasmalai_can_recipe.jpg',
        nutritionalInfo: {
            calories: 320,
            protein: 8,
            carbohydrates: 42,
            fat: 14,
            allergens: ['Dairy']
        }
    },

    // Beverages
    {
        name: 'Masala Chai',
        description: 'Indian spiced tea with milk',
        price: 79,
        category: 'Beverages',
        imageUrl: 'https://goqii.com/blog/wp-content/uploads/shutterstock_1024718095-1024x682.jpg',
        nutritionalInfo: {
            calories: 80,
            protein: 2,
            carbohydrates: 14,
            fat: 2,
            allergens: ['Dairy']
        }
    },
    {
        name: 'Mango Lassi',
        description: 'Sweet yogurt-based drink with mango pulp',
        price: 129,
        category: 'Beverages',
        imageUrl: 'https://www.anediblemosaic.com/wp-content/uploads//2021/09/mango-lassi-featured-image.jpg',
        nutritionalInfo: {
            calories: 160,
            protein: 4,
            carbohydrates: 32,
            fat: 2,
            allergens: ['Dairy']
        }
    }
];

async function initializeDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing menu items
        await MenuItem.deleteMany({});
        console.log('Cleared existing menu items');

        // Insert sample menu items
        await MenuItem.insertMany(sampleMenuItems);
        console.log('Sample menu items inserted successfully');

        await mongoose.disconnect();
        console.log('Database initialization complete');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase(); 