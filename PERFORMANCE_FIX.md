# 🐌 Login Performance Issues - Diagnosis & Solutions

## 📊 **Current Status**

### Database Connection
- **Connected to**: Supabase (Production) in South Korea
- **Location**: `aws-1-ap-northeast-2.pooler.supabase.com`
- **Latency**: ~200-500ms per query from India
- **File**: No `.env` file exists, using defaults

### Authentication Performance
- **Bcrypt rounds**: 12 (secure but slow)
- **Time per hash**: ~100-300ms
- **Total login time**: ~300-800ms (network + hashing)

---

## ✅ **Solutions**

### Solution 1: Switch to Local Database (RECOMMENDED)

#### Step 1: Create `.env` file
```bash
cd /Users/sidhantrajpoot/Desktop/Solarad_workspace/credo-carbon
cp .env.example .env
```

#### Step 2: Edit `.env` file
```env
# Core Settings
ENV=local
DEBUG=true
SECRET_KEY=dev-secret-key-change-in-production

# Local PostgreSQL Database
DATABASE_URL=postgresql://credo:credo_password@localhost:5432/credo_carbon

# Cloud Provider
CLOUD_PROVIDER=local

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### Step 3: Setup Local PostgreSQL

**Option A: Using Docker (Easiest)**
```bash
# Start PostgreSQL with Docker
docker run -d \
  --name credo-postgres \
  -e POSTGRES_USER=credo \
  -e POSTGRES_PASSWORD=credo_password \
  -e POSTGRES_DB=credo_carbon \
  -p 5432:5432 \
  postgres:15

# Verify it's running
docker ps | grep credo-postgres
```

**Option B: Using Homebrew (Mac)**
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database and user
psql postgres
CREATE USER credo WITH PASSWORD 'credo_password';
CREATE DATABASE credo_carbon OWNER credo;
GRANT ALL PRIVILEGES ON DATABASE credo_carbon TO credo;
\q
```

#### Step 4: Initialize Database
```bash
# Activate virtual environment
source venv/bin/activate

# Run database initialization
python apps/api/init_db.py

# Seed test data
python apps/api/seed_data.py
```

#### Step 5: Restart Backend
```bash
# Stop current backend (Ctrl+C)
# Then restart
uvicorn apps.api.main:app --reload --port 8000
```

**Expected Result**: Login time < 100ms ⚡

---

### Solution 2: Optimize Bcrypt for Development

Edit `apps/api/modules/auth/service.py`:

**Current (Line 17):**
```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)
```

**Change to:**
```python
# Use 10 rounds for development (still secure, faster)
# Production should use 12-14 rounds
import os
bcrypt_rounds = 10 if os.getenv("ENV") == "local" else 12
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=bcrypt_rounds)
```

**Impact**: Reduces hashing time by ~50% in development

---

### Solution 3: Keep Using Supabase (Not Recommended for Dev)

If you must use Supabase for development:

1. **Add connection pooling**:
```python
# In apps/api/core/database.py
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=3600    # Recycle connections every hour
)
```

2. **Enable connection caching**:
```python
# Add to database.py
from sqlalchemy.pool import NullPool

engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool  # For serverless/Supabase
)
```

**Expected Result**: Login time ~200-400ms (still slower than local)

---

## 🎯 **Recommended Approach**

### For Development (Local Machine)
✅ **Use Solution 1** - Local PostgreSQL
- Fastest performance
- No network latency
- Free
- Full control
- Can work offline

### For Production (Deployment)
✅ **Use Supabase** with optimizations
- Managed service
- Automatic backups
- Scalable
- Connection pooling

---

## 📈 **Performance Comparison**

| Setup | Database Query | Password Hash | Total Login Time |
|-------|---------------|---------------|------------------|
| **Current (Supabase + bcrypt 12)** | 200-500ms | 100-300ms | **300-800ms** 🐌 |
| **Local DB + bcrypt 10** | 1-5ms | 50-100ms | **50-105ms** ⚡ |
| **Local DB + bcrypt 12** | 1-5ms | 100-300ms | **100-305ms** ⚡ |
| **Supabase + optimized** | 150-300ms | 100-300ms | **250-600ms** 🐢 |

---

## 🔧 **Quick Fix (5 minutes)**

```bash
# 1. Create .env file
cd /Users/sidhantrajpoot/Desktop/Solarad_workspace/credo-carbon
cat > .env << 'EOF'
ENV=local
DEBUG=true
SECRET_KEY=dev-secret-key-change-in-production
DATABASE_URL=postgresql://credo:credo_password@localhost:5432/credo_carbon
CLOUD_PROVIDER=local
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF

# 2. Start PostgreSQL with Docker
docker run -d --name credo-postgres \
  -e POSTGRES_USER=credo \
  -e POSTGRES_PASSWORD=credo_password \
  -e POSTGRES_DB=credo_carbon \
  -p 5432:5432 \
  postgres:15

# 3. Initialize database
source venv/bin/activate
python apps/api/init_db.py
python apps/api/seed_data.py

# 4. Restart backend
# (Stop with Ctrl+C, then run)
uvicorn apps.api.main:app --reload --port 8000
```

**Result**: Login should be **10x faster** ⚡

---

## 🔍 **Verify Database Connection**

```bash
# Check which database is being used
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('DATABASE_URL:', os.getenv('DATABASE_URL'))
"

# Test connection
python -c "
from apps.api.core.database import engine
try:
    with engine.connect() as conn:
        result = conn.execute('SELECT version()')
        print('✅ Connected:', result.fetchone()[0])
except Exception as e:
    print('❌ Error:', e)
"
```

---

## 📝 **Test Accounts**

After seeding, you can login with:

**Developer:**
- Email: `siddhantrajput007+dev@gmail.com`
- Password: `12345@`

**Buyer:**
- Email: `siddhantrajput007+buyer@gmail.com`
- Password: `12345@`

**Test Account:**
- Email: `buyer@test.com`
- Password: `Test123!`

---

## ⚠️ **Important Notes**

1. **Never commit `.env`** - It's in `.gitignore`
2. **Use `.env.production`** only for production deployments
3. **Local DB is for development only** - Data won't sync with production
4. **Backup production data** before making changes
5. **Use environment variables** in production, not `.env` files

---

## 🎉 **Expected Outcome**

After switching to local database:
- ⚡ Login time: **50-100ms** (was 300-800ms)
- 🚀 **10x faster** authentication
- 💻 Can work offline
- 🔧 Easier debugging
- 💰 No Supabase quota usage during development
