# Digital Diner Backend

A Node.js-based backend server for the Digital Diner restaurant ordering system.

## Features

- RESTful API endpoints for menu and orders
- MongoDB for menu items storage
- PostgreSQL for order management
- Input validation and sanitization
- Error handling and logging
- CORS support
- Environment-based configuration

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- PostgreSQL with Prisma
- Express Validator
- CORS
- dotenv for configuration

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd digital-diner-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables by creating a `.env` file:

```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/digital-diner

# PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/digital-diner"

# Server
PORT=3000
```

4. Set up the databases:

```bash
# Initialize PostgreSQL database
npx prisma migrate dev

# Seed the MongoDB database with sample menu items
npm run seed
```

5. Start the development server:

```bash
npm run dev
```

The server will be running at `http://localhost:3000`

## API Endpoints

### Menu

- `GET /api/menu` - Get all menu items
- `GET /api/menu/categories` - Get menu items grouped by category
- `POST /api/menu` - Add a new menu item (admin only)
- `PUT /api/menu/:id` - Update a menu item (admin only)
- `DELETE /api/menu/:id` - Delete a menu item (admin only)

### Orders

- `POST /api/orders` - Place a new order
- `GET /api/orders/:phoneNumber` - Get order history by phone number
- `PUT /api/orders/:id` - Update order status (admin only)

## Project Structure

```
src/
├── models/        # MongoDB models
├── routes/        # API routes
├── scripts/       # Database scripts
└── index.js       # Main application file

prisma/
└── schema.prisma  # Prisma schema
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
