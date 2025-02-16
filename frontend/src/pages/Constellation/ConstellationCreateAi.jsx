import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConstellationCreateAiEvent from "./ConstellationCreateAiEvent";
import Button from "../../components/Button";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

function ConstellationCreateAi({ constellationData, onSave }) {
  const navigate = useNavigate();
  // 상태 관리
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지
  const [showEvent, setShowEvent] = useState(false); // 별자리 표시 여부
  const [lineData, setLineData] = useState(null); // AI가 생성한 선 데이터
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [resetKey, setResetKey] = useState(0); // 컴포넌트 리셋용 키

  // 상태 초기화 함수
  const resetState = () => {
    setShowEvent(false);
    setLineData(null);
    setIsLoading(false);
    setResetKey((prev) => prev + 1);
  };

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      console.log("선택된 파일:", file.name, file.type, file.size);
      resetState();
      setSelectedImage(URL.createObjectURL(file)); // 이미지 미리보기
    }
  };

  // AI를 통한 선 데이터 생성 함수
  const generateLinesFromAI = async (imageData) => {
    console.log("API 호출 시작");

    try {
      // 이미지를 PNG로 변환하는 함수
      const convertToPng = async (imgData) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "white"; // 배경을 흰색으로 설정
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            // base64 문자열에서 실제 데이터 부분만 추출
            const pngBase64 = canvas
              .toDataURL("image/png")
              .replace(/^data:image\/png;base64,/, "");
            resolve(pngBase64);
          };
          img.onerror = reject;
          img.src = imgData;
        });
      };

      // 이미지를 PNG로 변환
      const pngBase64 = await convertToPng(imageData);

      // Claude API 호출
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
                text: "제공된 이미지를 단순한 선들로 이루어진 픽토그램으로 변환해주세요. (0,0)이 왼쪽 상단이고 (100,100)이 오른쪽 하단인 좌표계 안에서 각 선의 시작점과 끝점 좌표를 배열로 반환해주세요. x는 왼쪽에서 오른쪽으로 갈수록 커지고, y는 위에서 아래로 갈수록 커집니다. 원형 부분은 8개의 선분을 사용해서 더 부드럽게 표현해주세요. 눈,코,입은 점으로 간단하게 표현해도 됩니다. 입은 표정에 따라서 선으로 표현해도 됩니다. 사람 머리카락은 얼굴 선 옆에에 간단히 선으로 표현합니다. 설명없이 JSON 배열만 반환해주세요. '//'과 같은 주석 부분 없이 JSON 배열만 반환해주세요. 예시: [{start: {x: 30, y: 20}, end: {x: 50, y: 40}}, ...]",
              },
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/png",
                  data: pngBase64,
                },
              },
            ],
          },
        ],
      });

      return parseAIResponse(message);
    } catch (error) {
      console.error("API 호출 실패:", error);
      throw error;
    }
  };

  // AI 응답 파싱 함수 분리
  const parseAIResponse = (message) => {
    try {
      const responseText = message.content[0].text;
      // 코드 블록에서 JSON 추출 시도
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

  // 별자리 생성 핸들러
  const handleCreateConstellation = async () => {
    if (!selectedImage) return;

    const fileInput = document.getElementById("imageInput");
    if (!fileInput.files[0]) {
        console.error("❌ 파일이 선택되지 않았습니다.");
        return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    // 🔹 백엔드의 실제 서버 주소로 변경
    const BACKEND_URL = "http://localhost:9090/api/constellation/generate-lines";

    console.log("📤 [프론트엔드] 백엔드로 이미지 업로드 요청 전송...", BACKEND_URL);

    try {
        const response = await axios.post(BACKEND_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ [프론트엔드] 응답 수신 완료:", response.data);

        if (Array.isArray(response.data)) {
            setLineData(response.data);
        } else if (response.data.lines) {
            setLineData(response.data.lines);
        } else {
            console.error("❌ 응답 데이터 형식 오류:", response.data);
            alert("별자리 데이터를 불러오는데 실패했습니다.");
        }

        setShowEvent(true);
    } catch (error) {
        console.error("❌ 별자리 생성 요청 실패:", error);
        alert("별자리 생성에 실패했습니다.");
    } finally {
        setIsLoading(false);
    }
};


  // 별자리 저장 핸들러
  const handleSave = async () => {
    try {
      // lines 데이터를 stars와 connections 형식으로 변환
      const starsSet = new Set();
      const connectionsArray = [];
      let starIdCounter = 1;
      const starIdMap = new Map(); // 좌표를 starId로 매핑하기 위한 맵

      // 모든 고유한 점(별)을 수집하고 ID 할당
      lineData.forEach((line) => {
        const startKey = `${line.start.x},${line.start.y}`;
        const endKey = `${line.end.x},${line.end.y}`;

        if (!starIdMap.has(startKey)) {
          starIdMap.set(startKey, starIdCounter++);
          starsSet.add({
            id: starIdMap.get(startKey),
            x: line.start.x,
            y: line.start.y,
            color: constellationData.color[0], // 첫 번째 색상 사용
          });
        }

        if (!starIdMap.has(endKey)) {
          starIdMap.set(endKey, starIdCounter++);
          starsSet.add({
            id: starIdMap.get(endKey),
            x: line.end.x,
            y: line.end.y,
            color: constellationData.color[0], // 첫 번째 색상 사용
          });
        }

        // 연결 정보 추가
        connectionsArray.push({
          start: starIdMap.get(startKey),
          end: starIdMap.get(endKey),
        });
      });

      const transformedData = {
        stars: Array.from(starsSet),
        connections: connectionsArray,
      };

      // 부모 컴포넌트로 변환된 데이터 전달
      if (onSave) {
        onSave(transformedData);
      } else {
        // 기존 저장 로직
        const dataToSave = {
          img: selectedImage,
          ...transformedData,
        };

        await axios.post("/api/constellation", dataToSave);
        alert("저장되었습니다!");
        navigate("/constellations");
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center space-y-4">
        {/* 이미지 업로드 영역 */}
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
              <img src={selectedImage} alt="Selected" className="h-full w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-[11px] md:text-xs text-white/80 animate-pulse">이번달,</p>
                <p className="text-[11px] md:text-xs text-white/80 animate-pulse">마음에 남은 한 장면은?</p>
                <AddPhotoAlternateIcon className="text-white/80 mt-2 animate-pulse" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </label>
        </div>

        {/* 별자리 표시 영역 */}
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
            <Button onClick={handleCreateConstellation} text="별자리 만들기" className="px-4 py-1 text-sm md:text-base" type="DEFAULT" />
          )}
          {showEvent && lineData && (
            <Button onClick={handleSave} className="px-4 py-1 text-sm md:text-base" type="DEFAULT" text="갤러리에 저장하기" />
          )}
        </div>
      </div>
    </div>
  );
}

export default ConstellationCreateAi;
