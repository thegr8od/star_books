import { forwardRef, useRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const ImagePreprocessor = forwardRef(
  ({ onImageProcessed, onProcessingStateChange }, ref) => {
    const canvasRef = useRef(null);

    useImperativeHandle(ref, () => ({
      processImage: async (file) => {
        if (!file || !onImageProcessed || !onProcessingStateChange) {
          throw new Error("필수 파라미터가 누락되었습니다.");
        }

        console.log("이미지 전처리 시작:", file.name);
        onProcessingStateChange(true);

        try {
          const result = await processImageFile(file);
          onImageProcessed(result);
          return result;
        } finally {
          onProcessingStateChange(false);
        }
      },
    }));

    const processImageFile = async (file) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target.result;
          img.onload = () => {
            try {
              const { processedLines, width, height } = processImage(img);
              resolve({
                lines: processedLines,
                dimensions: { width, height },
              });
            } catch (error) {
              reject(error);
            }
          };
          img.onerror = () => reject(new Error("이미지 로드 실패"));
        };
        reader.onerror = () => reject(new Error("파일 읽기 실패"));
        reader.readAsDataURL(file);
      });
    };

    const processImage = (img) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // 이미지 크기 조정
      let { width, height } = calculateDimensions(img.width, img.height);
      canvas.width = width;
      canvas.height = height;

      // 캔버스 초기화 및 이미지 그리기
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // 이미지 데이터 처리
      const imageData = ctx.getImageData(0, 0, width, height);
      convertToGrayscale(imageData);
      ctx.putImageData(imageData, 0, 0);

      // 엣지 검출 및 좌표 변환
      const processedLines = detectEdges(ctx, width, height);
      return { processedLines, width, height };
    };

    const calculateDimensions = (width, height) => {
      const maxSize = 800;
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else {
          width = (width / height) * maxSize;
          height = maxSize;
        }
      }
      return { width: Math.floor(width), height: Math.floor(height) };
    };

    const convertToGrayscale = (imageData) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
      }
    };

    const detectEdges = (ctx, width, height) => {
      const points = [];
      const imageData = ctx.getImageData(0, 0, width, height);
      const pointCount = 100;
      const step = Math.max(1, Math.floor((width * height) / pointCount));

      // 좌표 변환을 위한 스케일 팩터
      const scaleX = 20 / width;
      const scaleY = 20 / height;

      for (let i = 0; i < width * height; i += step) {
        const x = i % width;
        const y = Math.floor(i / width);

        if (isEdgePoint(imageData.data, x, y, width, height)) {
          // -10 ~ 10 범위로 좌표 변환
          const normalizedX = (x * scaleX - 10).toFixed(2) * 1;
          const normalizedY = (-y * scaleY + 10).toFixed(2) * 1;

          points.push({
            x: normalizedX,
            y: normalizedY,
          });
        }
      }

      // 점들을 선으로 연결
      return connectPoints(points);
    };

    const isEdgePoint = (data, x, y, width, height) => {
      const idx = (y * width + x) * 4;
      if (data[idx + 3] === 0) return false;

      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = (ny * width + nx) * 4;
          if (Math.abs(data[idx] - data[nIdx]) > 30) return true;
        }
      }
      return false;
    };

    const connectPoints = (points) => {
      if (points.length < 2) return [];

      const lines = [];
      for (let i = 0; i < points.length - 1; i++) {
        lines.push({
          start: { x: points[i].x, y: points[i].y },
          end: { x: points[i + 1].x, y: points[i + 1].y },
        });
      }

      // 마지막 점과 첫 점 연결 (선택적)
      if (points.length > 2) {
        lines.push({
          start: {
            x: points[points.length - 1].x,
            y: points[points.length - 1].y,
          },
          end: { x: points[0].x, y: points[0].y },
        });
      }

      return lines;
    };

    return <canvas ref={canvasRef} style={{ display: "none" }} />;
  }
);

ImagePreprocessor.propTypes = {
  onImageProcessed: PropTypes.func.isRequired,
  onProcessingStateChange: PropTypes.func.isRequired,
};

export default ImagePreprocessor;
