import { ChartService } from './chartService.js';
import { AnalyticsService } from './analyticsService.js';
import { TroubleshootingService } from './troubleshootingService.js';
import { ChatHistoryService } from './chatHistoryService.js';

export class AIOrchestrator {
  static async processMessage(message, userId) {
    let response = '';
    let messageType = 'general';
    let chartData = null;
    let metadata = {};

    // 1. Check for chart requests
    if (ChartService.detectChartRequest(message)) {
      messageType = 'chart';
      chartData = await ChartService.generateChart(message, userId);
      if (chartData) {
        response = `I've generated a ${chartData.type} chart showing ${chartData.title}. This visualization helps you understand the data at a glance.`;
        metadata.chart = chartData;
      }
    }
    
    // 2. Check for analytics questions
    else if (AnalyticsService.isAnalyticsQuestion(message)) {
      messageType = 'analytics';
      response = await AnalyticsService.explainAnalytics(message, userId);
    }
    
    // 3. Check for troubleshooting
    else if (TroubleshootingService.isTroubleshootingQuestion(message)) {
      messageType = 'troubleshooting';
      response = TroubleshootingService.provideTroubleshootingHelp(message);
    }
    
    // 4. Use Gemini for general questions
    else {
      messageType = 'general';
      response = await this.getGeminiResponse(message, userId);
    }

    // Save to database
    await ChatHistoryService.saveMessage(userId, message, response, messageType, metadata);

    return {
      response,
      messageType,
      chart: chartData,
      timestamp: new Date().toISOString()
    };
  }

  static async getGeminiResponse(message, userId) {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCs0rVYHFMKL3lifcistmSUY90jKv059WY';
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Get recent chat context
      const context = await ChatHistoryService.getRecentContext(userId, 3);
      
      let prompt = 'You are Fick AI, a helpful business analytics assistant.\n\n';
      
      if (context.length > 0) {
        prompt += 'Recent conversation:\n';
        context.forEach(c => {
          prompt += `User: ${c.message}\nAssistant: ${c.response}\n`;
        });
        prompt += '\n';
      }
      
      prompt += `User: ${message}\n\nProvide a helpful, concise response in under 150 words.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini error:', error);
      return 'I apologize, but I encountered an issue processing your request. Please try again.';
    }
  }
}
