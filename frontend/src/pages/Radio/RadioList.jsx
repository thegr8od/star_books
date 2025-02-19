import React, { useEffect, useState, useRef } from "react";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import { selectUserNickname } from "../../store/userSlice";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";


// 🔴 categoryColors 추가
const categoryColors = {
  일상: { bg: "from-amber-100 to-amber-300", border: "border-amber-500" },
  연애: { bg: "from-rose-100 to-rose-300", border: "border-rose-500" },
  음악: { bg: "from-purple-100 to-purple-300", border: "border-purple-500" },
  취미: { bg: "from-emerald-100 to-emerald-300", border: "border-emerald-500" },
  건강: { bg: "from-sky-100 to-sky-300", border: "border-sky-500" },
  기타: { bg: "from-gray-50 to-gray-300", border: "border-gray-500" },
};

function RadioList({ onJoinRoom }) {
  const nickname = useSelector(selectUserNickname);
  const [title, setTitle] = useState("");
  const [sortType, setSortType] = useState("popular"); 
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const scrollContainerRef = useRef(null); 

  const [tracks, setTracks] = useState([{}])
  //   { id: 1, title: "음악 방송", category: "음악", nickname: "DJ A", participantCount: 15 },
  //   { id: 2, title: "연애 상담", category: "연애", nickname: "사랑방", participantCount: 8 },
  //   { id: 3, title: "게임 스트리밍", category: "취미", nickname: "게이머123", participantCount: 20 },
  // ; // 임시 데이터

  const APPLICATION_SERVER_URL = "https://starbooks.site/api/radio/";
  const LIVEKIT_URL = "wss://starbooks.site:7443";

  async function getBroadcasts() {
    try {
        const response = await fetch(APPLICATION_SERVER_URL + "list", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: "cors"
        });
        if (!response.ok) throw new Error("Failed to fetch broadcasts");
          const data = await response.json();
          setTracks(data.sort((a, b) => b.participantCount - a.participantCount));
      } catch (error) {
          console.error("Error fetching broadcasts:", error);
      }
  }

  useEffect(() => {
    getBroadcasts();
    const interval = setInterval(getBroadcasts, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredTracks = tracks
    .filter((track) => selectedCategory === "전체" || track.category === selectedCategory)
    .sort((a, b) => sortType === "popular" ? b.participantCount - a.participantCount : new Date(b.createdAt) - new Date(a.createdAt));

  const handleLiveStart = () => {
    if (!title.trim()) {
      alert("방송 제목을 입력해주세요.");
      return;
    }
    onJoinRoom(title, "host");
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const buttonWidth = 128 + 16;  // 🔴 버튼 2개(128px * 2) + 여백(16px)
      const scrollAmount = buttonWidth * 2;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="text-white h-full overflow-y-auto scrollbar-hide">
      <h1 className="text-xl font-bold mb-6 text-center">별들의 속삭임</h1>
      <div className="mb-4">
        <input type="text" value={nickname} readOnly className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-2" placeholder="닉네임" />
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-700 text-white" placeholder="방송 제목을 입력하세요" />
      </div>
      <Button text="🔴 Live 시작" type="DEFAULT" className="w-full rounded-full py-2 mb-8 text-center" onClick={handleLiveStart} />
      <div className="flex mb-6 space-x-2">
        <button onClick={() => setSortType("popular")} className={`w-1/2 py-1 rounded-full text-[20px] ${sortType === "popular" ? "bg-white text-black" : "border border-white hover:bg-gray-600"}`}>인기순</button>
        <button onClick={() => setSortType("latest")} className={`w-1/2 py-1 rounded-full text-[20px] ${sortType === "latest" ? "bg-white text-black" : "border border-white hover:bg-gray-600"}`}>최신순</button>
      </div>
      <div className="relative mb-6 px-10">
        <button 
          onClick={() => scroll("left")} 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1 bg-white rounded-full shadow-xl hover:bg-gray-100"
        >
          <ArrowBackIosNewOutlinedIcon className="w-4 h-4 text-black" />
        </button>

        <div 
          ref={scrollContainerRef} 
          className="flex gap-2 px-4 overflow-x-hidden whitespace-nowrap"
          style={{ width: '100%' }}
        >
          {["전체", "일상", "연애", "음악", "취미", "건강", "기타"].map((category) => (
            <button 
            key={category} 
            onClick={() => setSelectedCategory(category)} 
            className={`px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 transition-colors 
              ${
                selectedCategory === category
                  ? "bg-gray-200 text-black"
                  : "border border-white hover:bg-gray-600"
              }`}
            style={{ minWidth: 'fit-content' }}
          >
              # {category}
            </button>
          ))}
        </div>

        <button 
          onClick={() => scroll("right")} 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1 bg-white rounded-full shadow-xl hover:bg-gray-100"
        >
          <ArrowForwardIosOutlinedIcon className="w-4 h-4 text-black" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {filteredTracks.map((track) => (
          <div key={track.id} className="p-4 sm:p-2" onClick={() => onJoinRoom(track.roomName)}>
            <div className="flex flex-col items-center">
              <div className={`relative w-full aspect-square rounded-full bg-gradient-to-tl ${categoryColors[track.category]?.bg} border-2 ${categoryColors[track.category]?.border} flex items-center justify-center mb-2`}>
                <PlayArrowOutlinedIcon className="w-8 h-8" />
              </div>
              <p className="text-sm text-center mb-1">{track.title}</p>
              <div className="flex flex-col items-center text-xs text-gray-300">
                <span className="flex items-center"><WidgetsOutlinedIcon sx={{ fontSize: 15 }} className="mr-1" />{track.category}</span>
                <span className="flex items-center"><KeyboardVoiceOutlinedIcon sx={{ fontSize: 15 }} className="mr-1" />{track.nickname}</span>
                <span className="flex items-center"><PersonOutlinedIcon sx={{ fontSize: 15 }} className="mr-1" />{track.participantCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RadioList;
