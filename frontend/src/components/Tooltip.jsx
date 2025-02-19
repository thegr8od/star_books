import { useState, useEffect } from 'react';

const Tooltip = ({ text, show }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className="absolute left-full ml-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm whitespace-nowrap">
      {text}
    </div>
  );
};

export default Tooltip; 