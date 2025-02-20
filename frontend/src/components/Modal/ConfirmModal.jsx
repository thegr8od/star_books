import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px]" onClick={onClose}></div>
      <div className="relative bg-[#fafafa] rounded-2xl px-4 py-6 w-full max-w-[18rem] shadow-xl transform transition-all">
        <h3 className="text-lg font-medium text-[#7580bb] mb-3 text-center">잠시만요</h3>
        <p className="text-gray-600 mb-2 leading-relaxed text-center text-sm">
          이 날의 소중한 감정과 기억들을
          <br />
          정말 지우시겠어요?
        </p>
        <p className="text-gray-400 text-xs mb-6 text-center">삭제된 일기는 다시 되돌릴 수 없어요</p>
        <div className="flex justify-center space-x-2">
          <button onClick={onClose} className="px-3 py-2 text-[#7580bb] hover:bg-[#7580bb]/10 rounded-xl transition-all duration-200 font-medium text-sm">
            남겨둘래요
          </button>
          <button onClick={onConfirm} className="px-3 py-2 bg-[#7580bb] text-white rounded-xl hover:bg-[#7580bb]/90 transition-all duration-200 shadow-sm font-medium text-sm">
            지울래요
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
