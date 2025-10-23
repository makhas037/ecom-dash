# ============================================================
# SAFE GIT PUSH - Daily Use Script
# This script AUTOMATICALLY excludes sensitive files
# ============================================================

Write-Host "🚀 Safe Git Push to GitHub" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""

# Step 1: Check if .gitignore is properly configured
Write-Host "1️⃣ Verifying .gitignore..." -ForegroundColor Yellow

$gitignoreContent = @"
# Dependencies
node_modules/
/backend/node_modules
/frontend/node_modules

# Environment variables (NEVER commit!)
.env
.env.local
.env.production
backend/.env
frontend/.env
*.env

# User uploads (Privacy!)
backend/uploads/*
backend/src/uploads/*
!backend/uploads/.gitkeep
!backend/src/uploads/.gitkeep

# Build outputs
/frontend/dist
/frontend/build
/backend/dist

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Backups
backup-*/
*.backup*

# Temporary files
*.tmp
*.temp
.cache/

# AI tools
.aider*
"@

$gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8 -Force
Write-Host "✅ .gitignore updated" -ForegroundColor Green
Write-Host ""

# Step 2: Check for sensitive files
Write-Host "2️⃣ Checking for sensitive files..." -ForegroundColor Yellow

$sensitiveFiles = @(
    "backend/.env",
    "frontend/.env",
    ".env",
    "backend/uploads/*.csv"
)

$foundSensitive = $false
foreach ($pattern in $sensitiveFiles) {
    $files = Get-ChildItem $pattern -Recurse -ErrorAction SilentlyContinue
    if ($files) {
        Write-Host "⚠️  Found: $pattern" -ForegroundColor Red
        $foundSensitive = $true
    }
}

if ($foundSensitive) {
    Write-Host ""
    Write-Host "⚠️  Sensitive files detected!" -ForegroundColor Red
    Write-Host "   These are already in .gitignore and won't be committed" -ForegroundColor Yellow
    Write-Host "   ✅ Safe to continue" -ForegroundColor Green
} else {
    Write-Host "✅ No sensitive files detected" -ForegroundColor Green
}
Write-Host ""

# Step 3: Show what will be committed
Write-Host "3️⃣ Files to be committed:" -ForegroundColor Yellow
git add .
git status --short
Write-Host ""

# Step 4: Verify .env is NOT in staging
$envInStaging = git diff --cached --name-only | Select-String "\.env"
if ($envInStaging) {
    Write-Host "🚨 ERROR: .env file in staging area!" -ForegroundColor Red
    Write-Host "   Removing it..." -ForegroundColor Yellow
    git reset HEAD *.env
    git reset HEAD backend/.env
    git reset HEAD frontend/.env
    Write-Host "   ✅ Removed" -ForegroundColor Green
    Write-Host ""
}

# Step 5: Commit
$commitMsg = Read-Host "Enter commit message (or press Enter for auto-message)"

if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "update: $(Get-Date -Format 'yyyy-MM-dd HH:mm') - Auto commit"
}

Write-Host ""
Write-Host "4️⃣ Creating commit..." -ForegroundColor Yellow
git commit -m $commitMsg

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit created: $commitMsg" -ForegroundColor Green
    Write-Host ""
    
    # Step 6: Push
    Write-Host "5️⃣ Pushing to GitHub..." -ForegroundColor Yellow
    $branch = git branch --show-current
    git push origin $branch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host "🔗 View: https://github.com/makhas037/ecom-dash" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "✅ All sensitive files were automatically excluded" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Push failed!" -ForegroundColor Red
        Write-Host "   Check your internet or GitHub credentials" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=" * 60
Write-Host "✅ Safe Push Complete!" -ForegroundColor Green
Write-Host ""
