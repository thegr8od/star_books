import Button from "./Button";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="inset-0 z-50 fixed flex justify-center items-center">
      {/* 뒷 배경 살짝 까맣게 */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      {/* 내용 */}
      <div className="inset-0 z-50 bg-white rounded-lg shadow-xl min-w-[320px]">
        {/* 헤더 */}
        <div className="relative flex items-center justify-center p-[10px]  mt-6">
          <h2 className="text-[20px] font-semibold  text-center">{title}</h2>
          <Button
            onClick={onClose}
            type="DEFAULT"
            imgSrc="/public/icons/close2.png"
            imgClassName="w-3 h-3"
            className="absolute right-5 top-1"
          />
        </div>
        {/* body */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
