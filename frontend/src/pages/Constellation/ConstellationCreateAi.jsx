import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConstellationCreateAiEvent from "./ConstellationCreateAiEvent";
import Button from "../../components/Button";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Anthropic } from "@anthropic-ai/sdk";
import ImagePreprocessor from "../../components/ImagePreprocessor";

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_REMOVED,
  dangerouslyAllowBrowser: true,
});

function ConstellationCreateAi({ constellationData }) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEvent, setShowEvent] = useState(false);
  const [lineData, setLineData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0); // 컴포넌트 리셋을 위한 key
  const [processedImageData, setProcessedImageData] = useState(null);
  const imagePreprocessorRef = useRef(null);

  // AI 응답 더미 데이터를 주석 처리
  // const dummyAiResponse = [
  //     // 얼굴 윤곽
  //     { start: { x: -5, y: 0 }, end: { x: -3, y: 3 } },
  //     { start: { x: -3, y: 3 }, end: { x: 3, y: 3 } },
  //     { start: { x: 3, y: 3 }, end: { x: 5, y: 0 } },
  //     { start: { x: 5, y: 0 }, end: { x: 3, y: -3 } },
  //     { start: { x: 3, y: -3 }, end: { x: -3, y: -3 } },
  //     { start: { x: -3, y: -3 }, end: { x: -5, y: 0 } },
  //
  //     // 귀
  //     { start: { x: -3, y: 3 }, end: { x: -4, y: 5 } },
  //     { start: { x: 3, y: 3 }, end: { x: 4, y: 5 } },
  //
  //     // 눈
  //     { start: { x: -2, y: 1 }, end: { x: -1, y: 1 } },
  //     { start: { x: 1, y: 1 }, end: { x: 2, y: 1 } },
  // ];

  // 상태 초기화 함수
  const resetState = () => {
    setShowEvent(false);
    setLineData(null);
    setIsLoading(false);
    setResetKey((prev) => prev + 1); // ConstellationCreateAiEvent 컴포넌트 리셋
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.substring(0, 5) === "image") {
      console.log("선택된 파일:", file.name, file.type, file.size);
      resetState();

      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          setSelectedImage(reader.result);
          try {
            console.log("이미지 전처리 시도");
            if (!imagePreprocessorRef.current) {
              console.error("imagePreprocessorRef.current가 없습니다");
              throw new Error("전처리기를 찾을 수 없습니다");
            }

            setIsLoading(true);
            const result = await imagePreprocessorRef.current.processImage(
              file
            );
            console.log("전처리 결과:", result);

            if (result && result.lines) {
              setProcessedImageData({ lines: result.lines });
              setLineData(result.lines);
              setShowEvent(true);
            } else {
              throw new Error("전처리 결과가 유효하지 않습니다");
            }
          } catch (error) {
            console.error("이미지 처리 실패:", error);
            // 전처리 실패시 AI 처리로 폴백
            handleCreateConstellation();
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("이미지 로드 실패:", error);
        alert("이미지를 불러오는데 실패했습니다.");
      }
    }
  };

  const generateLinesFromAI = async (imageData) => {
    // 이미 전처리된 데이터가 있다면 사용
    if (processedImageData && processedImageData.lines) {
      console.log("전처리된 데이터 사용");
      return processedImageData.lines;
    }

    console.log("API 호출 시작");

    // 이미지 데이터와 타입 추출
    const [header, base64Data] = imageData.split(",");
    const mediaType = header.match(/data:(.*?);/)?.[1] || "image/jpeg";

    console.log("이미지 타입:", mediaType);

    if (!base64Data) {
      throw new Error("이미지 데이터 형식이 잘못되었습니다.");
    }

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "제공된 이미지를 단순한 선들로 이루어진 픽토그램으로 변환해주세요. (-10,10) 좌표계 안에서 각 선의 시작점과 끝점 좌표를 배열로 반환해주세요. 원형 부분은 8개의 선분을 사용해서 더 부드럽게 표현해주세요. 눈,코,입은 점으로 간단하게 표현해도 됩니다. 입은 표정에 따라서 선으로 표현해도 됩니다. 사람 머리카락은 얼굴 선 옆에에 간단히 선으로 표현합니다. 설명없이 JSON 배열만 반환해주세요. '//'과 같은 주석 부분 없이  JSON 배열만 반환해주세요. 예시: [{start: {x: -5, y: 0}, end: {x: -3, y: 3}}, ...]",
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType, // 동적으로 이미지 타입 설정
                data: base64Data,
              },
            },
          ],
        },
      ],
    });

    console.log("API 응답:", message);

    try {
      // 코드 블록에서 JSON 추출
      const responseText = message.content[0].text;
      const jsonMatch = responseText.match(
        /```(?:javascript)?\s*(\[[\s\S]*?\])\s*```/
      );

      if (jsonMatch) {
        const jsonStr = jsonMatch[1];
        const parsedData = JSON.parse(jsonStr);
        console.log("파싱된 데이터:", parsedData);
        return parsedData;
      } else {
        // 전체 텍스트를 JSON으로 파싱 시도
        const parsedData = JSON.parse(responseText);
        console.log("파싱된 데이터:", parsedData);
        return parsedData;
      }
    } catch (parseError) {
      console.error("JSON 파싱 실패:", parseError);
      console.log("원본 응답 텍스트:", message.content[0].text);
      throw new Error("AI 응답을 처리하는데 실패했습니다.");
    }
  };

  const handleCreateConstellation = async () => {
    if (!selectedImage) return;
    try {
      setIsLoading(true);
      const lines = await generateLinesFromAI(selectedImage);
      setLineData(lines);
      setShowEvent(true);
    } catch (error) {
      console.error("선 데이터 생성 실패:", error);
      alert("별자리 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (visualizationData) => {
    try {
      const dataToSave = {
        img: selectedImage,
        color: constellationData.color,
        count: constellationData.count,
        lines: lineData,
        visualization: visualizationData,
      };
      await axios.post("/api/constellation", dataToSave);
      alert("저장되었습니다!");
      navigate("/constellations");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div>
      <ImagePreprocessor
        ref={imagePreprocessorRef}
        onImageProcessed={({ lines }) => {
          console.log("이미지 전처리 완료:", lines);
          if (lines && lines.length > 0) {
            setProcessedImageData({ lines });
            setLineData(lines);
            setShowEvent(true);
          } else {
            // 전처리 결과가 없으면 AI 처리로 폴백
            handleCreateConstellation();
          }
        }}
        onProcessingStateChange={(loading) => {
          setIsLoading(loading);
        }}
      />
      <div className="flex flex-col items-center space-y-4">
        {/* 상단 이미지 박스 */}
        <div className="relative w-full max-w-[200px] md:max-w-[250px] aspect-[4/3]">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="imageInput"
          />
          <label
            htmlFor="imageInput"
            className="block w-full h-full border border-white/80 rounded-3xl p-4 text-center cursor-pointer hover:border-white transition-colors bg-white/30 relative"
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="mb-5">
                  <p className="text-[11px] md:text-xs text-white/80 animate-pulse">
                    이번달,
                  </p>
                  <p className="text-[11px] md:text-xs text-white/80 animate-pulse">
                    마음에 남은 한 장면은 무엇인가요?
                  </p>
                </span>

                <AddPhotoAlternateIcon
                  className="text-white/80 mt-2 animate-pulse"
                  style={{ fontSize: "3rem" }}
                />
              </div>
            )}
          </label>
        </div>

        {/* 하단 별자리 박스 */}
        <div className="relative w-full max-w-[200px] md:max-w-[250px] aspect-[4/3] border-2 border-white/80 rounded-3xl p-4 bg-white/30">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : showEvent && lineData ? (
            <div className="h-full" key={resetKey}>
              <ConstellationCreateAiEvent
                data={{
                  img: selectedImage,
                  color: constellationData.color,
                  count: constellationData.count,
                  lines: lineData,
                }}
              />
            </div>
          ) : selectedImage ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-[10px] md:text-[12px] text-white/80 animate-pulse">
                별자리를 만들 준비가 되었습니다.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-[10px] md:text-[12px] text-white/80 animate-pulse">
                별자리가 만들어지는 공간입니다.
              </p>
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center">
          {selectedImage && !showEvent && (
            <Button
              onClick={handleCreateConstellation}
              text="별자리 만들기"
              className="px-4 py-1 text-sm md:text-base"
              type="DEFAULT"
            />
          )}
          {showEvent && lineData && (
            <Button
              onClick={handleSave}
              className="px-4 py-1 text-sm md:text-base"
              type="DEFAULT"
              text="갤러리에 저장하기"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ConstellationCreateAi;
