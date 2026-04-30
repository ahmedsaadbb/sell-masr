# Sell Masr (بيع مصر)

The premier dropshipping platform tailored for the Egyptian market.

## Project Structure

- `backend/`: FastAPI application with SQLModel and JWT authentication.
- `frontend-admin/`: Next.js dashboard for platform administrators.
- `frontend-storefront/`: Next.js marketplace for dropshippers and customers.

## Technologies

- **Backend**: Python 3.14, FastAPI, SQLModel (SQLAlchemy + Pydantic), Alembic, SQLite/PostgreSQL.
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Axios.
- **Integrations**: Paymob (Payments), OpenAI (AI Content), Bosta/Aramex (Shipping - planned).

## Getting Started

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `uvicorn app.main:app --reload`

### Frontend
1. `cd frontend-storefront` (or `frontend-admin`)
2. `npm install`
3. `npm run dev`
