import { generateChatResponse } from '../services/geminiService.js';
import { getKaggleData } from '../services/dataService.js';

export const handleGeminiChat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required in the request body.' });
    }
    
    const kaggleData = getKaggleData();
    const responseText = await generateChatResponse(message, kaggleData);

    console.log(`[Fick AI] ✅ Response generated successfully (${responseText.length} chars)`);

    res.json({
      response: responseText,
      timestamp: new Date().toISOString(),
      source: 'Fick AI - Powered by Gemini',
      model: 'gemini-1.5-pro-latest' // ✅ FIX: Updated to reflect the correct model name
    });

  } catch (error) {
    // This passes the error to our centralized error handler
    // while adding extra context for a user-friendly response.
    const kaggleData = getKaggleData();
    const fallbackRevenue = kaggleData 
      ? kaggleData.sales.reduce((s, x) => s + (x.total_amount || 0), 0).toFixed(0) 
      : '0';

    const businessSnapshot = `
**Your Business Snapshot:**
- 📊 Transactions: ${kaggleData?.metadata.total_sales.toLocaleString() || 'N/A'}
- 👥 Customers: ${kaggleData?.customers.length.toLocaleString() || 'N/A'}
- 💰 Revenue: £${fallbackRevenue}`;
    
    error.customResponse = `Hi! I'm Fick AI, but I'm having trouble connecting right now. ${businessSnapshot}\n\nError: ${error.message}\n\nPlease check your GEMINI_API_KEY in the .env file.`;
    next(error); 
  }
};

