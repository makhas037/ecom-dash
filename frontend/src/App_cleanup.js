// Add this at the very top of App.jsx, before any imports

// Clear console on every page load (development only)
if (import.meta.env.DEV) {
  console.clear();
  
  // Auto-clear expired tokens
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload));
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        console.log('🧹 Cleared expired authentication');
      }
    } catch {
      localStorage.clear();
    }
  }
}
