require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
    origin: ['https://digitaldiner-xi.netlify.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Load API documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect to MongoDB (for menu items)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB for menu items'))
    .catch(err => console.error('MongoDB connection error:', err));

// Connect to PostgreSQL (for users and orders)
prisma.$connect()
    .then(() => console.log('Connected to PostgreSQL for users and orders'))
    .catch((error) => {
        console.error('PostgreSQL connection error:', error);
        process.exit(1);
    });

// Import routes
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

// Use routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 