# Complete Setup Script for ecom-dash

Write-Host "🚀 Setting up ecom-dash development environment..." -ForegroundColor Cyan

# Step 1: Install dependencies
Write-Host "`n1️⃣ Installing dependencies..." -ForegroundColor Yellow
cd backend
npm install
cd ../frontend
npm install
cd ..

# Step 2: Setup environment
Write-Host "`n2️⃣ Setting up environment variables..." -ForegroundColor Yellow
Copy-Item ".env.example" -Destination ".env" -Force
Write-Host "⚠️  Please update .env with your actual credentials" -ForegroundColor Red

# Step 3: Start Docker containers
Write-Host "`n3️⃣ Starting Docker containers..." -ForegroundColor Yellow
docker-compose up -d

# Step 4: Run migrations
Write-Host "`n4️⃣ Running database migrations..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
docker exec -it ecom-postgres psql -U postgres -d ecom_dash -f /migrations/001_initial_schema.sql
docker exec -it ecom-postgres psql -U postgres -d ecom_dash -f /migrations/002_add_rls.sql

# Step 5: Verify
Write-Host "`n5️⃣ Verifying setup..." -ForegroundColor Yellow
docker-compose ps

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🗄️ Database: localhost:5432" -ForegroundColor Cyan
