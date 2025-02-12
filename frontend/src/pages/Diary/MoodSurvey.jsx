import { useState } from "react";
import MoodSurveyButton from "./MoodSurveyButton";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import MoodSurveyToast from "./MoodSurveyToast";

const MoodSurvey = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const moods = ["매우 좋음", "좋음", "보통", "좋지 않음", "매우 좋지 않음"];
  const emotions = {
    긍정: [
      "행복한",
      "기쁜",
      "만족스러운",
      "신나는",
      "감동적인",
      "설레는",
      "평온한",
      "차분한",
      "편안한",
      "후련한",
    ],
    부정: [
      "불안한",
      "초조한",
      "화나는",
      "짜증나는",
      "답답한",
      "속상한",
      "슬픈",
      "우울한",
      "지친",
      "무기력한",
    ],
    중립: [
      "그저 그런",
      "담담한",
      "멍한",
      "고민되는 ",
      "조용한",
      "느긋한",
      "궁금한",
      "심심한",
      "무심한",
      "졸린",
    ],
  };

  // step1에서 선택된 기분에 따라 감정 순서 결정
  const getOrderedCategories = () => {
    if (selectedMood === 0 || selectedMood === 1) {
      return ["긍정", "중립", "부정"];
    } else if (selectedMood === 2) {
      return ["중립", "긍정", "부정"];
    } else if (selectedMood === 3 || selectedMood === 4) {
      return ["부정", "중립", "긍정"];
    }
    return ["긍정", "중립", "부정"];
  };

  // 다음 버튼 클릭
  const handleNext = () => {
    setStep(2);
  };

  // 이전 버튼 클릭
  const handleBack = () => {
    setStep(1);
  };

  // 감정 클릭했을 때 처리하는 함수
  const handleEmotionClick = (emotion) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((item) => item !== emotion));
    } else if (selectedEmotions.length <= 4) {
      setSelectedEmotions([...selectedEmotions, emotion]);
    } else {
      setShowToast(true);
    }
  };

  // 모달 닫힐 때 상태 초기화
  const handleClose = () => {
    setStep(1);
    setSelectedMood(null);
    setSelectedEmotions([]);
    onClose();
  };
  const text = (
    <>
      더 자세히 알려주세요
      <br />
      <span className="font-medium text-gray-700 text-[18px]">(최대 5개)</span>
    </>
  );
  const modalTitle = step === 1 ? "기분을 선택해주세요" : text;

  // step2 완료 버튼 클릭 시 다이어리 작성 페이지로 이동
  const handleComplete = () => {
    handleClose();
    navigate("../diary/write", {
      state: {
        emotions: selectedEmotions,
      },
    });
  };

  return (
    <>
      <MoodSurveyToast
        message={"감정은 5개까지만 선택 가능해요!"}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>
        {/* 오늘의 기분 설문 */}
        {step === 1 && (
          <div className="flex flex-col items-center h-[400px] w-[320px]">
            <div className="flex justify-center mb-8">
              <div className="flex flex-col gap-10 rounded-full bg-gray-200 p-3 border">
                {moods.map((mood, index) => (
                  <MoodSurveyButton
                    key={index}
                    label={mood}
                    selected={selectedMood === index}
                    onClick={() => setSelectedMood(index)}
                  />
                ))}
              </div>
            </div>

            <Button
              text="다음"
              type="NEXT"
              onClick={handleNext}
              disabled={selectedMood === null}
              className="px-8 py-2 mt-4 w-28"
            />
          </div>
        )}

        {/* 세부 감정 설문 */}
        {step === 2 && (
          <div className="flex flex-col h-[400px] w-[320px]">
            <div className="flex-1 overflow-y-auto pr-2">
              {/* 감정 카테고리와 버튼들 */}
              {getOrderedCategories().map((category) => (
                <div key={category} className="mb-8">
                  <h3 className="text-[16px] font-medium mb-4 ml-2 text-gray-500">
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {emotions[category].map((emotion) => (
                      <button
                        key={emotion}
                        onClick={() => handleEmotionClick(emotion)}
                        className={`p-3 rounded-full text-center transition-colors text-sm
                        ${
                          selectedEmotions.includes(emotion)
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 버튼 */}
            <div className="flex gap-6 mt-4 justify-center">
              <Button
                text="이전"
                type="PREV"
                onClick={handleBack}
                className="px-8 py-2 w-28"
              />
              <Button
                text="완료"
                type="DEFAULT"
                disabled={selectedEmotions.length === 0}
                className="px-8 py-2 w-28"
                onClick={handleComplete}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MoodSurvey;
