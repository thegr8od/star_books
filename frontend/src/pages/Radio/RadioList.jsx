import Layout from "../../components/Layout";
import Button from "../../components/Button";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import { useRef, useState } from "react";

function RadioList() {
  const categories = ["전체", "일상", "연애", "음악", "취미", "건강", "기타"];
  const scrollContainerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortType, setSortType] = useState("latest");
  const categoryColors = {
    일상: { bg: "from-amber-100 to-amber-300", border: "border-amber-500" },
    연애: { bg: "from-rose-100 to-rose-300", border: "border-rose-500" },
    음악: { bg: "from-purple-100 to-purple-300", border: "border-purple-500" },
    취미: {
      bg: "from-emerald-100 to-emerald-300",
      border: "border-emerald-500",
    },
    건강: { bg: "from-sky-100 to-sky-300", border: "border-sky-500" },
    기타: { bg: "from-gray-50 to-gray-300", border: "border-gray-500" },
  };
  // 닉네임 길이 제한 두기(7자)
  const tracks = [
    {
      id: 1,
      title: "라디오? 레이디오!",
      likes: 12,
      comments: 5,
      nickname: "닉네임1",
      category: "음악",
      createdAt: "2024-02-11",
    },
    {
      id: 2,
      title: "라디오? 레이디오!",
      likes: 15,
      nickname: "닉네임2",
      category: "일상",
      createdAt: "2024-02-10",
    },
    {
      id: 3,
      title: "라디오? 레이디오!",
      likes: 8,
      nickname: "푸릇푸릇한햄버거",
      category: "취미",
      createdAt: "2025-01-11",
    },
    {
      id: 4,
      title: "라디오? 레이디오!",
      likes: 20,
      nickname: "닉네임4",
      category: "건강",
      createdAt: "2025-02-11",
    },
    {
      id: 5,
      title: "라디오? 레이디오!",
      likes: 10,
      nickname: "닉네임5",
      category: "연애",
      createdAt: "2025-01-01",
    },
    {
      id: 6,
      title: "라디오? 레이디오!",
      likes: 16,
      nickname: "닉네임6",
      category: "기타",
      createdAt: "2024-12-25",
    },
  ];

  // 트랙 정렬
  const getSortedTracks = (tracks) => {
    // 최신순
    if (sortType === "latest") {
      // 양수 : b가 더 최신, 음수 : a가 더 최신
      return [...tracks].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      // 인기순 -> 실시간 시청자 수에 따라(데이터 어떻게 받는건지 아직 잘 모름)
    }
  };

  // 선택된 카테고리에 따라 트랙 필터링
  const filteredTracks = getSortedTracks(
    selectedCategory === "전체"
      ? tracks
      : tracks.filter((track) => track.category === selectedCategory)
  );

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      const scrollPosition =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <Layout>
      <div className=" text-white">
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-6 text-center">별들의 속삭임</h1>
          <Button
            text="🔴 Live 시작"
            type="DEFAULT"
            className="w-full rounded-full py-2 mb-8 text-center"
          />
          {/* 인기순, 최신순 정렬 버튼 */}
          <div className="flex mb-6 space-x-2">
            <button
              onClick={() => setSortType("popular")}
              className={`w-1/2 py-1 rounded-full text-[20px] transition-colors
               ${
                 sortType === "popular"
                   ? "bg-white text-black"
                   : "border border-white hover:bg-gray-600"
               }   
                `}
            >
              인기순
            </button>
            <button
              onClick={() => setSortType("latest")}
              className={`w-1/2 py-1 rounded-full text-[20px] transition-colors
               ${
                 sortType === "latest"
                   ? "bg-white text-black"
                   : "border border-white hover:bg-gray-600"
               }   
                `}
            >
              최신순
            </button>
          </div>

          {/* 카테고리 */}
          <div className="relative mb-6">
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white rounded-full shadow-xl hover:bg-gray-100"
            >
              <ArrowBackIosNewOutlinedIcon className="w-4 h-4 text-black" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-2 md:gap-4 overflow-x-auto px-4 md:px-8 scrollbar-hide scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 md:px-4 py-2 md:py-2 rounded-full whitespace-nowrap flex-shrink-0 transition-colors w-[calc(100%/3-0.5rem)] md:w-[calc(100%/4-1rem)]
                  ${
                    selectedCategory === category
                      ? "bg-gray-200 text-black"
                      : "border border-white hover:bg-gray-600"
                  }`}
                >
                  # {category}
                </button>
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white rounded-full shadow-xl hover:bg-gray-100"
            >
              <ArrowForwardIosOutlinedIcon className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* 트랙 */}
        <div className="mx-[-8px] sm:mx-[-24px]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {filteredTracks.map((track) => (
              <div key={track.id} className="p-4 sm:p-2">
                <div className="flex flex-col items-center">
                  <div
                    className={`relative w-full aspect-square rounded-full 
                    bg-gradient-to-tl ${categoryColors[track.category].bg}
                    border-2 ${categoryColors[track.category].border}
                    flex items-center justify-center mb-2 transition-colors opacity-90 hover:opacity-100`}
                  >
                    <PlayArrowOutlinedIcon className="w-8 h-8" />
                  </div>
                  <p className="text-sm text-center mb-1">{track.title}</p>
                  <div className="flex flex-col items-center text-xs text-gray-300 space-y-1">
                    <span className="flex items-start">
                      <WidgetsOutlinedIcon
                        sx={{ fontSize: 15 }}
                        className="mr-1"
                      />
                      {track.category}
                    </span>
                    <span className="flex items-start group relative">
                      <KeyboardVoiceOutlinedIcon
                        sx={{ fontSize: 15 }}
                        className="mr-1"
                      />
                      {track.nickname.length > 7
                        ? `${track.nickname.slice(0, 7)}...`
                        : track.nickname}
                      {track.nickname.length > 7 && (
                        <span className="invisible group-hover:visible absolute left-0 top-5 bg-gray-700 text-white px-2 py-1 opacity-80 rounded text-xs whitespace-nowrap">
                          {track.nickname}
                        </span>
                      )}
                    </span>
                    <span className="flex items-start">
                      <PersonOutlinedIcon
                        sx={{ fontSize: 15 }}
                        className="mr-1"
                      />
                      {track.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default RadioList;
