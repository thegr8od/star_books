import { useState } from "react";
import RadioButton from "./MoodSurveyButton";
import Modal from "../../components/Modal";

const MoodSurvey = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  // const [index, setIndex] = useState(0);

  const moods = ["매우 좋음", "좋음", "보통", "좋지 않음", "매우 좋지 않음"];
  const emotions = {
    긍정: ["신나는", "즐거운", "의욕적인", "평온한", "감사한", "기대되는"],
    부정: ["화나는", "두려운", "짜증나는", "긴장되는", "불안한", "답답한"],
    중립: ["그저 그런", "그리운", "심심한", "무기력한", "지루한", "고민되는"],
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
      // 이미 선택된 감정이면 감정 배열에서 제거
      setSelectedEmotions(selectedEmotions.filter((item) => item !== emotion));
    } else {
      // 4개일 때 까지만 감정을 선택할 수 있도록 함
      if (selectedEmotions.length <= 4) {
        setSelectedEmotions([...selectedEmotions, emotion]);
      }
    }
  };

  // 모달 닫힐 때 상태 초기화
  const handleClose = () => {
    setStep(1);
    setSelectedMood(null);
    setSelectedEmotions([]);
    onClose();
  };

  const modalTitle =
    step === 1 ? "기분을 선택해주세요" : "더 자세히 알려주세요(최대 5개)";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>
      {/* 오늘의 기분 설문 */}
      {step === 1 && (
        <div className="flex flex-col items-center min-h-[400px]">
          <div className="flex justify-center mb-8">
            <div className="flex flex-col gap-10 rounded-full bg-gray-200 p-3 border">
              {moods.map((mood, index) => (
                <RadioButton
                  key={index}
                  label={mood}
                  selected={selectedMood === index}
                  onClick={() => setSelectedMood(index)}
                />
              ))}
            </div>
          </div>

          <button
            className="rounded-2xl bg-indigo-400 px-8 py-2 text-white mt-4 w-28 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-300"
            onClick={handleNext}
            disabled={selectedMood === null}
          >
            다음
          </button>
        </div>
      )}

      {/* 세부 감정 질문 */}
      {step === 2 && (
        <div className="flex flex-col items-center min-h-[500px] min-w-[320px]">
          <div className="grid grid-cols-2 gap-4 mb-[30px]">
            {emotions.긍정.map((emotion) => (
              <button
                key={emotion}
                onClick={() => handleEmotionClick(emotion)}
                className={`p-4 rounded-full text-center transition-colors
                    ${
                      selectedEmotions.includes(emotion)
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
              >
                {emotion}
              </button>
            ))}
          </div>

          {/* 어떤 감정이 선택되었는지 */}
          <div className="w-full p-4 bg-gray-100 rounded-md mb-[30px]">
            {selectedEmotions.length === 0 ? (
              <p className="text-gray-500 text-center">
                선택된 감정이 없습니다
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedEmotions.map((emotion) => (
                  <span
                    key={emotion}
                    className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-full"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              className="rounded-2xl bg-gray-300 px-8 py-2 text-white hover:bg-gray-400"
              onClick={handleBack}
            >
              이전
            </button>
            <button
              className="rounded-2xl bg-indigo-300 px-8 py-2 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-300"
              disabled={selectedEmotions.length === 0}
            >
              완료
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MoodSurvey;
