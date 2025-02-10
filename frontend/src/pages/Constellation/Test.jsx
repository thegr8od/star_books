import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";
import OpenWithIcon from "@mui/icons-material/OpenWith";

const sampleWorryStars = [
  {
    id: 1,
    date: "2025-01-15",
    color: "#9370DB",
    text: "다음 주 발표가 걱정돼요. 준비를 잘 할 수 있을까요?",
    x: 25,
    y: 35,
  },
  {
    id: 2,
    date: "2025-01-20",
    color: "#4682B4",
    text: "친구와 다퉜어요. 어떻게 화해하면 좋을지 모르겠어요.",
    x: 45,
    y: 65,
  },
  {
    id: 3,
    date: "2025-01-25",
    color: "#FF6B6B",
    text: "프로젝트 마감일이 너무 빠듯해요. 시간이 부족할 것 같아요.",
    x: 75,
    y: 15,
  },
];

// 초기 연결선 배열 (비어있음)
const sampleConnections = [];

function Test() {
  // =========== 상태 관리 ===========
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 선택된 날짜
  const [stars, setStars] = useState(sampleWorryStars); // 별들의 위치와 정보
  const [connections, setConnections] = useState(sampleConnections); // 별들 사이의 연결선
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 활성화 여부
  const [editMode, setEditMode] = useState("move"); // 편집 모드 타입: 'move'(이동) 또는 'connect'(연결)
  const [selectedStar, setSelectedStar] = useState(null); // 드래그 중인 별의 ID
  const [connectingStars, setConnectingStars] = useState([]); // 연결 중인 별들의 ID 배열
  const [originalStars, setOriginalStars] = useState(null); // 편집 전 별들의 원본 상태
  const [originalConnections, setOriginalConnections] = useState(null); // 편집 전 연결선들의 원본 상태

  // =========== 날짜 네비게이션 함수 ===========
  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // 년월 포맷팅 (예: "2025년 1월")
  const formatYearMonth = (date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  // =========== 별 조작 관련 함수 ===========
  // 별 드래그 처리
  const handleStarDrag = (e, starId) => {
    if (!isEditing || editMode !== "move") return; // 이동 모드일 때만 드래그 가능

    const container = document.querySelector(".star-container");
    const rect = container.getBoundingClientRect();
    // 마우스 위치를 백분율 좌표로 변환
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setStars((prev) =>
      prev.map((star) =>
        star.id === starId
          ? {
              ...star,
              // 화면 범위를 벗어나지 않도록 제한
              x: Math.max(0, Math.min(100, x)),
              y: Math.max(0, Math.min(100, y)),
            }
          : star
      )
    );
  };

  // 별 클릭 시 연결 처리
  const handleStarClick = (starId) => {
    if (!isEditing || editMode !== "connect") return; // 연결 모드일 때만 동작

    if (connectingStars.length === 0) {
      // 첫 번째 별 선택
      setConnectingStars([starId]);
    } else if (connectingStars[0] !== starId) {
      // 두 번째 별 선택 시 연결 생성
      const newConnection = {
        id: Date.now(),
        star1: connectingStars[0],
        star2: starId,
      };
      setConnections((prev) => [...prev, newConnection]);
      setConnectingStars([]); // 연결 완료 후 선택 초기화
    }
  };

  // =========== 드래그 이벤트 처리 ===========
  useEffect(() => {
    // 마우스 이동 중 별 위치 업데이트
    const handleMouseMove = (e) => {
      if (selectedStar !== null) {
        handleStarDrag(e, selectedStar);
      }
    };

    // 마우스 놓을 때 드래그 종료
    const handleMouseUp = () => {
      setSelectedStar(null);
    };

    // 드래그 중일 때만 이벤트 리스너 등록
    if (selectedStar !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    // 컴포넌트 언마운트 또는 드래그 종료 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedStar]);

  // 편집 모드 시작
  const startEditing = () => {
    setOriginalStars([...stars]); // 현재 상태 백업
    setOriginalConnections([...connections]);
    setIsEditing(true);
    setEditMode("move"); // 기본값은 이동 모드
  };

  // =========== 편집 모드 관련 함수 ===========
  // 변경사항 저장
  const handleSave = () => {
    setIsEditing(false);
    setConnectingStars([]);
    setOriginalStars(null);
    setOriginalConnections(null);
  };

  // 변경사항 취소
  const handleCancel = () => {
    setStars(originalStars); // 백업해둔 상태로 복구
    setConnections(originalConnections);
    setIsEditing(false);
    setConnectingStars([]);
    setOriginalStars(null);
    setOriginalConnections(null);
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        {/* 상단 헤더 */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <div className="flex items-center justify-center w-full">
            <button
              onClick={handlePrevMonth}
              className="text-white text-2xl px-4"
            >
              {"<"}
            </button>
            <div className="text-white text-3xl font-bold">
              {formatYearMonth(currentDate)}
            </div>
            <button
              onClick={handleNextMonth}
              className="text-white text-2xl px-4"
            >
              {">"}
            </button>
          </div>
        </div>

        {/* 별자리 영역 */}
        <div className="relative flex-1 w-full star-container mb-4 overflow-hidden">
          {/* 안내 텍스트 */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
            <div className="text-white/60 text-xs whitespace-nowrap">
              별들의 이야기가 시작되는 곳.
            </div>
            <div className="text-white/60 text-xs mt-0.5 whitespace-nowrap">
              당신의 별은 어떤 빛을 띄나요?
            </div>
          </div>

          {/* 별들 사이의 연결선 */}
          {connections.map((connection) => {
            const star1 = stars.find((s) => s.id === connection.star1);
            const star2 = stars.find((s) => s.id === connection.star2);
            return (
              <svg
                key={connection.id}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                <line
                  x1={`${star1.x}%`}
                  y1={`${star1.y}%`}
                  x2={`${star2.x}%`}
                  y2={`${star2.y}%`}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                />
              </svg>
            );
          })}

          {/* 별들 */}
          {stars.map((star) => (
            <div
              key={star.id}
              className={`absolute cursor-${
                isEditing && editMode === "move" ? "move" : "pointer"
              }`}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => handleStarClick(star.id)}
              onMouseDown={(e) => {
                if (isEditing && editMode === "move") {
                  e.preventDefault();
                  setSelectedStar(star.id);
                }
              }}
            >
              <div className="relative group">
                {/* 중심 별 */}
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: `radial-gradient(circle at center, white 0%, ${star.color} 50%, transparent 100%)`,
                    boxShadow: `0 0 5px ${star.color}, 0 0 10px white`,
                    filter: "url(#glow)",
                    animation: isEditing ? "none" : "starPulse 2s infinite",
                    outline: connectingStars.includes(star.id)
                      ? "2px solid white"
                      : "none",
                    outlineOffset: "2px",
                  }}
                />

                {/* 빛나는 효과 (내부 링) */}
                <div
                  className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: `radial-gradient(circle at center, ${star.color}50 0%, transparent 100%)`,
                    animation: isEditing ? "none" : "starGlow 3s infinite",
                  }}
                />

                {/* 빛나는 효과 (외부 링) */}
                <div
                  className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: `radial-gradient(circle at center, ${star.color}30 0%, transparent 100%)`,
                    animation: isEditing ? "none" : "starGlow 4s infinite",
                  }}
                />

                {/* 호버 시 텍스트 */}
                {!isEditing && (
                  <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-gray-800 text-white text-sm rounded p-2 whitespace-nowrap">
                      <div>{star.date}</div>
                      <div className="max-w-xs overflow-hidden text-ellipsis">
                        {star.text}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 네비게이션 */}
        <div className="relative flex flex-col">
          {/* 편집 버튼들 */}
          <div className="absolute right-4 bottom-24">
            {!isEditing ? (
              <button
                onClick={startEditing}
                className="bg-[#1F1F59] text-white w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-[#2a2a7a] select-none"
              >
                <EditIcon fontSize="15" />
              </button>
            ) : (
              <div className="flex gap-1.5">
                <button
                  onClick={handleCancel}
                  className="bg-[#1F1F59] text-white w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-[#2a2a7a] select-none"
                >
                  <CloseIcon fontSize="15" />
                </button>
                <button
                  onClick={() => setEditMode("move")}
                  className={`bg-[#1F1F59] text-white w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-[#2a2a7a] select-none ${
                    editMode === "move" ? "ring-2 ring-white" : ""
                  }`}
                >
                  <OpenWithIcon fontSize="15" />
                </button>
                <button
                  onClick={() => {
                    setEditMode("connect");
                    setConnectingStars([]);
                  }}
                  className={`bg-[#1F1F59] text-white w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-[#2a2a7a] select-none ${
                    editMode === "connect" ? "ring-2 ring-white" : ""
                  }`}
                >
                  <CreateIcon fontSize="15" />
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#1F1F59] text-white w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-[#2a2a7a] select-none"
                >
                  <CheckIcon fontSize="15" />
                </button>
              </div>
            )}
          </div>

          {/* 하단 네비게이션 바 */}
          <div className="flex justify-between items-center px-4 py-4 w-full">
            <button className="bg-[#1F1F59]/50 text-white/70 px-8 py-3 rounded-full cursor-not-allowed select-none">
              나의 별
            </button>
            <button className="bg-[#5252E9]/50 text-white/70 w-14 h-14 rounded-full flex items-center justify-center text-3xl font-light cursor-not-allowed select-none">
              +
            </button>
            <button className="bg-[#1F1F59]/50 text-white/70 px-8 py-3 rounded-full cursor-not-allowed select-none">
              캘린더
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes starPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.8);
            opacity: 0.8;
          }
        }

        @keyframes starGlow {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.2;
          }
        }
      `}</style>
    </Layout>
  );
}

export default Test;
