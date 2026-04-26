# SMOCHA STAND

A full-stack inventory management system built with Flask (backend) and React (frontend).

## Features

- User authentication and authorization
- Product management
- Category management
- Supplier management
- Inventory tracking
- Low stock alerts

## Tech Stack

### Backend
- Flask
- SQLAlchemy
- JWT for authentication
- Marshmallow for serialization

### Frontend
- React
- React Router
- Vite for build tooling

## Setup

### Backend

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   python run.py
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## API Endpoints

- Authentication: `/auth`
- Users: `/users`
- Categories: `/api/categories`
- Products: `/api/products`
- Suppliers: `/api/suppliers`
- Inventory: `/api/inventory`

## Testing

Run tests with:
```bash
pytest
```

## License

MIT