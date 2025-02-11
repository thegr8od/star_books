import { useState } from "react";
import Layout from "../../components/Layout";
import DiaryStars from "./DiaryStars";
import DiaryCalendar from "./DiaryCalendar";
import Header from "../../components/Header";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import Button from "../../components/Button";
import MoodSurvey from "./MoodSurvey";
import { Add } from "@mui/icons-material";

function Diary() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const today = new Date();

  // 날짜 변경 핸들러 (이전 달)
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(
        prev.getFullYear(),
        prev.getMonth() - 1,
        prev.getDate()
      );
      // axios 요청
      return newDate;
    });
  };

  // 날짜 변경 핸들러 (다음 달)
  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(
        prev.getFullYear(),
        prev.getMonth() + 1,
        prev.getDate()
      );
      // axios 요청
      return newDate;
    });
  };

  // 날짜 포맷 함수
  const formatDate = {
    toDisplay: (date) =>
      `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}월`,
    toAPI: (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`,
  };
  //console.log(currentDate);
  //Tue Feb 11 2025 00:00:00 

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        {/* 날짜 */}
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
            <button
              onClick={handleNextMonth}
              disabled={
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1
                ) > today
              }
            >
              <KeyboardArrowRight />
            </button>
          }
        />

        {/* 메인 */}
        <div className="flex-1">
          {" "}
          {activeTab === 1 ? (
            <DiaryStars />
          ) : (
            <DiaryCalendar currentMonth={currentDate} />
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-center items-center mt-3 space-x-8">
          <Button
            text="나의 별"
            type={`${activeTab === 1 ? "NEXT" : "PREV"}`}
            onClick={() => setActiveTab(1)}
            className="w-24 h-9 text-sm"
          />
          <Button
            text={<Add />}
            type="DEFAULT"
            className="h-10 w-10 rounded-full border border-white bg-transparent hover:bg-transparent"
            onClick={() => setShowModal(!showModal)}
          />
          <Button
            text="캘린더"
            type={`${activeTab === 2 ? "NEXT" : "PREV"}`}
            onClick={() => setActiveTab(2)}
            className="w-24 h-9 text-sm"
          />
        </div>
      </div>

      <MoodSurvey isOpen={showModal} onClose={() => setShowModal(false)} />
    </Layout>
  );
}

export default Diary;
