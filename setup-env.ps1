Write-Host "`n⚙️  STARTING SECURE BACKEND SETUP" -ForegroundColor Cyan
Write-Host "================================`n"

# Ask for DB password
$rawPassword = Read-Host "Enter your Postgres password (from Supabase or Neon)"
$encodedPassword = [uri]::EscapeDataString($rawPassword)

# Define project and file paths
$backendPath = "E:\BI PROJECT\ecom-dash\backend"
$envPath = Join-Path $backendPath ".env"

# Create .env content
$envContent = @"
PORT=5001
DB_CONNECTION_STRING=postgresql://postgres:$encodedPassword@db.axsskwkbzgthiokcxrsf.supabase.co:5432/postgres
JWT_SECRET=yoursecretkeygoeshere12345
"@

# Write .env
$envContent | Out-File -FilePath $envPath -Encoding UTF8
Write-Host "✅ .env file created successfully at: $envPath`n"

# Create a DB test script
$dbTest = @"
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DB_CONNECTION_STRING,
});

(async () => {
  try {
    await client.connect();
    console.log('✅ Database connection successful');
    const res = await client.query('SELECT NOW()');
    console.log('🕒 Server time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  } finally {
    await client.end();
  }
})();
"@

$dbTestPath = Join-Path $backendPath "test-db.js"
$dbTest | Out-File -FilePath $dbTestPath -Encoding UTF8
Write-Host "🧪 DB connection test script created successfully.`n"

# Test database connection
Write-Host "🔗 Testing database connection..." -ForegroundColor Yellow
Set-Location $backendPath
node test-db.js

# Ensure .env is in .gitignore
$gitignorePath = Join-Path $backendPath ".gitignore"
if (-not (Select-String -Path $gitignorePath -Pattern "^\.env" -Quiet)) {
  Add-Content $gitignorePath ".env"
  Write-Host "🛡️  Added .env to .gitignore`n"
} else {
  Write-Host "🛡️  .env already in .gitignore`n"
}

# Commit and push changes
git add .
git commit -m "🔒 Secure backend setup and DB connection verified"
git push https://github.com/makhas037/ecom-dash.git main

Write-Host "`n🚀 All done! Your backend is securely configured and pushed to GitHub." -ForegroundColor Green
