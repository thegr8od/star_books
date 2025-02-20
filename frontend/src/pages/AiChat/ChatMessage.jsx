import React from "react";

const ChatMessage = ({ isBot, message, aiCharacter }) => {
  return (
    <div
      className={`flex items-start gap-3 mb-4 ${!isBot && "flex-row-reverse"}`}
    >
      {/* 프로필 이미지를 동그라미로 만들고 중앙 정렬 */}
      <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center overflow-hidden flex-shrink-0">
        {isBot ? (
          <img
            src={aiCharacter?.image}
            alt="AI Character"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            U
          </div>
        )}
      </div>

      {/* 메시지 내용 */}
      <div
        className={`px-4 py-2 rounded-xl max-w-[70%] ${
          isBot ? "bg-white/20 text-white" : "bg-blue-500 text-white"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;
