import { useContext } from "react";
import { ConstellationContext } from "./Constellation";
import EditIcon from "@mui/icons-material/Edit";

function ConstellationGalleryBox({ className, month, constellationData }) {
  const { setIsOpened } = useContext(ConstellationContext);

  const handleClick = () => {
    setIsOpened(true);
  };

  // SVG 관련 함수들
  const width = 400;
  const height = 400;
  const scaleX = (x) => (x + 10) * (width / 20);
  const scaleY = (y) => (10 - y) * (height / 20);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col">
        {/* 월 표시 */}
        <div className="flex justify-center text-white text-sm font-medium mb-2">
          {month}월
        </div>

        {/* 별자리 컨테이너 */}
        <div
          onClick={handleClick}
          className={`w-[250px] h-[150px] flex justify-center items-center cursor-pointer hover:opacity-90 transition-all duration-300 relative aspect-[2/1] bg-white/10 rounded-2xl overflow-hidden border border-white/80 ${className}`}
        >
          {/* 별자리 SVG */}
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            className="p-4"
          >
            {constellationData &&
              constellationData.map((line, index) => (
                <line
                  key={`line-${index}`}
                  x1={scaleX(line.start.x)}
                  y1={scaleY(line.start.y)}
                  x2={scaleX(line.end.x)}
                  y2={scaleY(line.end.y)}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeOpacity="0.6"
                />
              ))}
            {/* 별 점들 */}
            {constellationData &&
              constellationData.map((line, index) => (
                <>
                  <circle
                    key={`start-${index}`}
                    cx={scaleX(line.start.x)}
                    cy={scaleY(line.start.y)}
                    r="4"
                    fill="#FFFFFF"
                    className="animate-pulse"
                  />
                  <circle
                    key={`end-${index}`}
                    cx={scaleX(line.end.x)}
                    cy={scaleY(line.end.y)}
                    r="4"
                    fill="#FFFFFF"
                    className="animate-pulse"
                  />
                </>
              ))}
          </svg>

          {/* 편집 버튼 */}
          <button
            className="absolute bottom-4 right-4 w-7 h-7 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              // 편집 기능 추가
            }}
          >
            <EditIcon
              sx={{
                fontSize: 20,
                color: "rgba(255, 255, 255, 0.8)",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConstellationGalleryBox;
