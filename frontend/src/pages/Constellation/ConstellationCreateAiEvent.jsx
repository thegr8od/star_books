import { useEffect, useRef } from "react";

function ConstellationCreateAiEvent({ data }) {
  const canvasRef = useRef(null);
  const { lines, color, count } = data;

  useEffect(() => {
    if (!canvasRef.current || !lines || !color) return;
    //

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // 캔버스 초기화 및 배경 설정
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000033";
    ctx.fillRect(0, 0, width, height);
    

    // 좌표계 변환이 필요 없음 (이미 0-100 범위의 백분율)
    const scaleX = (x) => (x * width) / 100;
    const scaleY = (y) => (y * height) / 100;

    // 별자리 선 그리기
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 2;

    lines.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(scaleX(line.start.x), scaleY(line.start.y));
      ctx.lineTo(scaleX(line.end.x), scaleY(line.end.y));
      ctx.stroke();
    });

    // 모든 별점을 배열로 저장
    const points = new Set();
    lines.forEach((line) => {
      points.add(`${line.start.x},${line.start.y}`);
      points.add(`${line.end.x},${line.end.y}`);
    });

    // 별 그리기 함수 (빛나는 효과)
    const drawStar = (x, y, fillStyle, size = 4) => {
      ctx.beginPath();
      ctx.arc(scaleX(x), scaleY(y), size, 0, Math.PI * 2);
      ctx.fillStyle = fillStyle;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(scaleX(x), scaleY(y), size + 2, 0, Math.PI * 2);
      ctx.fillStyle = `${fillStyle}33`;
      ctx.fill();
    };

    // 모든 교차점에 별 그리기
    Array.from(points).forEach((point, index) => {
      const [x, y] = point.split(",").map(Number);
      if (index < count) {
        drawStar(x, y, color[index % color.length]);
      } else {
        drawStar(x, y, "#FFFFFF");
      }
    });

    // 남은 컬러 별들을 선 위에 추가로 배치
    if (points.size < count) {
      const remainingCount = count - points.size;
      for (let i = 0; i < remainingCount; i++) {
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        const t = Math.random();
        const x =
          randomLine.start.x + (randomLine.end.x - randomLine.start.x) * t;
        const y =
          randomLine.start.y + (randomLine.end.y - randomLine.start.y) * t;
        drawStar(x, y, color[pointsArray.length + i]);
      }
    }
  }, [lines, color, count]);

  return (
    <canvas ref={canvasRef} width={400} height={400} className="w-full h-full rounded-2xl" />
  );
}

export default ConstellationCreateAiEvent;
