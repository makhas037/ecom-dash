// src/pages/HomePage/HomePage.jsx
import React from 'react';
import { useAuth } from '../../context/AppContext';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import './HomePage.css';

function HomePage() {
  const { user } = useAuth();

  return (
    <motion.div 
      className="homepage-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="homepage-header">
        <h1>Welcome back, {user?.name || 'User'}!</h1>
        <p>Here's a quick overview of your sales performance.</p>
      </div>
      
      <div className="kpi-grid">
         {/* You can now place your KPIBox and Chart components here */}
         <Card>Your KPIBox components will go here.</Card>
         <Card>Your LineChart component will go here.</Card>
         <Card>Your BarChart component will go here.</Card>
      </div>
    </motion.div>
  );
}

export default HomePage;
