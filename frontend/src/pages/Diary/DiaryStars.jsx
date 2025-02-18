import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TimelineIcon from "@mui/icons-material/Timeline";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useOutletContext } from "react-router-dom";
import useUniverseApi from "../../api/useUniverseApi";
import GetColor from "../../components/GetColor";
import useStarlineApi from "../../api/useStarlineApi";

function DiaryStars() {
  // ==================================================== 상태 관리 ====================================================
  const { currentDate } = useOutletContext();

  const [stars, setStars] = useState([]); // 별(초기 axios 응답 데이터)
  const [connections, setConnections] = useState([]); // 선(초기 axios 응답 데이터, axios 요청 데이터)

  const [isEdit, setIsEdit] = useState(false); // 편집 상태
  const [editMode, setEditMode] = useState("move"); // 편집 모드('move' 또는 'connect')
  const [originalStars, setOriginalStars] = useState([]); // 편집시 원본 별 복사
  const [originalConnections, setOriginalConnections] = useState([]); // 편집시 원본 선 복사

  const [selectedStar, setSelectedStar] = useState(null); // 편집시 선택된 별
  const [modifiedStars, setModifiedStars] = useState({}); // 편집시 이동된 별(axios 요청 데이터)

  const [showConnections, setShowConnections] = useState(true); // 선 표시
  const BUTTON_STYLES = {
    base: "bg-white/25 text-white size-6 rounded-full flex items-center justify-center",
    active: "ring-2 ring-white",
  };

  useEffect(() => {
    (async () => {
      const requestData = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1 };
      const response = await useUniverseApi.getMonthlyPersonalUniv(requestData);
      if (response.status === "C000") {
        console.log("별 조회 성공");
        setStars(response.data);
      } else {
        console.log("별 조회 실패");
      }
    })();
    (async () => {
      const requestData = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1 };
      const response = await useStarlineApi.getMonthlyStarlineCoords(requestData);
      if (response.status === "C000") {
        console.log("별선 조회 성공");
        setConnections(response.data);
      } else {
        console.log("별선 조회 실패");
      }
    })();
  }, [currentDate]);

  // ==================================================== move 모드 ====================================================
  // 드래그 앤 드롭 (별 위치 업데이트)
  const handleStarDrag = (e) => {
    // 별들이 위치한 컨테이너 요소를 찾음
    const container = document.querySelector(".star-container");
    if (!container) return;

    // 컨테이너의 위치와 크기 정보를 가져옴
    const rect = container.getBoundingClientRect();

    // 마우스 위치를 컨테이너 내부의 백분율 좌표로 변환
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // 별의 위치가 컨테이너를 벗어나지 않도록 0~100 사이로 제한
    const newX = Math.max(0, Math.min(100, x));
    const newY = Math.max(0, Math.min(100, y));

    // 선택된 별 위치 업데이트
    setStars((prev) => prev.map((star) => (star.diaryEmotionId === selectedStar ? { ...star, xcoord: newX, ycoord: newY } : star)));

    // 수정된 별 위치 저장
    setModifiedStars((prev) => ({
      ...prev,
      [selectedStar]: {
        xCoord: newX,
        yCoord: newY,
      },
    }));
  };

  // 드래그 앤 드롭 (마우스 이벤트 처리)
  useEffect(() => {
    const handleMouseMove = (e) => {
      handleStarDrag(e);
    };

    const handleMouseUp = () => {
      setSelectedStar(null);
    };

    // 별이 선택되면서 move 모드일 때만 이벤트 리스너 추가
    if (selectedStar !== null && editMode === "move") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    // 컴포넌트 언마운트 또는 의존성 변경 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedStar, editMode, isEdit]);

  // ==================================================== connect 모드 ====================================================
  // 별 클릭 시 선 연결 함수
  const handleStarClick = (diaryEmotionId) => {
    if (!selectedStar) {
      // 첫 번째 별 선택
      setSelectedStar(diaryEmotionId);
    } else if (selectedStar === diaryEmotionId) {
      // 두 번째 같은 별 선택 -> 선택 취소
      setSelectedStar(null);
    } else if (selectedStar !== diaryEmotionId) {
      // 두 번째 다른 별 선택
      // 존재하는 연결인지 확인
      const connectionExists = connections.some((connection) => (connection.startEmotionId === selectedStar && connection.endEmotionId === diaryEmotionId) || (connection.startEmotionId === diaryEmotionId && connection.endEmotionId === selectedStar));
      // 존재하지 않으면 연결 생성
      if (!connectionExists) {
        setConnections((prev) => [
          ...prev,
          {
            startEmotionId: selectedStar,
            endEmotionId: diaryEmotionId,
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
          },
        ]);
      }
      // 선택된 별 초기화
      setSelectedStar(null);
    }
  };

  // 선 클릭 시 삭제하는 함수
  const handleConnectionClick = (connection) => {
    setConnections((prev) => prev.filter((c) => !((c.startEmotionId === connection.startEmotionId && c.endEmotionId === connection.endEmotionId) || (c.startEmotionId === connection.endEmotionId && c.endEmotionId === connection.startEmotionId))));
  };

  // ==================================================== 편집 함수 ====================================================
  // 편집 시작
  const handleEdit = () => {
    setOriginalStars([...stars]); // 원본 별 데이터 복사 -> 취소시 복구에 사용
    setOriginalConnections([...connections]); // 원본 선 데이터 복사 -> 취소 시 복구에 사용
    setIsEdit(true); // 편집 상태 활성화
    setSelectedStar(null); // 선택된 별 초기화
    setModifiedStars({}); // 편집된 별 초기화
  };

  // 변경 저장
  const handleSave = async () => {
    // axios 요청
    // 별 위치 업데이트 요청
    if (Object.keys(modifiedStars).length > 0) {
      const starsRequestData = Object.entries(modifiedStars).map(([diaryEmotionId, coords]) => ({
        diaryEmotionId: Number(diaryEmotionId),
        xCoord: coords.xCoord,
        yCoord: coords.yCoord,
      }));

      const starsResponse = await useUniverseApi.updatePersonalUniv(starsRequestData);
      if (starsResponse.status === "C000") {
        console.log("별 위치 업데이트 성공");
      } else {
        console.log("별 위치 업데이트 실패");
      }
    }

    // 별선 업데이트 요청
    // if (connections.length > 0) {
    //   console.log(connections)
    //   const connectionsRequestData = connections.map((connection) => ({
    //     startEmotionId: connection.startEmotionId,
    //     endEmotionId: connection.endEmotionId,
    //     year: currentDate.getFullYear(),
    //     month: currentDate.getMonth() + 1,
    //   }));

    //   const connectionsResponse = await useStarlineApi.updateStarlineCoords(connectionsRequestData);
    //   console.log(connectionsResponse);
    //   if (connectionsResponse.status === "C000") {
    //     console.log("별선 업데이트 성공");
    //   } else {
    //     console.log("별선 업데이트 실패");
    //   }
    // }

    setIsEdit(false); // 편집 상태 비활성화
    setOriginalStars([]); // 복사 별 데이터 초기화
    setOriginalConnections([]); // 복사 선 데이터 초기화
    setSelectedStar(null); // 선택된 별 초기화
    setModifiedStars({}); // 편집된 별 초기화
  };

  // 편집 취소
  const handleCancel = () => {
    setStars(originalStars); // 원본 별 데이터로 복구
    setConnections(originalConnections); // 원본 선 데이터로 복구
    setIsEdit(false); // 편집 상태 비활성화
    setOriginalStars([]); // 복사 별 데이터 초기화
    setOriginalConnections([]); // 복사 선 데이터 초기화
    setSelectedStar(null); // 선택된 별 초기화
    setModifiedStars({}); // 편집된 별 초기화
  };

  // ==============================================================================================================
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col ">
        {/* ========== 별 영역 ========== */}
        <div className="flex-1 relative star-container border border-gray-700">
          <div className="absolute left-1/2 -translate-x-1/2 text-center mt-3">
            <div className="text-white/60 text-xs">별들의 이야기가 시작되는 곳.</div>
            <div className="text-white/60 text-xs">당신의 별은 어떤 빛을 띄나요?</div>
          </div>

          {/* 선 (svg) */}
          <svg className="absolute w-full h-full pointer-events-none">
            {(isEdit || showConnections) &&
              connections.map((connection) => {
                // 연결된 시작과 끝 별 찾기
                const startStar = stars.find((star) => star.diaryEmotionId === connection.startEmotionId);
                const endStar = stars.find((star) => star.diaryEmotionId === connection.endEmotionId);
                // 연결된 별이 없으면 선 그리지 않음 (별이 삭제된 경우)
                if (!startStar || !endStar) return null;

                return (
                  <line
                    key={`${connection.startEmotionId}-${connection.endEmotionId}`}
                    x1={`${startStar.xcoord}%`} // 시작 별 x 좌표
                    y1={`${startStar.ycoord}%`} // 시작 별 y 좌표
                    x2={`${endStar.xcoord}%`} // 끝 별 x 좌표
                    y2={`${endStar.ycoord}%`} // 끝 별 y 좌표
                    stroke="rgba(255, 255, 255, 0.5)" // 선 색상
                    strokeWidth="1.5" // 선 두께
                    className={`${isEdit && editMode === "connect" ? "cursor-pointer" : ""}`} // 커서 스타일
                    style={{
                      pointerEvents: isEdit && editMode === "connect" ? "auto" : "none",
                    }} // 편집 모드에서만 클릭 가능
                    onClick={() => {
                      // 편집 상태이거나 connect 모드일 경우 -> 선 삭제 함수
                      if (isEdit && editMode === "connect") {
                        handleConnectionClick(connection);
                      }
                    }}
                  />
                );
              })}
          </svg>

          {/* 별 */}
          {stars.map((star) => (
            <div
              key={star.diaryEmotionId}
              className="absolute"
              style={{
                left: `${star.xcoord}%`,
                top: `${star.ycoord}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`size-3 rounded-full animate-pulse ${selectedStar === star.diaryEmotionId ? "outline outline-2 outline-white" : ""}  ${isEdit ? (editMode === "move" ? "cursor-move" : "cursor-pointer") : ""}`}
                style={{
                  background: `radial-gradient(circle at center, white 0%, ${GetColor(star.xvalue, star.yvalue)} 50%, transparent 100%)`,
                  boxShadow: `0 0 5px ${GetColor(star.xvalue, star.yvalue)}, 0 0 10px white`,
                }}
                onMouseDown={(e) => {
                  // 편집 상태 이면서 move 모드일 경우 -> 별 이동(드래그 앤 드롭)
                  if (isEdit && editMode === "move") {
                    e.preventDefault();
                    setSelectedStar(star.diaryEmotionId);
                  }
                }}
                onClick={() => {
                  // 편집 상태 이면서 connect 모드일 경우 -> 선 연결 함수
                  if (isEdit && editMode === "connect") {
                    handleStarClick(star.diaryEmotionId);
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* ========== 편집 버튼 영역 ========== */}
        <div className="flex justify-end mt-1.5">
          {!isEdit ? (
            <div className="flex space-x-1.5">
              {/* 선 표시 버튼 */}
              <button onClick={() => setShowConnections((prev) => !prev)} className={BUTTON_STYLES.base}>
                {showConnections ? <VisibilityIcon fontSize="inherit" /> : <VisibilityOffIcon fontSize="inherit" />}
              </button>

              {/* 편집 시작 버튼 */}
              <button onClick={handleEdit} className={BUTTON_STYLES.base}>
                <EditIcon fontSize="inherit" />
              </button>
            </div>
          ) : (
            <div className="flex space-x-1.5">
              {/* move 버튼 */}
              <button
                onClick={() => {
                  setEditMode("move"); // 편집 모드 move 전환
                  setSelectedStar(null); // 선택된 별 초기화
                }}
                className={`${BUTTON_STYLES.base} ${editMode === "move" ? BUTTON_STYLES.active : ""}`}
              >
                <OpenWithIcon fontSize="inherit" />
              </button>

              {/* connect 버튼 */}
              <button
                onClick={() => {
                  setEditMode("connect"); // 편집 모드 connect 전환
                  setSelectedStar(null); // 선택된 별 초기화
                }}
                className={`${BUTTON_STYLES.base} ${editMode === "connect" ? BUTTON_STYLES.active : ""}`}
              >
                <TimelineIcon fontSize="inherit" />
              </button>

              {/* 편집 취소 버튼 */}
              <button onClick={handleCancel} className={BUTTON_STYLES.base}>
                <CloseIcon fontSize="inherit" />
              </button>

              {/* 편집 저장 버튼 */}
              <button onClick={handleSave} className={BUTTON_STYLES.base}>
                <CheckIcon fontSize="inherit" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiaryStars;
