import { useState } from "react";
import Modal from "../../components/Modal";

function AiSelection() {
  const [selectedAi, setSelectedAo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  // ai 캐릭터 종류 및 관련 설명
  const aiCharacters = [
    {
      id: 1,
      name: "공감형 AI",
      description: "당신의 감정을 깊이 이해하고 공감하는 AI입니다.",
      image: "/images/ai_1.png",
    },
    {
      id: 2,
      name: "분석형 AI",
      description: "객관적인 시각으로 조언을 제공하는 AI입니다.",
      image: "/images/ai_2.png",
    },
    {
      id: 3,
      name: "격려형 AI",
      description: "긍정적인 에너지로 당신을 응원하는 AI입니다.",
      image: "/images/ai_3.png",
    },
  ];

  // ai 캐릭터 선택
  const handleAiSelect = (ai) => {
    setSelectedAi(ai);
    setIsModalOpen(false);
  };
  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="대화할 AI를 선택해주세요."
      >
        <div className="grid grid-cols-1 gap-3">
          {aiCharacters.map((ai) => (
            <button
              key={ai.id}
              onClick={() => handleAISelect(ai)}
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img
                  src={ai.image}
                  alt={ai.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">{ai.name}</h3>
                <p className="text-gray-600 text-sm">{ai.description}</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default AiSelection;
