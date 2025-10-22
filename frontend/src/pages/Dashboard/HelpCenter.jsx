import React, { useState } from 'react';
import { Search, Book, MessageCircle, FileText, HelpCircle, Mail, Phone, ExternalLink } from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'getting-started', name: 'Getting Started', icon: HelpCircle },
    { id: 'features', name: 'Features', icon: FileText },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: MessageCircle },
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I get started with FiberOps?',
      answer: 'Simply navigate to the Dashboard to view your analytics. Fick AI is available 24/7 to answer questions via the chat button in the bottom right corner.'
    },
    {
      category: 'getting-started',
      question: 'What data sources can I connect?',
      answer: 'FiberOps supports CSV file uploads, PostgreSQL, MySQL, and REST API integrations. Go to Settings > Integration to connect your data sources.'
    },
    {
      category: 'features',
      question: 'How accurate are the sales forecasts?',
      answer: 'Our ARIMA forecasting model achieves 87% accuracy for 28-day predictions, using historical sales data, trends, and seasonality patterns.'
    },
    {
      category: 'features',
      question: 'What is customer segmentation?',
      answer: 'We use K-means clustering to group customers into 4 segments: Champions (high value), Loyal (regular buyers), At-Risk (declining engagement), and Lost (inactive 90+ days).'
    },
    {
      category: 'features',
      question: 'How does churn prediction work?',
      answer: 'Our Logistic Regression model uses RFM analysis (Recency, Frequency, Monetary) to predict churn with 82% precision. Customers inactive for 60+ days are flagged as at-risk.'
    },
    {
      category: 'troubleshooting',
      question: 'Dashboard is not loading',
      answer: 'Check that both backend (port 5000) and frontend (port 3000) are running. Clear browser cache (Ctrl+Shift+Delete) and refresh. If issue persists, contact support.'
    },
    {
      category: 'troubleshooting',
      question: 'Data not showing up',
      answer: 'Ensure your data has been imported via scripts/import-kaggle-data.py. Check backend logs for errors. Verify API endpoint is responding at http://localhost:5000/health'
    },
    {
      category: 'troubleshooting',
      question: 'How do I export reports?',
      answer: 'Click the Export button on any dashboard page. Data can be exported as CSV, PDF, or Excel. Ensure pop-ups are enabled in your browser settings.'
    },
    {
      category: 'features',
      question: 'Can I customize the dashboard?',
      answer: 'Yes! Go to Settings > Appearance to customize theme (dark/light), font size, and layout. More customization options coming soon.'
    },
    {
      category: 'troubleshooting',
      question: 'Fick AI not responding',
      answer: 'Ensure backend is running and GEMINI_API_KEY is set in .env file. Check browser console (F12) for errors. The AI needs internet connection for real-time data.'
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-xl text-white/90 mb-6">
          Find answers, guides, and get support
        </p>
        
        {/* Search */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="mailto:support@fiberops.com"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border border-gray-100 dark:border-gray-700"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
            <Mail className="text-white" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Email Support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">support@fiberops.com</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">Response within 2 hours</p>
        </a>

        <a
          href="tel:+1-800-FIBEROPS"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border border-gray-100 dark:border-gray-700"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
            <Phone className="text-white" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Phone Support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">+1-800-FIBEROPS</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">Available 24/7</p>
        </a>

        <button
          onClick={() => window.open('https://docs.fiberops.com', '_blank')}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border border-gray-100 dark:border-gray-700 text-left"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
            <Book className="text-white" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            Documentation <ExternalLink size={14} className="ml-2" />
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Detailed guides</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">API references & tutorials</p>
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-500'
            }`}
          >
            <category.icon size={16} />
            <span className="font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-400">No articles found. Try a different search term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                  <span>{faq.question}</span>
                  <svg
                    className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        )}
      </div>

      {/* Still Need Help */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
        <p className="text-white/90 mb-6">
          Chat with Fick AI or contact our support team
        </p>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openChat'))}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Chat with Fick AI
          </button>
          <a
            href="mailto:support@fiberops.com"
            className="px-6 py-3 bg-white/20 backdrop-blur border border-white/30 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
