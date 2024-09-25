// src/components/alert/Alert.tsx
import './alert.css';

import React, { useEffect, useState } from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show the alert
    setVisible(true);

    // Hide the alert after 2 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      // Remove the alert after the fade-out transition
      setTimeout(onClose, 200);
    }, 2000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert ${visible ? 'show' : ''} ${type}`}>
      {message}
    </div>
  );
};

export default Alert;