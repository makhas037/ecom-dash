// src/components/common/Notification.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiX } from 'react-icons/fi';
import './Notification.css';

const notificationVariants = {
  initial: { opacity: 0, y: 50, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: 100, scale: 0.8 },
};

function Notification({ message, type, onClear }) {
  const Icon = type === 'success' ? FiCheckCircle : FiAlertTriangle;

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          variants={notificationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`notification ${type}`}
        >
          <Icon className="notification-icon" />
          <p>{message}</p>
          <button onClick={onClear} className="notification-close">
            <FiX />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Notification;
