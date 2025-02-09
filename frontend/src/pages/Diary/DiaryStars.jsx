import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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

function DiaryStars() {
  const [stars, setStars] = useState(sampleWorryStars);
  const [isEdit, setIsEdit] = useState(false);
  const [originalStars, setOriginalStars] = useState(null);

  // 편집 시작
  const handleEdit = () => {
    setOriginalStars([...stars]);
    setIsEdit(true);
  };

  // 변경 저장
  const handleSave = () => {
    setIsEdit(false);
    setOriginalStars(null);
  };

  // 편집 취소
  const handleCancel = () => {
    setStars(originalStars);
    setIsEdit(false);
    setOriginalStars(null);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        {/* 별 영역 */}
        <div className="flex-1 relative">
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <div className="text-white/60 text-xs">별들의 이야기가 시작되는 곳.</div>
            <div className="text-white/60 text-xs">당신의 별은 어떤 빛을 띄나요?</div>
          </div>

          {/* 별 */}
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: star.color,
                }}
              />
            </div>
          ))}
        </div>

        {/* 편집 버튼 */}
        <div className="h-8 relative">
          <div className="absolute right-1 top-1">
            {!isEdit ? (
              <button onClick={handleEdit} className="bg-[#1F1F59] text-white w-6 h-6 rounded-full flex items-center justify-center">
                <EditIcon fontSize="small" />
              </button>
            ) : (
              <div className="flex gap-1.5">
                <button onClick={handleCancel} className="bg-[#1F1F59] text-white w-6 h-6 rounded-full flex items-center justify-center">
                  <CloseIcon fontSize="small" />
                </button>
                <button onClick={handleSave} className="bg-[#1F1F59] text-white w-6 h-6 rounded-full flex items-center justify-center">
                  <CheckIcon fontSize="small" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DiaryStars;
