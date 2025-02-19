import Layout from "../../components/Layout";
import AiChatInterface from "./AiChatInterface";
import { useState } from "react";
import Modal from "../../components/Modal";
import aiImage from "/images/ai_chat_test.png";
import { useNavigate } from "react-router-dom";

function AiChat() {
  const [selectedAi, setSelectedAi] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  // ai 캐릭터 종류 및 관련 설명
  const aiCharacters = [
    {
      id: 1,
      name: "공감이",
      description: "당신의 감정을 깊이 이해하고 공감하는 AI입니다.",
      image: "/images/ai_1.png",
    },
    {
      id: 2,
      name: "냉철이",
      description: "객관적인 시각으로 조언을 제공하는 AI입니다.",
      image: "/images/ai_2.png",
    },
    {
      id: 3,
      name: "긍정이",
      description: "긍정적인 에너지로 당신을 응원하는 AI입니다.",
      image: "/images/ai_3.png",
    },
  ];

  // ai 캐릭터 선택
  const handleAiSelect = (ai) => {
    setSelectedAi(ai);
    setIsModalOpen(false);
  };

  const closeChatPage = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  return (
    <Layout>
      <div className="">
        <Modal
          isOpen={isModalOpen}
          onClose={() => closeChatPage()}
          title="대화할 AI를 선택해주세요."
        >
          <div className="grid grid-cols-1 gap-3">
            {aiCharacters.map((ai) => (
              <button
                key={ai.id}
                onClick={() => handleAiSelect(ai)}
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img
                    src={aiImage}
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
        {/* ai 선택 후 채팅페이지로 이동 */}
        {selectedAi && <AiChatInterface aiCharacter={selectedAi} />}
      </div>
    </Layout>
  );
}

export default AiChat;
