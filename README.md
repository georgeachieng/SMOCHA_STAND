# Smocha Stand Inventory System

Smocha Stand Inventory System is a Flask + React application for tracking stock transactions and inventory operations.

This branch (`feat/person4-transactions-frontend`) focuses on **Person 4 integration work**: backend transaction endpoints, frontend transaction pages, app structure, and integration scaffolding.

## Tech Stack

Backend:
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- Marshmallow
- SQLite (default local database)

Frontend:
- React (Create React App)
- React Router

## Current Scope on This Branch

Implemented:
- Flask app factory and extension setup
- Transaction model + schema
- Transaction API endpoints (`GET all`, `GET by id`, `POST stock_in/stock_out`)
- Stock-out guard (cannot remove more than available stock)
- React pages for transaction history and stock form
- Auth context + reusable hooks scaffolding
- Agreed frontend folder structure scaffold for team collaboration

## Project Structure

```text
smocha-stand/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── extensions.py
│   ├── models/
│   │   └── stock_transaction.py
│   ├── routes/
│   │   └── transaction_routes.py
│   └── schemas/
│       └── transaction_schema.py
├── migrations/
├── run.py
├── requirements.txt
├── frontend/                 # agreed team folder/file structure scaffold
└── smocha-frontend/          # active CRA frontend app
```

## API Endpoints (Transactions)

Base URL:
- `http://127.0.0.1:5000/api/transactions`

Endpoints:
- `GET /` - get all transactions
- `GET /<id>` - get a single transaction
- `POST /` - create stock transaction (`stock_in` or `stock_out`)

### Example POST Request

```json
{
  "product_id": 1,
  "user_id": 1,
  "transaction_type": "stock_in",
  "quantity": 10,
  "note": "morning restock"
}
```

### Response Format

Success:
```json
{
  "status": "success",
  "message": "...",
  "data": {}
}
```

Error:
```json
{
  "status": "error",
  "message": "...",
  "errors": []
}
```

## Setup Instructions

### 1) Clone and enter project

```bash
git clone <repo-url>
cd smocha-stand
```

### 2) Backend setup (Flask)

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create environment file (`.env`) if needed:

```env
SECRET_KEY=smocha-secret-key
JWT_SECRET_KEY=smocha-jwt-secret
DATABASE_URL=sqlite:///smocha.db
```

Run migrations:

```bash
flask --app run.py db upgrade
```

Run backend server:

```bash
python run.py
```

Backend runs on:
- `http://127.0.0.1:5000`

### 3) Frontend setup (React)

```bash
cd smocha-frontend
npm install
npm start
```

Frontend runs on:
- `http://localhost:3000`

## Frontend Routing (Current)

In active app (`smocha-frontend/src/App.js`):
- `/` -> Dashboard (transaction history)
- `/stock` -> StockForm (create transaction)

## Notes for Team Integration

- `frontend/` contains the agreed feature-based file layout for team ownership.
- `smocha-frontend/` is the currently running React app used for integration checks.
- Person 4 role on this branch: integration plumbing and API connection support.

## Git Workflow

Main working branch for this integration:
- `feat/person4-transactions-frontend`

Typical workflow:
```bash
git checkout feat/person4-transactions-frontend
git pull origin feat/person4-transactions-frontend
# make changes
git add .
git commit -m "<message>"
git push origin feat/person4-transactions-frontend
```

## Known Next Steps

- Finalize service-layer implementations for all modules
- Replace any remaining temporary/stub model dependencies with teammate models
- Add/expand tests for transaction routes and integration flow
- Improve user-facing error handling and loading states
