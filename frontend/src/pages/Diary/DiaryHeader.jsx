import Header from "../.././components/Header";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

function DiaryHeader({ currentDate, setCurrentDate }) {
  const today = new Date();
  // const dispatch = useDispatch();

  // 날짜 변경 핸들러 (이전 달)
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() - 1, prev.getDate());
      // axios 요청
      return newDate;
    });
  };

  // 날짜 변경 핸들러 (다음 달)
  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + 1, prev.getDate());
      // axios 요청
      return newDate;
    });
  };

  // 날짜 포맷 함수
  const formatDate = {
    toDisplay: (date) => `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월`,
    toAPI: (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
  };

  return (
    <>
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
    </>
  );
}

export default DiaryHeader;
