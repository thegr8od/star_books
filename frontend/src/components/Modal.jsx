const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="inset-0 z-50 fixed flex justify-center items-center">
      {/* 뒷 배경 살짝 까맣게 */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      {/* 내용 */}
      <div className="inset-0 z-50 bg-white rounded-lg shadow-xl min-w-[320px]">
        {/* 헤더 */}
        <div className="flex justify-center gap-5 p-[10px] relative">
          <h2 className="text-[20px] font-semibold  text-center">{title}</h2>
          <button
            onClick={onClose}
            className="pr-2 text-black hover:text-gray-600 absolute right-2"
          >
            X
          </button>
        </div>
        {/* body */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
