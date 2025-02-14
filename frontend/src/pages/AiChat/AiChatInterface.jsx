import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import AddBoxIcon from "@mui/icons-material/AddBox";

function AiChatInterface() {
  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <div className="p-3 border-b-[1px] border-white/80">
        <h1 className="text-center text-white font-semibold text-xl">
          AI 채팅
        </h1>
      </div>

      {/* 채팅 메시지 표시 영역(스크롤) */}
      <div className="flex-1 overflow-y-auto"></div>

      {/* 메시지 입력 */}
      <div className="flex justify-start gap-2 py-4">
        <AddBoxIcon className="text-white" />
        <input type="text" value="" className="w-full" />
        <button
          type="submit"
          className="w-10 h-10 rounded-full flex items-center justify text-white"
        >
          <SendIcon sx={8} />
        </button>
      </div>
    </div>
  );
}

export default AiChatInterface;
