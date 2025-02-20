import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import Header from "../../components/Header";

const DiaryDate = ({ currentDate, setCurrentDate }) => {
  const today = new Date();

  // 날짜 변경 핸들러 (이전 달)
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    setCurrentDate(newDate);
  };

  // 날짜 변경 핸들러 (다음 달)
  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    setCurrentDate(newDate);
  };

  // 날짜 포맷 함수
  const formatDate = {
    toDiary: (date) => `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월`,
    toAPI: (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
  };

  return (
    <Header
      className="mb-4"
      title={formatDate.toDiary(currentDate)}
      titleClassName="text-lg font-semibold"
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
