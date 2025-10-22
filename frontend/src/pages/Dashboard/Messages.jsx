import React, { useState } from 'react';
import { MessageCircle, Send, Search } from 'lucide-react';

const Messages = () => {
  const [messages] = useState([
    { id: 1, from: 'Customer Support', text: 'Welcome to FiberOps!', time: '10:30 AM', unread: false },
    { id: 2, from: 'Sales Team', text: 'Your monthly report is ready', time: '11:15 AM', unread: true },
    { id: 3, from: 'Fick AI', text: 'I detected an unusual spike in sales!', time: '2:45 PM', unread: true },
  ]);

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search messages..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                msg.unread
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {msg.from[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{msg.from}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{msg.text}</p>
                </div>
                {msg.unread && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
