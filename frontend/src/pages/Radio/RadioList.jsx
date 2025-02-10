import Layout from "../../components/Layout";
import Button from "../../components/Button";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined";
import { useRef, useState } from "react";

function RadioList() {
  const categories = ["전체", "일상", "음악", "취미", "건강", "연애", "기타"];
  const scrollContainerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
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
  const tracks = [
    {
      id: 1,
      title: "라디오? 레이디오!",
      likes: 12,
      comments: 5,
      nickname: "닉네임1",
      category: "음악",
    },
    {
      id: 2,
      title: "라디오? 레이디오!",
      likes: 15,
      comments: 3,
      nickname: "닉네임2",
      category: "일상",
    },
    {
      id: 3,
      title: "라디오? 레이디오!",
      likes: 8,
      comments: 4,
      nickname: "닉네임3",
      category: "취미",
    },
    {
      id: 4,
      title: "라디오? 레이디오!",
      likes: 20,
      comments: 7,
      nickname: "닉네임4",
      category: "건강",
    },
    {
      id: 5,
      title: "라디오? 레이디오!",
      likes: 10,
      comments: 2,
      nickname: "닉네임5",
      category: "연애",
    },
    {
      id: 6,
      title: "라디오? 레이디오!",
      likes: 16,
      comments: 6,
      nickname: "닉네임6",
      category: "기타",
    },
  ];

  // 선택된 카테고리에 따라 트랙 필터링
  const filteredTracks =
    selectedCategory === "전체"
      ? tracks
      : tracks.filter((track) => track.category === selectedCategory);

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
      <div className=" text-white p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-4 text-center">별들의 속삭임</h1>
          <Button
            text="🔴 Live 시작"
            type="DEFAULT"
            className="w-full rounded-full py-2 mb-4 text-center"
          />
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
              className="flex gap-4 overflow-x-auto px-12 scrollbar-hide scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {Object.keys(categoryColors).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1 rounded-full whitespace-nowrap flex-shrink-0 transition-colors
                  ${
                    selectedCategory === category
                      ? "bg-gray-200 text-black"
                      : "border border-white hover:bg-gray-800"
                  }`}
                >
                  {category}
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
        <div className="grid grid-cols-2 gap-3">
          {tracks.map((track) => (
            <div key={track.id} className="flex flex-col items-center">
              <div
                className={`relative w-full aspect-square rounded-full 
              bg-gradient-to-tl ${categoryColors[track.category].bg}
              border-2 ${categoryColors[track.category].border}
              flex items-center justify-center mb-2 transition-colors opacity-90`}
              >
                <PlayArrowOutlinedIcon className="w-8 h-8" />
              </div>
              <p className="text-sm text-center">{track.title}</p>
              <div className="flex space-x-2 text-xs text-gray-300">
                <span>
                  <FavoriteOutlinedIcon sx={{ fontSize: 15 }} /> {track.likes}
                </span>
                <span>
                  <ChatBubbleOutlinedIcon sx={{ fontSize: 15 }} />{" "}
                  {track.comments}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default RadioList;
