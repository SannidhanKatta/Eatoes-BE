# Digital Diner Backend

A Node.js-based backend server for the Digital Diner restaurant ordering system, utilizing both MongoDB and PostgreSQL databases.

## Live API

[https://eatoes-be.onrender.com](https://eatos-be.onrender.com)

## Database Architecture

### MongoDB (Menu Items)

- Chosen for menu items due to:
  - Flexible schema for varying menu item attributes
  - Efficient for read-heavy operations
  - Easy to update and modify menu structure
  - Better for handling nested data (ingredients, variations)
  - No complex relationships needed

### PostgreSQL (Orders & Users)

- Selected for order management due to:
  - ACID compliance for order transactions
  - Strong data consistency requirements
  - Better for complex queries and reporting
  - Structured data with relationships
  - Future scalability for user management

## API Endpoints

### Menu Endpoints (MongoDB)

```
GET /api/menu/categories
- Returns menu items grouped by categories
- Query params: none
- Response: { [category: string]: MenuItem[] }

GET /api/menu
- Returns all menu items
- Query params: none
- Response: MenuItem[]

POST /api/menu (Admin)
- Creates a new menu item
- Body: { name, price, category, description }
- Response: MenuItem

PUT /api/menu/:id (Admin)
- Updates a menu item
- Body: { name?, price?, category?, description? }
- Response: MenuItem

DELETE /api/menu/:id (Admin)
- Deletes a menu item
- Response: { success: true }
```

### Order Endpoints (PostgreSQL)

```
POST /api/orders
- Places a new order
- Body: { customerName, phoneNumber, items[], totalAmount, notes? }
- Response: { success: true, data: Order }

GET /api/orders/:phoneNumber
- Retrieves order history
- Params: phoneNumber
- Response: Order[]

PUT /api/orders/:id (Admin)
- Updates order status
- Body: { status }
- Response: Order
```

## Tech Stack

- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Menu database & ODM
- **PostgreSQL & Prisma** - Orders database & ORM
- **Express Validator** - Input validation
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing
- **Swagger/OpenAPI** - API documentation

## Project Structure

```
src/
├── routes/          # API route handlers
│   ├── menu.js     # Menu endpoints
│   └── orders.js   # Order endpoints
├── models/          # MongoDB models
│   └── MenuItem.js # Menu item schema
├── scripts/         # Database scripts
│   └── initDb.js   # Database seeding
└── index.js        # Main application file

prisma/
├── schema.prisma   # Prisma schema
└── migrations/     # Database migrations
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/SannidhanKatta/Eatoes-BE.git
   cd digital-diner/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with:

   ```
   # MongoDB (for menu items)
   MONGODB_URI=your-mongodb-connection-string

   # PostgreSQL (for orders)
   DATABASE_URL=your-postgresql-connection-string

   # Server
   PORT=3000
   ```

4. Set up the databases:

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run PostgreSQL migrations
   npx prisma migrate deploy

   # Seed the menu items in MongoDB
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The backend is deployed on Render:

1. Configure environment variables in Render dashboard
2. Set up build command: `npm install && npm run build`
3. Set up start command: `npm start`
4. Enable auto-deploy from GitHub

## Error Handling

- Consistent error response format
- Validation error handling
- Database error handling
- Rate limiting errors
- CORS error handling

## Security Measures

- Input validation and sanitization
- Rate limiting on sensitive endpoints
- CORS configuration
- Error message sanitization
- No sensitive data in responses

## Performance Optimizations

- Database connection pooling
- Query optimization
- Response caching (where appropriate)
- Rate limiting
- Efficient error handling

## Monitoring and Logging

- Error logging
- Request logging
- Database query logging
- Performance monitoring

## Known Limitations

- Basic rate limiting implementation
- No user authentication system
- Limited admin functionality
- Basic error logging
