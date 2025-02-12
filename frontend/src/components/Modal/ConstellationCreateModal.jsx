import { X } from "lucide-react";
import ConstellationCreateAi from "../../pages/Constellation/ConstellationCreateAi";

function ConstellationCreateModal({ isOpen, onClose, constellationData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-[#000033] p-6 rounded-3xl w-full max-w-md mx-4">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white"
        >
          <X size={24} />
        </button>

        {/* 제목 */}
        <div className="text-center mb-6">
          <h2 className="text-white text-lg font-medium">이달의 별자리 만들기</h2>
          <p className="text-white/60 text-sm mt-1">
            소중한 순간을 별자리로 만들어보세요
          </p>
        </div>

        {/* 별자리 생성 컴포넌트 */}
        <ConstellationCreateAi constellationData={constellationData} />
      </div>
    </div>
  );
}

export default ConstellationCreateModal; 