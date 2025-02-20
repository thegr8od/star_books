function ChatMessage({ isBot, message, aiCharacter }) {
  return (
    <div
      className={`flex w-full ${isBot ? "justify-start" : "justify-end"} mb-4`}
    >
      {/* AI */}
      {isBot && (
        <div className="w-12 h-12 rounded-full bg-white items-center justify-center mr-2">
          <img
            src={aiCharacter?.image}
            alt={`${aiCharacter?.name || "AI"} 프로필`}
          />
        </div>
      )}

      {/* 말풍선 */}
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 text-white ${
          isBot ? "bg-[#9da7d9]/50" : "bg-white/50"
        }`}
      >
        <p className="text-md break-words">{message}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
