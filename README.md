x# SMOCHA STAND

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

## Getting Started

### Prerequisites

- Python 3.10+ and `pip`
- Node.js 18+ and `npm`
- Git (optional, for cloning the repository)

### Backend (development)

1. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask backend:
   ```bash
   python run.py
   ```

4. The backend will be available at:
   ```text
   http://127.0.0.1:5000
   ```

### Frontend (development)

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite dev server:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```

3. Open the app in your browser:
   ```text
   http://localhost:5173/
   ```

### Running both locally

- Start the backend in one terminal
- Start the frontend in another terminal
- The frontend is configured to call the backend at `http://127.0.0.1:5000`

### Production build

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the built frontend with any static site host.
3. Deploy the Flask backend with a production WSGI server (for example `gunicorn`) and set environment variables before starting:
   - `SECRET_KEY`
   - `JWT_SECRET_KEY`
   - `DATABASE_URL`
   - `JWT_ACCESS_TOKEN_EXPIRES_MINUTES`

Example backend start command:
```bash
export FLASK_ENV=production
export SECRET_KEY="your-secret"
export JWT_SECRET_KEY="your-jwt-secret"
export DATABASE_URL="sqlite:///smocha_stand.db"
python run.py
```

> Note: This repository uses separate frontend and backend apps. The frontend build can be served independently from the Flask API.

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