import { useState, useEffect } from 'react';

const Alert = ({ message, show, duration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg text-white 
                    text-lg shadow-lg z-50">
      {message}
    </div>
  );
};

export default Alert; 