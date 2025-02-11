import { useEffect, useRef } from "react";

function ConstellationCreateAiEvent({ data }) {
  const canvasRef = useRef(null);
  const { lines, color, count } = data;

  useEffect(() => {
    if (!canvasRef.current || !lines || !color) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000033";
    ctx.fillRect(0, 0, width, height);

    // 좌표 변환 함수 ((-10,10) 좌표계를 캔버스 좌표로 변환)
    const scaleX = (x) => (x + 10) * (width / 20);
    const scaleY = (y) => (10 - y) * (height / 20);

    // 교차점 및 끝점 수집
    const points = new Set();
    lines.forEach((line) => {
      // 시작점과 끝점 추가
      points.add(`${line.start.x},${line.start.y}`);
      points.add(`${line.end.x},${line.end.y}`);
    });

    // 선 그리기
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    lines.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(scaleX(line.start.x), scaleY(line.start.y));
      ctx.lineTo(scaleX(line.end.x), scaleY(line.end.y));
      ctx.stroke();
    });

    // 점들을 배열로 변환
    const pointsArray = Array.from(points).map((point) => {
      const [x, y] = point.split(",").map(Number);
      return { x, y };
    });

    // 별 그리기 함수
    const drawStar = (x, y, fillStyle, size = 4) => {
      ctx.beginPath();
      ctx.arc(scaleX(x), scaleY(y), size, 0, Math.PI * 2);
      ctx.fillStyle = fillStyle;
      ctx.fill();

      // 빛나는 효과
      ctx.beginPath();
      ctx.arc(scaleX(x), scaleY(y), size + 2, 0, Math.PI * 2);
      ctx.fillStyle = `${fillStyle}33`; // 33는 투명도 20%
      ctx.fill();
    };

    // 별 그리기
    pointsArray.forEach((point, index) => {
      if (index < count) {
        // count 개수만큼 컬러 별 그리기
        drawStar(point.x, point.y, color[index % color.length]);
      } else {
        // 나머지는 흰색 별로 그리기
        drawStar(point.x, point.y, "#FFFFFF");
      }
    });

    // 남은 컬러 별들 선 위에 배치
    if (pointsArray.length < count) {
      const remainingCount = count - pointsArray.length;
      for (let i = 0; i < remainingCount; i++) {
        // 임의의 선 선택
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        // 선 위의 임의의 지점 계산
        const t = Math.random();
        const x =
          randomLine.start.x + (randomLine.end.x - randomLine.start.x) * t;
        const y =
          randomLine.start.y + (randomLine.end.y - randomLine.start.y) * t;
        // 컬러 별 그리기
        drawStar(x, y, color[pointsArray.length + i]);
      }
    }
  }, [lines, color, count]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="w-full h-full rounded-2xl"
    />
  );
}

export default ConstellationCreateAiEvent;
