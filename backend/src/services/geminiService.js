import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// A warning is logged if the API key is missing.
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is not set in the .env file. The AI chat feature will be disabled.');
}

// Initialize the Generative AI client once (Singleton pattern for efficiency).
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro-latest', // ✅ FIX: Changed to the recommended stable model identifier
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2048,
  },
});

/**
 * Constructs a detailed prompt for the Gemini model.
 * @param {string} userMessage The user's question.
 * @param {object} kaggleData The loaded dataset for context.
 * @returns {string} The complete prompt string.
 */
function buildPrompt(userMessage, kaggleData) {
  const dataContext = kaggleData ? `
**FiberOps Real-Time Data Snapshot:**
- Total Transactions: ${kaggleData.metadata.total_sales.toLocaleString()}
- Total Customers: ${kaggleData.customers.length.toLocaleString()}
- Total Revenue: £${kaggleData.sales.reduce((s, x) => s + (x.total_amount || 0), 0).toFixed(0)}
- Active Customers (last 30 days): ${kaggleData.customers.filter(c => c.days_since_last_order <= 30).length}
- At-Risk Customers (over 60 days): ${kaggleData.customers.filter(c => c.days_since_last_order > 60).length}

**Available ML Models & Algorithms:**
1. ARIMA (Sales Forecasting) - Accuracy: 87%
2. Logistic Regression (Churn Prediction) - Precision: 82%
3. K-means Clustering (Customer Segmentation) - 4 Segments Identified
4. XGBoost (Product Demand Prediction)
5. Isolation Forest (Fraud & Anomaly Detection)
` : 'No real-time data is currently loaded.';

  // The current time is formatted for an Indian audience as requested.
  const currentTimeIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return `You are Fick AI, the intelligent business analytics assistant for a company named FiberOps.

${dataContext}

Current Date & Time: ${currentTimeIST}

User's Question: "${userMessage}"

Your Instructions:
- Provide specific, actionable business insights.
- Use the exact numbers and metrics from the data snapshot provided above.
- When asked about predictions or models, explain the relevant ML algorithm.
- Format your response clearly using markdown and emojis for better readability.
- Maintain a helpful, friendly, and professional tone.

Respond as Fick AI:`;
}

/**
 * Generates a chat response using the Gemini model.
 * @param {string} userMessage The message from the user.
 * @param {object} kaggleData The dataset to use as context.
 * @returns {Promise<string>} The text response from the AI.
 */
export const generateChatResponse = async (userMessage, kaggleData) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("The Gemini API key is not configured on the server.");
  }
  
  const prompt = buildPrompt(userMessage, kaggleData);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  if (!response) {
      throw new Error("Failed to receive a valid response from the AI model.");
  }
  
  return response.text();
};

