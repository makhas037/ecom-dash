import { generateChatResponse } from '../services/geminiService.js';
import { getKaggleData } from '../services/dataService.js';

export const handleGeminiChat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const kaggleData = getKaggleData();
    const responseText = await generateChatResponse(message, kaggleData);

    console.log(`[Fick AI] ✅ Response generated (${responseText.length} chars)`);

    res.json({
      response: responseText,
      timestamp: new Date().toISOString(),
      source: 'Fick AI - Powered by Gemini',
      model: 'gemini-1.5-pro-latest' // Reflects the actual model used
    });

  } catch (error) {
    // This allows our central error handler to catch it,
    // but we can also log specific context here.
    console.error('[Fick AI] ❌ Error in chat controller:', error.message);
    
    // We create a user-friendly error payload and pass it to the next middleware
    const kaggleData = getKaggleData();
    const businessSnapshot = `
**Your Business Snapshot:**
- 📊 Transactions: ${kaggleData?.metadata.total_sales.toLocaleString() || 0}
- 👥 Customers: ${kaggleData?.customers.length.toLocaleString() || 0}
- 💰 Revenue: £${kaggleData ? kaggleData.sales.reduce((s, x) => s + (x.total_amount || 0), 0).toFixed(0) : 0}`;
    
    error.customResponse = `Hi! I'm Fick AI, but I'm having trouble connecting right now. ${businessSnapshot}\n\nError: ${error.message}\n\nPlease check your GEMINI_API_KEY in .env file.`;
    next(error); // Pass the error to the centralized handler
  }
};