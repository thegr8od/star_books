import React from "react";
import { Tooltip } from "react-tooltip";

const emotionGuide = [
  {
    color: "#FF0000",
    description: "부정적이면서 격정도 높은 상태\n분노나 격앙 등 강렬한 감정",
  },
  {
    color: "#FFA500",
    description: "긴장과 불안이 섞이지만 에너지가 넘치는,\n초조·들뜬 기분",
  },
  {
    color: "#FFFF00",
    description: "밝고 긍정적이며 활력이 넘치는,\n즐겁고 들뜬 감정",
  },
  {
    color: "#90EE90",
    description: "가벼운 긍정과 신뢰함,\n상쾌하거나 약간 설레는 기분",
  },
  {
    color: "#008000",
    description: "온화하고 편안한 긍정,\n마음이 차분하고 안정된 상태",
  },
  {
    color: "#0000FF",
    description: "부정적이면서 낮은 각성,\n우울·침체 등 차분한 슬픔",
  },
  {
    color: "#800080",
    description: "부정적 감정 중 예민하거나 애매한 불안,\n미묘한 감정",
  },
  {
    color: "#808080",
    description: "중립적이고 무덤덤한 상태,\n특별히 두드러진 감정 기복이 없음",
  },
];

const findClosestEmotion = (hexColor) => {
  const hex2rgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const targetRgb = hex2rgb(hexColor);
  if (!targetRgb) return emotionGuide[7];

  const r = targetRgb.r;
  const g = targetRgb.g;
  const b = targetRgb.b;

  if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30) {
    return emotionGuide[7];
  }

  if (r > 200 && g < 100 && b < 100) return emotionGuide[0];
  if (r > 200 && g > 100 && g < 200 && b < 100) return emotionGuide[1];
  if (r > 200 && g > 200 && b < 100) return emotionGuide[2];
  if (g > r && g > b) return g > 200 ? emotionGuide[3] : emotionGuide[4];
  if (b > r && b > g) return emotionGuide[5];
  if (r > 100 && b > 150 && g < 100) return emotionGuide[6];

  return emotionGuide[7];
};

const DiaryColorGuide = ({ color, className = "" }) => {
  const emotion = findClosestEmotion(color);

  return (
    <>
      <span
        data-tooltip-id="emotion-tooltip"
        className={`bg-gray-500 rounded-full w-8 h-8 cursor-help ${className}`}
        style={{ backgroundColor: color }}
      />

      <Tooltip
        id="emotion-tooltip"
        place="bottom"
        content={emotion.description}
        className="max-w-xs bg-white text-gray-800 p-3 rounded-lg shadow-lg text-sm whitespace-pre-line"
        style={{
          zIndex: 10,
          opacity: 0.5,
        }}
      />
    </>
  );
};

export default DiaryColorGuide;
