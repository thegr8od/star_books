import { useEffect, useState } from "react";

const MoodSurveyToast = ({ message, isVisible, onClose, duration = 800 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      // 컴포넌트가 사라질 때 타이머 정리
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-gray-800 text-white px-4 py-2 rounded-lg text-sm opacity-85 text-center max-w-[80%]">
      {message}
    </div>
  );
};

export default MoodSurveyToast;
