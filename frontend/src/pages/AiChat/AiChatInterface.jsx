import { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import ChatMessage from "./ChatMessage";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUserEmail } from "../../store/userSlice";
import useChatbotApi from "../../api/useChatbotApi";

function AiChatInterface({ aiCharacter }) {
  //  전체 채팅 대화 내역 담는 배열
  const [messages, setMessages] = useState([
    { isBot: true, message: "이제 당신이 선택한 AI와 대화를 나눠보세요!" },
  ]);
  const [inputMessage, setInputMessage] = useState(""); // 입력 메시지
  const messageRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const email = useSelector(selectUserEmail);

  console.log(email)

  // 대화 초기화
  const handleChatReset = () => {
    // 초기화 전 확인 요청
    const isConfirmed = window.confirm(
      "대화 내용이 모두 삭제됩니다. 정말 초기화하시겠습니까?"
    );

    if (isConfirmed) {
      setMessages([
        { isBot: true, message: "이제 당신이 선택한 AI와 대화를 나눠보세요!" },
      ]);
      setInputMessage("");
      setIsLoading(false);
    }
  };

  const fetchChatHistory = async (email) => {
    try{
      const response = await useChatbotApi.getHistory({email});
      if (response.status === 200) {
        const messageHistory = response.data.map((msg) => ({
          isBot: msg.role === "assistant",
          message: msg.content,
        }));

        // 히스토리 있으면 환영 메시지 X
        if (messageHistory.length > 0) {
          setMessages(messageHistory);
        }
      }
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (email) {
      fetchChatHistory(email);  // email이 준비된 상태에서 실행
    }
  }, [email]);

  // 메세지 올 때마다 스크롤 실행
  useEffect(() => {
      // 스크롤 최하단으로 내려가도록
    const scrollToBottom = () => {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom(); // <-- 이거
  }, [messages]);

  

  const handleSendMessage = async (e) => {
    e.preventDefault(); // 전송 버튼 눌러도 새로고침 X

    if (inputMessage.trim() === "" || isLoading) return; // 공백 메시지 보내는 거 또는 같은 메시지를 여러 번 전송하는 것 방지

    const userMessage = inputMessage.trim();
    setMessages((prev) => [...prev, { isBot: false, message: inputMessage }]); // 유저가 메시지 보낼 때
    setInputMessage(""); // 초기화
    setIsLoading(true);
    
    try {
      const response = await useChatbotApi.chat(
       {
         email: email,
         message: userMessage,
         persona: aiCharacter.persona
       }
      )
      if(response.status === 200){
        setMessages((prev) => [...prev, {isBot: true, message: response.data,},]);
      }
    } catch(e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          isBot: true,
          message:
            "죄송해요. 일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }
    // 이전 채팅 기록 불러오기
    // const fetchChatHistory = () => {
    //   axios("/api/chat/history", {
    //     params: { email: "user@example.com" },
    //   }).then((response) => {
    //     if (response.data.status === "success") {
    //       const messageHistory = response.data.data.map((msg) => ({
    //         isBot: msg.role === "assistant",
    //         msg: msg.content,
    //       }));

    //       // 히스토리 있으면 환영 메시지 X
    //       if (messageHistory.length > 0) {
    //         setMessages(messageHistory);
    //       }
    //     }
    //   });
    // };

    // 컴포넌트 마운트 시 채팅 기록 불렁괴
    

    // API 호출

    
    // axios
    //   .post("api/chat/message", {
    //     email: "user@example.com",
    //     message: userMessage,
    //     persona: aiCharacter.persona,
    //   })
    //   .then((response) => {
    //     setMessages((prev) => [
    //       ...prev,
    //       {
    //         isBot: true,
    //         message: response.data,
    //       },
    //     ]);
    //   })
    //   .catch((error) => {
    //     console.error("채팅 메시지 에러 : ", error);
    //     setMessages((prev) => [
    //       ...prev,
    //       {
    //         isBot: true,
    //         message:
    //           "죄송해요. 일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
    //       },
    //     ]);
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* 헤더 */}
      <div className="pt-1 pb-3 border-b-[1px] border-white/80 flex justify-between">
        <h1 className="flex-1 text-center text-white font-semibold text-xl">
          AI 채팅
        </h1>
        <ReplayIcon
          sx={{ fontSize: 26 }}
          className="text-white cursor-pointer"
          onClick={handleChatReset}
        />
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
            <SendIcon sx={{ fontSize: 25 }} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default AiChatInterface;