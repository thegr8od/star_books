// components/DiaryDate.jsx
import { useState } from "react";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import Header from "../../components/Header";

// 컴포넌트 사용시 이전달, 다음달 버틀 실행할 경우 동작시킬 함수(axios 요청) props로 onChangeMonth 전달
// <DiaryDate onChangeMonth={onChangeMonth} />
const DiaryDate = ({ onChangeMonth }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  // 날짜 변경 핸들러 (이전 달)
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() - 1, prev.getDate());
      // 부모 컴포넌트에서 전달받은 함수 실행 (axios 요청)
      onChangeMonth?.(newDate); 
      return newDate;
    });
  };

  // 날짜 변경 핸들러 (다음 달)
  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + 1, prev.getDate());
      // 부모 컴포넌트에서 전달받은 함수 실행 (axios 요청)
      onChangeMonth?.(newDate);
      return newDate;
    });
  };

  // 날짜 포맷 함수
  const formatDate = {
    toDisplay: (date) => `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월`,
    toAPI: (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
  };

  return (
    <Header
      className="mb-6"
      title={formatDate.toDisplay(currentDate)}
      titleClassName="text-base md:text-lg font-semibold"
      leftChild={
        <button onClick={handlePrevMonth}>
          <KeyboardArrowLeft />
        </button>
      }
      rightChild={
        <button onClick={handleNextMonth} disabled={new Date(currentDate.getFullYear(), currentDate.getMonth() + 1) > today}>
          <KeyboardArrowRight />
        </button>
      }
    />
  );
};

export default DiaryDate;
