import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConstellationCreateAiEvent from "./ConstellationCreateAiEvent";
import Button from "../../components/Button";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import LoadingSpinner from "../../components/LoadingSpinner";
import useGalleryApi from "../../api/useGalleryApi";

function ConstellationCreateAi({ constellationData, onClose }) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 미리보기
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

  // 별자리 생성 요청
  const handleCreateConstellation = async () => {
    if (!selectedImage) return;

    const fileInput = document.getElementById("imageInput");
    if (!fileInput.files[0]) {
      alert("이미지를 선택해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/");
        return;
      }

      // 이미지로 별자리 생성
      const response = await useGalleryApi.generateConstellation(
        fileInput.files[0]
      );

      if (response && response.data) {
        setLineData(response.data);
        setShowEvent(true);
      } else {
        throw new Error("별자리 데이터를 받아오지 못했습니다.");
      }
    } catch (error) {
      console.error("별자리 생성 실패:", error);
      if (error.message.includes("로그인")) {
        alert(error.message);
        navigate("/");
      } else {
        alert(error.message || "별자리 생성에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 별자리 저장 핸들러
  const handleSave = async () => {
    if (!lineData) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/");
        return;
      }

      // 생성된 별자리 데이터 업로드
      const response = await useGalleryApi.uploadUserConstellation(lineData);

      if (response && response.status === "SUCCESS") {
        alert("별자리가 저장되었습니다!");
        onClose(); // 모달 닫기
      } else {
        throw new Error(response?.message || "별자리 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("별자리 저장 실패:", error);
      if (error.message.includes("로그인")) {
        alert(error.message);
        navigate("/");
      } else {
        alert(error.message || "별자리 저장에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />} {/* 로딩 컴포넌트 추가 */}
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
              <img
                src={selectedImage}
                alt="Selected"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-[11px] md:text-xs text-white/80 animate-pulse">
                  이번달,
                </p>
                <p className="text-[11px] md:text-xs text-white/80 animate-pulse">
                  마음에 남은 한 장면은?
                </p>
                <AddPhotoAlternateIcon
                  className="text-white/80 mt-2 animate-pulse"
                  style={{ fontSize: "3rem" }}
                />
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
              text="갤러리에 저장하기"
              className="px-4 py-1 text-sm md:text-base"
              type="DEFAULT"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ConstellationCreateAi;
