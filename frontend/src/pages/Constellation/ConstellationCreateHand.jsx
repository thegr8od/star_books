import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

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

function ConstellationCreateHand() {
  const [stars, setStars] = useState(sampleWorryStars); // 별들의 위치와 정보
  const [connections, setConnections] = useState(sampleConnections); // 별들 사이의 연결선
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 활성화 여부
  const [editMode, setEditMode] = useState("move"); // 편집 모드 타입: 'move'(이동) 또는 'connect'(연결)
  const [connectingStars, setConnectingStars] = useState([]); // 연결 중인 별들의 ID 배열
  const navigate = useNavigate();

  // 상세 페이지로 이동
  const handleHandDetail = () => {
    navigate("/constellation/create/detail");
  };

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
  // x,y 값을 0 ~ 10으로 변환시키는 함수
  const convertTo10Scale = (value) => {
    return Math.round((value / 100) * 10);
  };

  // 별 드래그 처리
  const handleStarDrag = (e, starId) => {
    // 편집모드, 이동모드 아니면 함수 실행 중단
    if (!isEditing || editMode !== "move") return;

    // star container 요소 위치, 크기 정보 가져옴
    const container = document.querySelector(".star-container");
    const rect = container.getBoundingClientRect();

    // 마우스의 현재 위치(clientX, clientY)에서 컨테이너의 위치를 빼고
    // 컨테이너의 크기로 나눠서 0~100 사이의 백분율 값으로 변환
    // 정수 단위로만 이동 반올림
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // 좌표값 로깅 추가
    console.log(`Star ${starId} Position:`, { x, y });

    // stars 배열을 순회하면서 드래그 중인 별의 위치만 업데이트
    setStars((prev) =>
      prev.map((star) =>
        star.id === starId
          ? {
              ...star,
              // x와 y값이 0~100 사이를 벗어나지 않도록 제한
              x: Math.max(0, Math.min(100, x)),
              y: Math.max(0, Math.min(100, y)),
            }
          : star
      )
    );
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        {/* 별자리 영역 */}
        <div
          className="relative flex-1 w-full star-container mb-4 border-[1px] border-gray-50 rounded-lg"
          onClick={handleHandDetail}
        >
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
            <button
              onClick={handleHandDetail}
              className="bg-[#1F1F59] text-white w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all hover:bg-[#2a2a7a] select-none"
            >
              <EditIcon sx={{ xs: 20, md: 25, lg: 30 }} />
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

export default ConstellationCreateHand;
