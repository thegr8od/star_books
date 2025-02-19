import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import Button from "../../components/Button";
import GetColor from "../../components/GetColor";
import ErrorPage from "../ErrorPage";
import useDiaryApi from "../../api/useDiaryApi";
import DiaryColorGuide from "./DiaryColorGuide";

const DiaryWrite = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { diary } = location.state || {};
  const { emotions, xvalue, yvalue, diaryId, originalData } = location.state;

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // 프리뷰 이미지
  const [existingImage, setExistingImage] = useState(null); // 기존에 저장되어있는 이미지가 있을 때
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // 업로드된 이미지 URL 저장
  const [imageUploadError, setImageUploadError] = useState(""); // 이미지 업로드 에러 메시지
  const [currentEmotions, setCurrentEmotions] = useState([]);

  const fileInputRef = useRef(null);
  const isEditMode = !!id; // 데이터 있으면 true 데이터 없으면 false

  // URL로 접근해서 해당 일기에 대한 데이터가 없을 때 에러페이지로 이동
  // if (!location.state?.emotions || !location.state?.diaryId) {
  //   return (
  //     <ErrorPage
  //       title="잘못된 접근입니다."
  //       message="올바른 경로로 접근해주세요."
  //     />
  //   );
  // }

  useEffect(() => {
    if (isEditMode && location.state?.diary) {
      setText(location.state.diary.content || "");
      setCurrentEmotions(location.state.diary.hashtags || []);
      if (location.state.diary.imageUrl) {
        setExistingImage(location.state.diary.imageUrl);
        setImagePreview(location.state.diary.imageUrl);
      }
    } else {
      // 새 글 작성 모드
      setText(""); // 새 글 작성 시 텍스트 초기화
      if (!emotions) {
        navigate("/error");
        return;
      }
      setCurrentEmotions(emotions);
    }
  }, [isEditMode, location.state?.diary]); // 의존성 배열 수정

  // 감정 값 얻기
  const getCurrentEmotionValues = () => {
    if (isEditMode) {
      return {
        x: location.state.diary.DiaryEmotion?.xValue || 0,
        y: location.state.diary.DiaryEmotion?.yValue || 0,
      };
    }
    return { x: xvalue, y: yvalue };
  };

  // 일기 작성 날짜, 요일 함수 수정
  const getDayInfo = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    let dateArray;
    if (isEditMode && location.state?.diary) {
      dateArray = diary.diaryDate;
    } else if (location.state?.diaryDate) {
      dateArray = location.state.diaryDate;
    } else {
      const today = new Date();
      dateArray = [today.getFullYear(), today.getMonth() + 1, today.getDate()];
    }
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    const month = dateArray[1];
    const dayNum = dateArray[2];
    const dayName = days[date.getDay()];
    return { dayNum, dayName, month };
  };

  // 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageUploadError("");

    if (file) {
      // 파일 미리보기 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // 서버에 업로드
      useDiaryApi
        .uploadImage(file)
        .then((response) => {
          if (response.imageUrl) {
            setUploadedImageUrl(response.imageUrl);
          }
        })
        .catch((error) => {
          setImageUploadError(error.message);
          setImagePreview(null);
          setUploadedImageUrl(null);
        });
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  // 저장, 수정 버튼 클릭 시 데이터 넘기기
  const handleSave = () => {
    //  날짜
    let dateArray;
    if (isEditMode && location.state?.diary) {
      dateArray = location.state.diary.diaryDate;
    } else if (location.state?.diaryDate) {
      dateArray = location.state.diaryDate;
    } else {
      const today = new Date();
      dateArray = [today.getFullYear(), today.getMonth() + 1, today.getDate()];
    }

    const emotionValues = getCurrentEmotionValues();
    const updatedDiaryData = {
      content: text,
      hashtags: currentEmotions,
      xValue: emotionValues.x,
      yValue: emotionValues.y,
      imageUrl: uploadedImageUrl || existingImage,
      diaryDate: dateArray,
      ...(diaryId && { diaryId }),
    };

    const savePromise = isEditMode
      ? useDiaryApi.updateContent(
          location.state.diary.diaryId,
          updatedDiaryData
        )
      : useDiaryApi.addDiaryContent(diaryId, updatedDiaryData);

    savePromise
      .then(() => {
        navigate("/diary/calendar");
      })
      .catch((error) => {
        console.error("일기 저장 실패:", error);
      });
  };

  // 취소 버튼 클릭
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="h-full flex flex-col space-y-6 pt-3">
        {/* 날짜 */}
        <div className="text-white px-3 text-lg">
          <div className="flex items-baseline gap-2 border-b border-white pb-1 w-fit">
            <span>{getDayInfo().month}월</span>
            <span>{getDayInfo().dayNum}일</span>
            <span>{getDayInfo().dayName}요일</span>
          </div>
        </div>

        {/* 콘텐츠 - 흰색 카드 */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* 감정 아이콘 */}
          <div className="flex justify-center">
            <DiaryColorGuide
              color={GetColor(
                getCurrentEmotionValues().x,
                getCurrentEmotionValues().y
              )}
            >
              <span
                className="rounded-full w-8 h-8"
                style={{
                  backgroundColor: GetColor(
                    getCurrentEmotionValues().x,
                    getCurrentEmotionValues().y
                  ),
                }}
              />
            </DiaryColorGuide>
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
                  <PhotoCameraOutlinedIcon
                    className="w-8 h-8 text-white"
                    sx={{ fontSize: 50 }}
                  />
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
            {currentEmotions.map((emotion, index) => (
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
