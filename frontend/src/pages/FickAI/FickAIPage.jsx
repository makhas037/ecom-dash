import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2, Search, Sparkles, TrendingUp, BarChart3, Database, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../api/axios.config';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const FickAIPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    { icon: TrendingUp, text: 'Show me sales trends chart', color: 'text-purple-600', type: 'chart' },
    { icon: BarChart3, text: 'Explain my dashboard analytics', color: 'text-blue-600', type: 'analytics' },
    { icon: Database, text: 'How do I upload datasets?', color: 'text-green-600', type: 'help' },
    { icon: AlertCircle, text: 'Help me fix an error', color: 'text-orange-600', type: 'troubleshooting' },
  ];

  useEffect(() => {
    if (user?.id) {
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatHistory = async () => {
    if (!user?.id) return;

    try {
      const response = await axiosInstance.get(`/chat/history/${user.id}`);
      setChatHistory(response.data.history || []);
      
      if (response.data.history && response.data.history.length > 0) {
        const lastMessages = response.data.history.slice(0, 5).reverse().map(h => ([
          { role: 'user', content: h.message, timestamp: new Date(h.created_at), type: h.message_type },
          { role: 'assistant', content: h.response, timestamp: new Date(h.created_at), chart: h.metadata?.chart }
        ])).flat();
        setMessages(lastMessages);
      } else {
        setMessages([{
          role: 'assistant',
          content: "Hi! I'm Fick AI, your intelligent business analytics assistant. I can help with analytics, generate charts, and troubleshoot issues. What would you like to know?",
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Load history error:', error);
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm Fick AI, your intelligent business analytics assistant. I can help with analytics, generate charts, and troubleshoot issues. What would you like to know?",
        timestamp: new Date()
      }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!user?.id) {
      toast.error('Please log in to use Fick AI');
      return;
    }

    const userMessage = input.trim();
    setInput('');

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/gemini/chat', {
        message: userMessage,
        userId: user.id
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response,
        chart: response.data.chart,
        messageType: response.data.messageType,
        timestamp: new Date()
      }]);

      await loadChatHistory();
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!user?.id || !window.confirm('Are you sure you want to clear all chat history?')) return;
    
    try {
      await axiosInstance.delete(`/chat/history/${user.id}`);
      setMessages([{
        role: 'assistant',
        content: 'Chat history cleared. How can I help you today?',
        timestamp: new Date()
      }]);
      setChatHistory([]);
      toast.success('Chat history cleared');
    } catch (error) {
      console.error('Clear history error:', error);
      toast.error('Failed to clear history');
    }
  };

  const handleSearch = async () => {
    if (!user?.id) return;

    if (!searchTerm.trim()) {
      await loadChatHistory();
      return;
    }

    try {
      const response = await axiosInstance.post('/chat/history/search', {
        userId: user.id,
        searchTerm
      });
      setChatHistory(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    }
  };

  const renderChart = (chartConfig) => {
    if (!chartConfig || !chartConfig.data || chartConfig.data.length === 0) return null;

    const { type, data, title, xKey, yKeys, colors, nameKey, valueKey } = chartConfig;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mt-3 shadow-sm">
        <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">{title}</h4>
        <ResponsiveContainer width="100%" height={300}>
          {type === 'line' && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {yKeys.map((key, idx) => (
                <Line key={key} type="monotone" dataKey={key} stroke={colors[idx]} strokeWidth={2} dot={{ r: 4 }} />
              ))}
            </LineChart>
          )}
          
          {type === 'bar' && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {yKeys.map((key, idx) => (
                <Bar key={key} dataKey={key} fill={colors[idx]} radius={[8, 8, 0, 0]} />
              ))}
            </BarChart>
          )}
          
          {type === 'pie' && (
            <PieChart>
              <Pie data={data} dataKey={valueKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={100} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  const filteredHistory = filterType === 'all' 
    ? chatHistory 
    : chatHistory.filter(h => h.message_type === filterType);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Bot className="mx-auto mb-4 text-purple-600" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Please Log In
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need to be logged in to use Fick AI
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Sparkles className="mr-2 text-purple-600" size={20} />
              Chat History
            </h2>
            <button
              onClick={handleClearHistory}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Clear history"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleSearch}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Search size={18} />
            </button>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Messages</option>
            <option value="general">General</option>
            <option value="chart">Charts</option>
            <option value="analytics">Analytics</option>
            <option value="troubleshooting">Troubleshooting</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              No chat history yet
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 mb-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => {
                  setMessages([
                    { role: 'user', content: item.message, timestamp: new Date(item.created_at) },
                    { role: 'assistant', content: item.response, timestamp: new Date(item.created_at), chart: item.metadata?.chart }
                  ]);
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.message_type === 'chart' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    item.message_type === 'analytics' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    item.message_type === 'troubleshooting' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {item.message_type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{item.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{item.response.substring(0, 50)}...</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 shadow-lg">
          <h1 className="text-2xl font-bold flex items-center">
            <Bot className="mr-3" size={32} />
            Fick AI - Full Analytics Assistant
          </h1>
          <p className="text-sm text-white/80 mt-1">
            Ask questions, generate charts, get insights, and troubleshoot issues • Logged in as {user.name}
          </p>
        </div>

        {messages.length <= 1 && (
          <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Try asking:</h3>
            <div className="grid grid-cols-2 gap-3">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(q.text)}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-left"
                >
                  <q.icon className={`${q.color} mr-3 flex-shrink-0`} size={24} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                    : 'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30'
                }`}>
                  {message.role === 'user' ? (
                    <User className="text-white" size={20} />
                  ) : (
                    <Bot className="text-purple-600 dark:text-purple-400" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`rounded-2xl px-5 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                      {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.chart && renderChart(message.chart)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 border border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Fick AI is analyzing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-end space-x-3 max-w-4xl mx-auto">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Fick AI anything about your business, request charts, or get help..."
              rows={3}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={24} />
            </button>
          </div>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default FickAIPage;
