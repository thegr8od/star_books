import { useState } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import MoodSurvey from "./MoodSurvey";
import DiaryDate from "./DiaryDate";
import diaryApi from "../../api/useDiaryApi";

function Diary() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState([]);

  const navigate = useNavigate();

  const isStarsMatch = useMatch({ path: "/diary/stars", end: true });
  const isCalendarMatch = useMatch({ path: "/diary/calendar", end: true });
  const currentTab = isStarsMatch ? "stars" : isCalendarMatch ? "calendar" : "";
  const [modalData, setModalData] = useState(null);
  const [clickDay, setClickDay] = useState(null); // 클릭한 날짜를 DiaryCalendar(하위)에서 상태 넘겨줌
  const handleSetShowModal = (show, data) => {
    setShowModal(show);
    setModalData(data);
  };

  // 날짜 비교 함수
  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  // 다이어리 날짜 함수
  const handleCreateDiary = async (selectedDate) => {
    if (!selectedDate) {
      alert("날짜를 선택해주세요");
      return;
    }

    // console.log("API 요청 전 날짜:", selectedDate); // API 요청 전 데이터 확인

    try {
      const result = await diaryApi.createEmptyDiary({
        diaryDate: selectedDate,
      });
      // console.log("API 응답:", result); // API 응답 확인

      if (result) {
        setShowModal(true);
        return result;
      }
    } catch (error) {
      console.error("에러 상세 정보:", error.response); // 에러 상세 정보 확인
      alert("일기 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* 날짜 */}
        <DiaryDate currentDate={currentDate} setCurrentDate={setCurrentDate} />

        {/* 메인 */}
        <main className="flex-1">
          <Outlet
            context={{
              currentDate,
              clickDay,
              setClickDay,
              handleCreateDiary,
              diaryEntries,
              setDiaryEntries,
            }}
          />
        </main>

        {/* 버튼 */}
        <div className="flex justify-between items-center mt-3 px-2 w-full">
          <Button
            text="나의 별"
            type={`${currentTab === "stars" ? "NEXT" : "PREV"}`}
            onClick={() => navigate("/diary/stars")}
            className="w-[30%] h-9 text-sm"
          />

          {currentTab === "stars" ? (
            <Button
              text="3D"
              type="DEFAULT"
              className="h-9 w-[15%] min-w-[40px] rounded-full border border-white bg-transparent hover:bg-white/10 transition-colors duration-200 text-sm"
              onClick={() =>
                navigate(`/constellation/detail/${currentDate.getFullYear()}`)
              }
            />
          ) : (
            <Button
              text={<Add />}
              type="DEFAULT"
              disabled={diaryEntries.some(
                (entry) => entry.date && isSameDay(entry.date, clickDay)
              )}
              className={`h-9 w-[15%] min-w-[40px] rounded-full border border-white 
                ${
                  diaryEntries.some(
                    (entry) => entry.date && isSameDay(entry.date, clickDay)
                  )
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-transparent hover:bg-white/10"
                } 
                transition-colors duration-200`}
              onClick={async () => {
                if (!clickDay) {
                  alert("날짜를 선택해주세요");
                  return;
                }
                const result = await handleCreateDiary(clickDay);
                if (result) handleSetShowModal(true, result);
              }}
            />
          )}

          <Button
            text="캘린더"
            type={`${currentTab === "calendar" ? "NEXT" : "PREV"}`}
            onClick={() => navigate("/diary/calendar")}
            className="w-[30%] h-9 text-sm"
          />
        </div>
      </div>

      {/* 모달 */}
      <MoodSurvey
        isOpen={showModal}
        onClose={() => handleSetShowModal(false, null)}
        data={modalData}
      />
    </Layout>
  );
}

export default Diary;
