import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { Camera } from "lucide-react";
import Button from "../../components/Button";
import GetColor from "../../components/GetColor";
import ErrorPage from "../ErrorPage";

const DiaryWrite = () => {
  const location = useLocation();
  const { emotions } = location.state;
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { diaryData } = location.state || {}; // 일기 목록에서 데이터 넘겨줌
  const isEditMode = !!diaryData; // 데이터 있으면 true 데이터 없으면 false
  const [imagePreview, setImagePreview] = useState(null); // 프리뷰 이미지
  const [existingImage, setExistingImage] = useState(null); // 기존에 저장되어있는 이미지가 있을 때
  const [content, setContent] = useState(""); // 일기 내용

  // URL로 접근해서 해당 일기에 대한 데이터가 없을 때 에러페이지로 이동
  if (!location.state?.emotion) {
    return (
      <ErrorPage
        title="잘못된 접근입니다."
        message="올바른 경로로 접근해주세요."
        customStyle="text-l"
      />
    );
  }

  // 일기 작성 날짜, 요일
  const getDayInfo = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토", "일"];
    const date = isEditMode ? new Date(diaryData.created_at) : new Date();
    const month = date.getMonth() + 1;
    const dayNum = date.getDate();
    const dayName = days[date.getDay()];
    return { dayNum, dayName, month };
  };

  const { dayNum, dayName, month } = getDayInfo();

  // 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  // 저장, 수정 버튼 클릭 시 데이터 넘기기
  const handleSave = () => {
    const updatedDiaryData = {
      content,
      image: imagePreview || existingImage,
      created_at: isEditMode ? diaryData.created_at : new Date().toISOString(),
      // 수정모드일 때 기존 id 유지
      ...(isEditMode && { id: diaryData.id }),
    };
    navigate("/diary/calendar");
  };

  // 취소 버튼 클릭
  const handleCancel = () => {
    navigate(-1);
  };

  // 수정 모드 -> 기존 데이터 로드
  useEffect(() => {
    if (isEditMode && diaryData) {
      setContent(diaryData.content || "");
      // 이미지 있을 때
      if (diaryData.image) {
        setExistingImage(diaryData.image);
        setImagePreview(diaryData.image);
      }
    }
  }, [isEditMode, diaryData]);

  return (
    <Layout>
      <div className="h-full flex flex-col space-y-6 pt-3">
        {/* 날짜 */}
        <div className="text-white px-3 text-lg">
          <div className="flex items-baseline gap-2 border-b border-white pb-1 w-fit">
            <span>{month}월</span>
            <span>{dayNum}일</span>
            <span>{dayName}요일</span>
          </div>
        </div>

        {/* 콘텐츠 - 흰색 카드 */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* 감정 아이콘 */}
          <div className="flex justify-center">
            <span
              className="rounded-full w-6 h-6"
              {...GetColor((x = 1), (y = 2))}
            />
          </div>

          {/* 텍스트 입력 칸*/}
          <div className="flex flex-col relative">
            <textarea
              className="w-full h-[150px] resize-none border-none focus:outline-none text-gray-800 placeholder-gray-400"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="이곳을 클릭하여 오늘의 이야기를 적어보세요."
            />
          </div>

          {/* 이미지 업로드 */}
          <div className="rounded-lg relative">
            <div
              className="w-full h-[280px] bg-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
              onClick={handleCameraClick}
            >
              {imagePreview || existingImage ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="max-h-full max-w-full object-contain rounded-lg p-2"
                />
              ) : (
                <div className="flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* 해시태그 */}
          <div className="flex flex-wrap gap-3 px-2">
            {emotions.map((emotion, index) => (
              <span key={index} className="text-gray-500">
                #{emotion}
              </span>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-10 pt-1">
          <div className="w-[120px]">
            <Button
              text="취소"
              type="PREV"
              className="w-full py-2"
              onClick={handleCancel}
            />
          </div>
          <div className="w-[120px]">
            <Button
              text={isEditMode ? "수정" : "게시"}
              type="NEXT"
              className="w-full py-2"
              onClick={handleSave}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiaryWrite;
