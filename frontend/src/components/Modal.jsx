import Button from "./Button";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="inset-0 z-50 fixed flex justify-center items-center">
      {/* 뒷 배경 살짝 까맣게 */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      {/* 내용 */}
      <div className="inset-0 z-50 bg-white rounded-lg shadow-xl min-w-[320px]">
        {/* 헤더 */}
        <div className="flex mx-4 items-center justify-between  mt-6">
          <h2 className="text-[20px] font-semibold  w-[80%]">{title}</h2>
          <CloseOutlinedIcon onClick={onClose} />
        </div>
        <hr className="mx-4 mt-4" />
        {/* body */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
