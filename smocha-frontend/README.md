# Smocha Frontend

Frontend application for the **Smocha Stand Inventory System**.

This app is built with React and currently supports transaction viewing and stock transaction submission, while also providing the shared structure/services/hooks for team integration.

## Stack

- React (Create React App)
- React Router
- JavaScript (JSX)

## Current Frontend Scope

Implemented pages:
- `src/pages/Dashboard.js` - lists stock transactions
- `src/pages/StockForm.js` - creates stock in/out transactions

App shell:
- `src/App.js` - routing + navbar + `AuthProvider`

Integration scaffolding:
- `src/services/` - API/service layer files
- `src/context/AuthContext.jsx` - auth state provider
- `src/hooks/useAuth.js`, `src/hooks/useFetch.js`

Team structure scaffolding (for module ownership):
- `src/components/{auth,layout,categories,suppliers,products,inventory}`
- `src/pages/*.jsx` module pages
- `src/styles/*.css`

## Project Structure

```text
smocha-frontend/
├── public/
└── src/
    ├── components/
    │   ├── auth/
    │   ├── layout/
    │   ├── categories/
    │   ├── suppliers/
    │   ├── products/
    │   └── inventory/
    ├── context/
    ├── hooks/
    ├── pages/
    ├── services/
    ├── styles/
    ├── App.js
    └── index.js
```

## Routes (Current)

- `/` -> Dashboard
- `/stock` -> Stock transaction form

## API Integration

Expected backend base URL:
- `http://127.0.0.1:5000`

Transaction endpoints used:
- `GET /api/transactions/`
- `POST /api/transactions/`

## Setup

From repo root:

```bash
cd smocha-frontend
npm install
npm start
```

Frontend runs on:
- `http://localhost:3000`

## Build

```bash
npm run build
```

## Team Integration Notes

- Keep API calls in `src/services/` (avoid hardcoded URLs inside page components).
- Keep page-level UI in `src/pages/` and reusable pieces in `src/components/`.
- Keep auth/session logic centralized in `AuthContext` + hooks.

## Contribution Workflow

```bash
git checkout feat/person4-transactions-frontend
git pull origin feat/person4-transactions-frontend
# make changes
git add .
git commit -m "<message>"
git push origin feat/person4-transactions-frontend
```
