import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY is not set in .env file. Fick AI will be unavailable.');
}

// Initialize the Generative AI client once (Singleton pattern)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro-latest', // Using the recommended latest model
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2048,
  },
});

function buildPrompt(userMessage, kaggleData) {
  const dataContext = kaggleData ? `
**FiberOps Real Data:**
- Transactions: ${kaggleData.metadata.total_sales.toLocaleString()}
- Customers: ${kaggleData.customers.length.toLocaleString()}
- Revenue: £${kaggleData.sales.reduce((s, x) => s + (x.total_amount || 0), 0).toFixed(0)}
- Active (30d): ${kaggleData.customers.filter(c => c.days_since_last_order <= 30).length}
- At-Risk: ${kaggleData.customers.filter(c => c.days_since_last_order > 60).length}

**ML Algorithms:**
1. ARIMA (Sales Forecasting) - 87% accuracy
2. Logistic Regression (Churn Prediction) - 82% precision
3. K-means Clustering (4 segments)
4. XGBoost (Demand Prediction)
5. Isolation Forest (Anomaly Detection)
` : 'No data loaded';

  return `You are Fick AI, FiberOps' intelligent business analytics assistant.

${dataContext}

Current Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

User Question: ${userMessage}

Instructions:
- Use SPECIFIC numbers from the data above
- Explain ML algorithms when asked
- Provide actionable business insights
- Format with emojis and markdown
- Be helpful, friendly, and specific

Respond as Fick AI:`;
}

export const generateChatResponse = async (userMessage, kaggleData) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured on the server.");
  }
  
  const prompt = buildPrompt(userMessage, kaggleData);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  if (!response) {
      throw new Error("Failed to get a valid response from the AI model.");
  }
  
  return response.text();
};