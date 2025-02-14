import { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import ChatMessage from "./ChatMessage";

function AiChatInterface() {
  //  전체 채팅 대화 내역 담는 배열
  const [messages, setMessages] = useState([
    { isBot: true, message: "이제 당신이 선택한 AI와 대화를 나눠보세요!" },
  ]);
  const [inputMessage, setInputMessage] = useState(""); // 입력 메시지
  const messageRef = useRef(null);

  // 스크롤 최하단으로 내려가도록
  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 메세지 올 때마다 스크롤 실행
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault(); // 전송 버튼 눌러도 새로고침 X

    if (inputMessage.trim() === "") return; // 공백 메시지 보내는 거 방지

    setMessages((prev) => [...prev, { isBot: false, message: inputMessage }]); // 유저가 메시지 보낼 때
    setInputMessage(""); // 초기화

    // 답장 오는 속도
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          isBot: true,
          message: "추후 데이터 받아올 예정",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* 헤더 */}
      <div className="pb-3 border-b-[1px] border-white/80">
        <h1 className="text-center text-white font-semibold text-xl">
          AI 채팅
        </h1>
      </div>

      {/* 채팅 메시지 표시 영역(스크롤) */}
      <div
        className="flex-1 overflow-y-auto mt-4 min-h-0"
        style={{ scrollbarWidth: "none" }}
      >
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} isBot={msg.isBot} message={msg.message} />
        ))}
        {/* 스크롤 위치 잡기 */}
        <div ref={messageRef} />
      </div>

      {/* 메시지 입력 */}
      <form onSubmit={handleSendMessage}>
        <div className="flex items-center gap-2 mt-1">
          <WidgetsOutlinedIcon className="text-white" />
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 rounded-xl px-4 py-2 bg-white/20 text-white focus:outline-none focus:ring-1 focus:ring-[#9da7d9}"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full flex items-center justify text-white"
          >
            <SendIcon sx={8} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default AiChatInterface;
