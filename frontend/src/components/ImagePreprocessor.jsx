import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { removeBackground } from "@imgly/background-removal";

const ImagePreprocessor = forwardRef(
  ({ onImageProcessed, onProcessingStateChange }, ref) => {
    const [imageData, setImageData] = useState({
      points: [],
      connections: [],
    });
    const canvasRef = useRef(null);

    useImperativeHandle(ref, () => ({
      processImage: async (file) => {
        console.log("ImagePreprocessor processImage 호출됨");
        try {
          const result = await processImage(file);
          console.log("이미지 전처리 성공:", result);
          return result;
        } catch (error) {
          console.error("이미지 전처리 중 에러:", error);
          throw error;
        }
      },
    }));

    const processImage = async (file) => {
      console.log("processImage 시작");
      onProcessingStateChange(true);
      try {
        console.log("배경 제거 시작:", file.name);

        // 이미지 크기 확인
        if (file.size > 10 * 1024 * 1024) {
          // 10MB 제한
          throw new Error("이미지 크기가 너무 큽니다 (최대 10MB)");
        }

        // 배경 제거 옵션 변경
        const options = {
          progress: (progress) => {
            console.log("배경 제거 진행률:", Math.round(progress * 100), "%");
          },
          debug: true,
          model: "accurate", // 더 정확한 모델 사용
          foregroundColor: [255, 255, 255], // 전경색을 흰색으로
          backgroundColor: [0, 0, 0], // 배경색을 검은색으로
          threshold: 0.1, // 임계값 낮춤
        };

        const resultBlob = await removeBackground(file, options);
        console.log("배경 제거 완료");

        const imgUrl = URL.createObjectURL(resultBlob);

        // 이미지 로드 및 엣지 검출
        const img = new Image();
        img.src = imgUrl;

        await new Promise((resolve, reject) => {
          img.onload = () => {
            console.log("이미지 크기:", img.width, "x", img.height);

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // 캔버스 크기 조정 (너무 큰 이미지 처리를 위해)
            const maxSize = 800;
            let width = img.width;
            let height = img.height;

            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = (height / width) * maxSize;
                width = maxSize;
              } else {
                width = (width / height) * maxSize;
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;

            // 배경을 검은색으로 설정
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);

            // 이미지 그리기
            ctx.drawImage(img, 0, 0, width, height);

            // 엣지 검출을 위해 이미지를 흑백으로 변환
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = data[i + 1] = data[i + 2] = avg;
            }

            ctx.putImageData(imageData, 0, 0);

            const processedData = detectEdgePoints(ctx, width, height);
            console.log("검출된 점 개수:", processedData.points.length);
            setImageData(processedData);

            // 선 데이터로 변환
            const lines = processedData.connections.map(([fromId, toId]) => {
              const from = processedData.points.find((p) => p.id === fromId);
              const to = processedData.points.find((p) => p.id === toId);
              return {
                start: { x: from.x, y: from.y },
                end: { x: to.x, y: to.y },
              };
            });

            onImageProcessed({
              originalImage: imgUrl,
              lines: lines,
            });
            resolve();
          };

          img.onerror = (error) => {
            console.error("이미지 로드 실패:", error);
            reject(new Error("이미지 로드에 실패했습니다."));
          };
        });
      } catch (error) {
        console.error("이미지 전처리 실패:", error);
        throw error;
      } finally {
        onProcessingStateChange(false);
      }
    };

    const detectEdgePoints = (ctx, width, height, pointCount = 100) => {
      const points = [];
      const imageData = ctx.getImageData(0, 0, width, height);
      const step = Math.max(1, Math.floor((width * height) / pointCount));

      // 좌표 스케일링을 위한 비율 계산
      const scaleX = 20 / width;
      const scaleY = 20 / height;

      for (let i = 0; i < width * height; i += step) {
        const pixelX = i % width;
        const pixelY = Math.floor(i / width);
        const idx = (pixelY * width + pixelX) * 4 + 3;

        if (
          imageData.data[idx] > 0 &&
          checkEdge(imageData.data, pixelX, pixelY, width, height)
        ) {
          // -10 ~ 10 범위로 좌표 변환
          const x = (pixelX * scaleX - 10).toFixed(2) * 1;
          const y = (-pixelY * scaleY + 10).toFixed(2) * 1; // Y축 반전

          points.push({
            id: points.length + 1,
            x,
            y,
          });
          if (points.length >= pointCount) break;
        }
      }

      // 연결 정보 생성
      const connections = [];
      for (let i = 0; i < points.length - 1; i++) {
        connections.push([points[i].id, points[i + 1].id]);
      }
      // 마지막 점과 첫 점 연결
      if (points.length > 2) {
        connections.push([points[points.length - 1].id, points[0].id]);
      }

      return {
        points: points.slice(0, pointCount),
        connections,
      };
    };

    const checkEdge = (data, x, y, width, height) => {
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
          const idx = (ny * width + nx) * 4 + 3;
          if (data[idx] === 0) return true;
        }
      }
      return false;
    };

    return <canvas ref={canvasRef} style={{ display: "none" }} />;
  }
);

export default ImagePreprocessor;
