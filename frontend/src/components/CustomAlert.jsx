import { useEffect } from "react";
import Button from "./Button";

const CustomAlert = ({ message, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // 2초 후 자동으로 닫힘

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-white/90 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 text-xs md:text-base">
        <div className="text-center">
          <p className="text-black mb-4">{message}</p>
          <Button
            text={"확인"}
            type={"DEFAULT"}
            onClick={onClose}
            className="px-4 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
