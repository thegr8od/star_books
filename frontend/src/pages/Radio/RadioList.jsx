import Layout from "../../components/Layout";
import Button from "../../components/Button";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import { useEffect, useRef, useState } from "react";
import useRadioApi from "../../api/useRadioApi";

function RadioList() {
  const categories = ["전체", "일상", "연애", "음악", "취미", "건강", "기타"];
  const scrollContainerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortType, setSortType] = useState("popular"); // 정렬방식
  const [tracks, setTracks] = useState([]); // 방송 목록
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 카테고리별 색상 설정
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

  // // 실시간 방송 목록, 시청자 수 가져오기
  // useEffect(() => {
  //   const fetchBroadcasts = () => {
  //     setLoading(true);
  //     getLiveBroadcasts()
  //       .then((response) => {
  //         if (response.data) {
  //           // 각 방송마다 시청자 수 업데이트
  //           const updatePromises = response.data.map((track) =>
  //             updateParticipants(track)
  //           );
  //           return Promise.all(updatePromises);
  //         }
  //         return []; // response.data가 없다면 빈 배열 반환
  //       })
  //       .catch((error) => {
  //         setError("방송 목록을 불러오는데 실패했습니다.");
  //         console.error("방송 목록 조회 중 오류 발생 : ", error);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   };

  //   fetchBroadcasts();
  //   const interval = setInterval(fetchBroadcasts, 60000); // 1분마다 방송 목록 갱신
  //   return () => clearInterval(interval);
  // }, []);

  // 트랙 정렬
  const getSortedTracks = (tracks) => {
    // 최신순
    if (sortType === "latest") {
      // 양수 : b가 더 최신, 음수 : a가 더 최신
      return [...tracks].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      // 인기순 -> 시청자 수에 따라
    } else if (sortType === "popular") {
      return [...tracks].sort(
        (a, b) => b.participantCount - a.participantCount
      );
    }
    return tracks;
  };

  // 선택된 카테고리에 따라 트랙 필터링
  const filteredTracks = getSortedTracks(
    selectedCategory === "전체"
      ? tracks
      : tracks.filter((track) => track.category === selectedCategory)
  );

  // 카테고리 스크롤
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

  // 로딩 중 표시
  if (loading) {
    return <div className="text-white text-center">로딩 중...</div>;
  }

  // 에러 표시
  if (error) {
    return <div className="text-white text-center">{error}</div>;
  }

  return (
    <>
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
                      {track.participantCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default RadioList;
