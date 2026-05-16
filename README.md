# DressUp - Second-Hand Clothing Marketplace

A Vinted-like platform built with Node.js, Express.js, Socket.io, and MongoDB for buying and selling second-hand clothing.

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library (functional components only)
- **React Router DOM** - Navigation
- **Context API** - Global state management
- **Axios** - HTTP client
- **Socket.io-client** - Real-time messaging

## Features Implemented

### Backend
- User authentication (register, login, get current user) with JWT
- Product CRUD with ownership protection
- Comment system per product
- Favorites system with duplicate prevention
- Real-time messaging with Socket.io
- Message persistence in MongoDB

### Frontend
- Responsive marketplace UI with pastel boutique theme
- Product browsing with category filters and search
- Product details with comments section
- Create/edit/delete product listings
- Favorites management
- Real-time private messaging
- Protected routes for authenticated users

## Project Structure

```
DRESSUP/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Comment.js
│   │   └── Message.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── commentController.js
│   │   └── favoriteController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── messageRoutes.js
│   │   └── favoriteRoutes.js
│   ├── socket/
│   │   └── socketServer.js
│   ├── utils/
│   │   └── seedData.js
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── CommentSection.jsx
    │   │   └── ChatBox.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx
    │   │   ├── AddProduct.jsx
    │   │   ├── ProductDetails.jsx
    │   │   ├── Favorites.jsx
    │   │   └── Messages.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── socket.js
    │   └── index.css
    ├── App.jsx
    ├── App.css
    ├── main.jsx
    └── vite.config.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected, seller only)
- `DELETE /api/products/:id` - Delete product (protected, seller only)

### Comments
- `POST /api/comments` - Add comment to product (protected)
- `GET /api/comments/product/:productId` - Get comments for product

### Messages
- `POST /api/messages` - Send message (protected)
- `GET /api/messages/:otherUserId` - Get conversation (protected)

### Favorites
- `GET /api/favorites` - Get user's favorites (protected)
- `POST /api/favorites/:productId` - Add to favorites (protected)
- `DELETE /api/favorites/:productId` - Remove from favorites (protected)

## Socket.io Events

### Client -> Server
- `join-room` - User joins their messaging room
- `send-message` - Send private message
- `typing` - User is typing indicator
- `stop-typing` - User stopped typing

### Server -> Client
- `receive-message` - New message received
- `message-sent` - Message sent confirmation
- `user-typing` - User is typing notification
- `user-stopped-typing` - User stopped typing notification

## Installation & Running

### Backend
1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dressup
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
```

4. Seed mock data (optional):
```bash
npm run seed
```

5. Start server:
```bash
npm start
```

### Frontend
1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Sample Login Credentials (after seeding)
- Email: alice@example.com | Password: password123
- Email: bob@example.com | Password: password123
- Email: charlie@example.com | Password: password123

## UI Theme
The frontend uses a soft pastel boutique aesthetic:
- Pink: #F8C8DC
- Yellow: #FFF4B5
- White: #FFFFFF
- Dark Gray: #4A4A4A
- Rounded corners: 12px
- Soft shadows for depth

## Project Structure Notes

### Important Directories (Do Not Delete)

- **`backend/`** - Contains all server-side code:
  - `server.js` - Express server with Socket.io integration
  - `config/db.js` - MongoDB connection
  - `models/` - Mongoose schemas for User, Product, Comment, Message
  - `controllers/` - Business logic for all API endpoints
  - `routes/` - API route definitions
  - `middleware/` - Authentication middleware
  - `socket/` - Socket.io event handlers for real-time messaging

- **`frontend/`** - Contains all client-side code:
  - `App.jsx` - Main app component with routing
  - `main.jsx` - React entry point
  - `src/components/` - Reusable UI components (Navbar, ProductCard, etc.)
  - `src/pages/` - Page components (Home, Login, Profile, etc.)
  - `src/context/` - AuthContext for global authentication state
  - `src/services/` - API and Socket.io service layers
  - `src/index.css` - Global styles with pastel boutique theme
  - `vite.config.js` - Vite build configuration
  - `package.json` - Frontend dependencies

### Deleted Directories (Safe to Remove)

The following were removed as they are either:
- **Build artifacts** (`dist/`) - Generated automatically when running `npm run build`
- **Unused/empty folders** (`build/`, `public/`, `.postman/`, `postman/`, `utils/`) - Not referenced by the project

These deletions do not affect functionality since:
- Vite rebuilds `dist/` on every `npm run build`
- `index.html` lives in `frontend/` root (not a separate `public/` folder)
- No postman collections exist in the project
- No custom utils folder is imported anywhere

## License

MIT