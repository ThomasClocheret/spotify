import React, { useEffect, useState } from 'react';
import './alert.css';

interface AlertProps {
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show the alert
    setVisible(true);

    // Hide the alert after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      // Remove the alert after the fade-out transition
      setTimeout(onClose, 500);
    }, 5000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
};

export default Alert;