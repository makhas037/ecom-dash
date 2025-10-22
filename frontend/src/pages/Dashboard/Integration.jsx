import React, { useState } from 'react';
import { Database, Cloud, CheckCircle, AlertCircle, Settings, Plug } from 'lucide-react';

const Integration = () => {
  const [connections, setConnections] = useState({
    postgresql: { connected: true, lastSync: '2 hours ago' },
    mysql: { connected: false, lastSync: 'Never' },
    mongodb: { connected: false, lastSync: 'Never' },
    api: { connected: true, lastSync: '5 minutes ago' },
  });

  const integrations = [
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      icon: Database,
      description: 'Connect to PostgreSQL database',
      color: 'blue',
      status: connections.postgresql.connected
    },
    {
      id: 'mysql',
      name: 'MySQL',
      icon: Database,
      description: 'Connect to MySQL database',
      color: 'orange',
      status: connections.mysql.connected
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      icon: Database,
      description: 'Connect to MongoDB database',
      color: 'green',
      status: connections.mongodb.connected
    },
    {
      id: 'api',
      name: 'REST API',
      icon: Cloud,
      description: 'Connect via REST API',
      color: 'purple',
      status: connections.api.connected
    },
  ];

  const toggleConnection = (id) => {
    setConnections({
      ...connections,
      [id]: {
        connected: !connections[id].connected,
        lastSync: !connections[id].connected ? 'Just now' : 'Never'
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Integrations</h1>
        <p className="text-gray-600 dark:text-gray-400">Connect your data sources and third-party services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-${integration.color}-100 dark:bg-${integration.color}-900/30 rounded-lg flex items-center justify-center`}>
                  <integration.icon className={`text-${integration.color}-600`} size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{integration.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{integration.description}</p>
                </div>
              </div>
              {integration.status ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <AlertCircle className="text-gray-400" size={24} />
              )}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Last sync: {connections[integration.id].lastSync}
              </span>
              <button
                onClick={() => toggleConnection(integration.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  integration.status
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg text-white'
                }`}
              >
                {integration.status ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integration;
