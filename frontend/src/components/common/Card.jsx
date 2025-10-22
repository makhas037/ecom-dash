// src/components/common/Card.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './Card.css'; // You'll create this CSS file

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function Card({ children, className }) {
  return (
    <motion.div
      className={`card ${className || ''}`}
      variants={cardVariants}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)" }} // Microinteraction!
    >
      {children}
    </motion.div>
  );
}

export default Card;
