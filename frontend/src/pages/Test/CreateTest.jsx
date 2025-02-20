import { useState } from "react";
import Button from "../../components/Button";
import ConstellationCreateModal from "../../components/Modal/ConstellationCreateModal";

function CreateTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 테스트용 더미 데이터
  const dummyConstellationData = {
    color: ["#FFD700", "#FF69B4", "#4169E1", "#32CD32", "#FF4500"],
    count: 5
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          text="별자리 만들기 테스트"
          className="px-4 py-2"
          type="DEFAULT"
        />

        {/* 별자리 생성 모달 */}
        <ConstellationCreateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          constellationData={dummyConstellationData}
        />
      </div>
    </div>
  );
}

export default CreateTest; 