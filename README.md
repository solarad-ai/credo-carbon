# CredoCarbon - Carbon Credit Management Platform

A comprehensive full-stack platform for managing carbon credits across the entire project lifecycle — from registration to issuance, trading, and retirement.

![Platform Overview](https://img.shields.io/badge/Status-Development-yellow)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016-black)
![Backend](https://img.shields.io/badge/Backend-FastAPI-green)
![Database](https://img.shields.io/badge/Database-SQLite-blue)

## 🌿 Overview

CredoCarbon is a multi-role carbon credit management ecosystem supporting:

- **Developers** — Register carbon projects, track lifecycle, issue credits, and sell on marketplace
- **Buyers** — Browse marketplace, purchase credits, manage portfolio, and retire credits
- **Multi-Registry Support** — VCS, Gold Standard, ACR, and more

## 🏗️ Architecture

```
credo-carbon-anti-gravity/
├── apps/
│   ├── api/                    # FastAPI Backend
│   │   ├── core/               # Database, models, ports
│   │   ├── modules/            # Feature modules
│   │   │   ├── auth/           # Authentication & JWT
│   │   │   ├── project/        # Project management
│   │   │   ├── notification/   # User notifications
│   │   │   ├── wallet/         # Credit holdings & transactions
│   │   │   ├── marketplace/    # Listings & offers
│   │   │   ├── retirement/     # Credit retirement
│   │   │   ├── dashboard/      # Dashboard statistics
│   │   │   └── audit/          # Audit logging
│   │   ├── main.py             # FastAPI app entry
│   │   └── seed_data.py        # Database seeding
│   │
│   └── web/                    # Next.js Frontend
│       └── src/
│           ├── app/            # App Router pages
│           │   ├── auth/       # Login page
│           │   ├── developer/  # Developer signup/login
│           │   ├── buyer/      # Buyer signup/login
│           │   └── dashboard/  # Protected dashboards
│           ├── components/     # Reusable UI components
│           └── lib/            # Utilities, API client, stores
│
├── infra/                      # Infrastructure configs
│   └── local/                  # Docker compose for local dev
├── .gitignore                  # Git ignore patterns
├── alembic.ini                 # Database migrations config
└── start-dev.bat               # Development startup script
```

## ✨ Features

### Developer Dashboard
- **Project Registration** — Multi-step wizard with validation
- **Project Lifecycle Management** — Validation, verification, issuance tracking
- **Credit Holdings** — View issued credits by project
- **Market Management** — Create listings, manage sell orders
- **Portfolio Analytics** — Revenue tracking, credit statistics

### Buyer Dashboard
- **Marketplace** — Browse and filter credit listings
- **Wallet** — View credit holdings and transactions
- **Offers Management** — Make offers, track status
- **Retirements** — Retire credits with certificate generation
- **Portfolio** — Track purchased credits and impact

### Authentication
- JWT-based authentication
- Role-based access (Developer/Buyer)
- Secure password hashing with bcrypt
- Protected API endpoints

### API Modules
| Module | Endpoints |
|--------|-----------|
| Auth | `/api/auth/login`, `/api/auth/signup`, `/api/auth/developer/login`, `/api/auth/buyer/login` |
| Projects | `/api/projects/`, `/api/projects/{id}` |
| Notifications | `/api/notifications/`, `/api/notifications/{id}/read` |
| Dashboard | `/api/dashboard/developer/stats`, `/api/dashboard/buyer/stats` |
| Wallet | `/api/wallet/summary`, `/api/wallet/transactions` |
| Marketplace | `/api/marketplace/listings`, `/api/marketplace/offers` |
| Retirements | `/api/retirements/`, `/api/retirements/{id}/certificate` |

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd credo-carbon-anti-gravity
   ```

2. **Set up the backend**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate (Windows)
   .\venv\Scripts\activate
   
   # Activate (Mac/Linux)
   source venv/bin/activate
   
   # Install dependencies
   pip install fastapi uvicorn sqlalchemy passlib python-jose bcrypt python-multipart aiofiles email-validator
   ```

3. **Set up the frontend**
   ```bash
   cd apps/web
   npm install
   cd ../..
   ```

4. **Seed the database**
   ```bash
   python -m apps.api.seed_data
   ```

### Running the Application

**Option 1: Using the startup script (Windows)**
```bash
.\start-dev.bat
```

**Option 2: Manual startup**
```bash
# Terminal 1 - Backend
python -c "import uvicorn; from apps.api.main import app; uvicorn.run(app, host='127.0.0.1', port=8000)"

# Terminal 2 - Frontend
cd apps/web
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Developer | developer@test.com | Test123! |
| Buyer | buyer@test.com | Test123! |

## 🛠️ Development

### Database Commands
```bash
# Seed fresh data
python -m apps.api.seed_data

# Clean database (drops all tables)
python -m apps.api.cleanup_db
```

### Project Structure

**Frontend (Next.js 16)**
- App Router with TypeScript
- Tailwind CSS for styling
- Radix UI components (shadcn/ui)
- Zustand for state management

**Backend (FastAPI)**
- SQLAlchemy ORM
- JWT authentication
- Hexagonal architecture with ports/adapters
- SQLite database (development)

## 📁 Key Files

| File | Purpose |
|------|---------|
| `apps/api/main.py` | FastAPI application entry point |
| `apps/api/core/models.py` | SQLAlchemy database models |
| `apps/api/core/database.py` | Database configuration |
| `apps/web/src/lib/api.ts` | Frontend API client |
| `apps/web/src/lib/constants.ts` | Shared constants (countries, etc.) |

## 🔧 Environment Variables

Create a `.env` file in the root directory:
```env
DATABASE_URL=sqlite:///./credo_carbon.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 📊 Database Models

- **User** — Authentication, roles, profile data
- **Project** — Carbon projects with wizard data
- **CreditHolding** — Credit ownership records
- **Transaction** — All credit movements
- **MarketListing** — Marketplace listings
- **Offer** — Purchase offers
- **Retirement** — Retired credits with certificates
- **Notification** — User notifications
- **AuditLog** — System audit trail

## 🎨 UI Components

Built with shadcn/ui components:
- Button, Card, Input, Label
- Select, Tabs, Badge
- Dialog, Dropdown Menu
- Progress, Avatar

## 📝 License

This project is proprietary software.

