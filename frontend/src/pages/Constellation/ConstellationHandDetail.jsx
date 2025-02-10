import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";
import OpenWithIcon from "@mui/icons-material/OpenWith";

// 샘플 데이터
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

function ConstellationHandDetail() {
  const { year, month } = useParams();
  const navigate = useNavigate();
  const [stars, setStars] = useState(sampleWorryStars);
  const [connections, setConnections] = useState(sampleConnections);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState("move");
  const [selectedStar, setSelectedStar] = useState(null);
  const [connectingStars, setConnectingStars] = useState([]);
  const [originalStars, setOriginalStars] = useState(null);
  const [originalConnections, setOriginalConnections] = useState(null);

  // 별 드래그 처리
  // 별 드래그 시작 함수
  const handleMouseDown = (e, starId) => {
    if (!isEditing || editMode !== "move") return;
    e.stopPropagation(); // 이벤트 버블링 방지
    setSelectedStar(starId);
  };

  // 별 드래그 처리 함수
  const handleStarDrag = (e, starId) => {
    if (!isEditing || editMode !== "move") return;

    const container = document.querySelector(".star-container");
    const rect = container.getBoundingClientRect();

    // 마우스 위치를 퍼센트로 변환
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // 범위를 0~100으로 제한
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setStars((prev) =>
      prev.map((star) =>
        star.id === starId ? { ...star, x: clampedX, y: clampedY } : star
      )
    );
  };

  // =========== 드래그 이벤트 처리 ===========
  useEffect(() => {
    // 1. 이벤트 핸들러 함수들 정의의
    // 마우스를 움직일 때마다 실행되는 함수
    const handleMouseMove = (e) => {
      // 선택된 별이 있을 때만 위치 업데이트
      if (selectedStar !== null) {
        handleStarDrag(e, selectedStar);
      }
    };

    // 마우스 놓을 때 실행되는 함수
    const handleMouseUp = () => {
      setSelectedStar(null);
    };

    // 2. 별이 선택되었을 때만 이벤트 리스너 등록
    if (selectedStar !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    // 3. 정리 함수
    // 3-1. 컴포넌트가 화면에서 사라질 때
    // 3-2. selectedStar가 변경될 때
    // => 등록했던 이벤트 리스너들을 제거거
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedStar, isEditing, editMode]);

  // 편집 모드 시작
  const startEditing = () => {
    // 현재 별과 연결 상태를 백업
    setOriginalStars([...stars]);
    setOriginalConnections([...connections]);
    setIsEditing(true); // 편집 활성화
    setEditMode("move"); // 기본 편집 모드 -> 이동
  };

  // =========== 편집 모드 관련 함수 ===========
  // 변경사항 저장
  const handleSave = () => {
    setIsEditing(false); // 편집 비활성화
    setConnectingStars([]); // 연결중이던 별들 초기화
    // 백업해뒀던 거 초기화
    setOriginalStars(null);
    setOriginalConnections(null);
  };

  // 변경사항 취소
  const handleCancel = () => {
    // 별, 연결 백업해둔 상태로 복구
    setStars(originalStars);
    setConnections(originalConnections);
    setIsEditing(false);
    setConnectingStars([]);
    // 백업해둔거 초기화
    setOriginalStars(null);
    setOriginalConnections(null);
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* 별자리 영역 */}
        <div className="relative flex-1 w-full star-container py-16 px-8 min-h-[60vh] ">
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
              className={`absolute ${
                isEditing
                  ? "cursor-pointer pointer-events-auto"
                  : "pointer-events-none"
              }`}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
              onMouseDown={(e) => handleMouseDown(e, star.id)}
              onClick={() => handleStarClick(star.id)}
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
                  className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${star.color}50 0%, transparent 100%)`,
                    animation: isEditing ? "none" : "starGlow 3s infinite",
                  }}
                />

                {/* 빛나는 효과 (외부 링) */}
                <div
                  className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
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
        <div className="relative h-[120px] flex items-center justify-end px-4">
          {/* 편집 버튼들 */}
          <div className="flex gap-1.5">
            {!isEditing ? (
              <button
                onClick={startEditing}
                className="bg-[#1F1F59] text-white w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all hover:bg-[#2a2a7a] select-none"
              >
                <EditIcon sx={{ fontSize: { xs: 20, md: 25, lg: 30 } }} />
              </button>
            ) : (
              <div className="flex gap-1.5">
                <button
                  onClick={handleCancel}
                  className="bg-[#1F1F59] text-white w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all hover:bg-[#2a2a7a] select-none"
                >
                  <CloseIcon sx={{ fontSize: { xs: 20, md: 25, lg: 30 } }} />
                </button>
                <button
                  onClick={() => setEditMode("move")}
                  className={`bg-[#1F1F59] text-white w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all hover:bg-[#2a2a7a] select-none ${
                    editMode === "move" ? "ring-2 ring-white" : ""
                  }`}
                >
                  <OpenWithIcon sx={{ fontSize: { xs: 20, md: 25, lg: 30 } }} />
                </button>
                <button
                  onClick={() => {
                    setEditMode("connect");
                    setConnectingStars([]);
                  }}
                  className={`bg-[#1F1F59] text-white w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all hover:bg-[#2a2a7a] select-none ${
                    editMode === "connect" ? "ring-2 ring-white" : ""
                  }`}
                >
                  <CreateIcon sx={{ fontSize: { xs: 20, md: 25, lg: 30 } }} />
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#1F1F59] text-white w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all hover:bg-[#2a2a7a] select-none"
                >
                  <CheckIcon sx={{ fontSize: { xs: 20, md: 25, lg: 30 } }} />
                </button>
              </div>
            )}
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

export default ConstellationHandDetail;
