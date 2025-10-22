import React from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';

const Reviews = () => {
  const reviews = [
    { id: 1, customer: 'John Doe', rating: 5, text: 'Amazing analytics platform!', date: 'Jan 15, 2025' },
    { id: 2, customer: 'Jane Smith', rating: 4, text: 'Very helpful insights', date: 'Jan 14, 2025' },
    { id: 3, customer: 'Bob Johnson', rating: 5, text: 'Fick AI is incredible!', date: 'Jan 13, 2025' },
  ];

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Customer Reviews</h1>
        <p className="text-gray-600 dark:text-gray-400">What customers are saying about FiberOps</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {review.customer[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{review.customer}</h3>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{review.text}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                <ThumbsUp size={16} />
                <span>Helpful</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                <MessageSquare size={16} />
                <span>Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
