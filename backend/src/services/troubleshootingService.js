export class TroubleshootingService {
  static isTroubleshootingQuestion(message) {
    const keywords = ['error', 'not working', 'broken', 'issue', 'problem', 'help', 'fix', 'bug'];
    return keywords.some(k => message.toLowerCase().includes(k));
  }

  static provideTroubleshootingHelp(message) {
    const lowerMsg = message.toLowerCase();
    
    // Specific error patterns
    if (lowerMsg.includes('backend') || lowerMsg.includes('api') || lowerMsg.includes('500')) {
      return `**Backend/API Issues:**

🔧 **Quick Fixes:**
1. Check if backend is running: \`docker-compose ps\`
2. View backend logs: \`docker-compose logs backend\`
3. Restart backend: \`docker-compose restart backend\`

💡 **Common Causes:**
- Port 5000 already in use
- Database connection failed
- Environment variables missing

**Test:** Try \`curl http://localhost:5000/health\``;
    }
    
    if (lowerMsg.includes('database') || lowerMsg.includes('postgres')) {
      return `**Database Issues:**

🗄️ **Troubleshooting Steps:**
1. Check PostgreSQL status: \`docker exec ecom-postgres psql -U postgres -c "SELECT 1"\`
2. View database logs: \`docker logs ecom-postgres\`
3. Restart database: \`docker-compose restart postgres\`

💡 **Common Issues:**
- Database not initialized
- Wrong credentials
- Port 5432 conflicts

**Fix:** Run migrations with \`docker exec -i ecom-postgres psql -U postgres -d ecom_dash < schema.sql\``;
    }
    
    if (lowerMsg.includes('docker')) {
      return `**Docker Issues:**

🐳 **Quick Commands:**
1. Check containers: \`docker ps\`
2. View all logs: \`docker-compose logs -f\`
3. Restart all: \`docker-compose restart\`
4. Fresh start: \`docker-compose down && docker-compose up -d\`

💡 **Common Problems:**
- Docker Desktop not running
- Port conflicts
- Out of disk space

**Pro Tip:** Use \`docker-compose ps\` to see service health`;
    }
    
    if (lowerMsg.includes('frontend') || lowerMsg.includes('react')) {
      return `**Frontend Issues:**

⚛️ **Quick Fixes:**
1. Clear cache: \`npm run dev\` (restart Vite)
2. Check console: Press F12 in browser
3. Verify API URL in \`.env.local\`

💡 **Common Issues:**
- CORS errors (check backend CORS settings)
- API endpoint wrong (\`VITE_API_URL\`)
- Node modules outdated (\`npm install\`)

**Test:** Open http://localhost:3001 and check browser console`;
    }
    
    // General help
    return `**General Troubleshooting:**

🔍 **Step-by-Step Diagnosis:**
1. **Check Services:** \`docker-compose ps\` - all should be "Up"
2. **View Logs:** \`docker-compose logs -f\` - look for errors
3. **Test Endpoints:**
   - Backend: \`curl http://localhost:5000/health\`
   - Frontend: Open http://localhost:3001

💡 **Quick Fixes:**
- Restart everything: \`docker-compose restart\`
- Check ports: \`netstat -ano | findstr :5000\`
- Fresh start: \`docker-compose down && docker-compose up -d --build\`

What specific error are you seeing?`;
  }
}
