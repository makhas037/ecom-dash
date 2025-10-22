// src/components/common/KPIBox.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card'; // Assuming Card.jsx is in the same folder
import './KPIBox.css';

// Animation variants for the content inside the card
const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

function KPIBox({ title, value, trend }) {
  const isPositive = trend && trend.startsWith('+');

  return (
    // We use the Card component as the base for consistent styling and hover effects
    <Card className="kpi-box">
      <motion.div variants={contentVariants}>
        <h3 className="kpi-title">{title}</h3>
        <p className="kpi-value">{value}</p>
        {trend && (
          <p className={`kpi-trend ${isPositive ? 'positive' : 'negative'}`}>
            {trend}
          </p>
        )}
      </motion.div>
    </Card>
  );
}

export default KPIBox;
