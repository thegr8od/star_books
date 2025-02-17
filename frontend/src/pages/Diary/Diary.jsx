import { useState } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import MoodSurvey from "./MoodSurvey";
import DiaryDate from "./DiaryDate";
import diaryApi from "../../api/useDiaryApi"; // 수정된 부분
import useAxiosInstance from "../../api/useAxiosInstance"; // 수정된 부분

function Diary() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const isStarsMatch = useMatch({ path: "/diary/stars", end: true });
  const isCalendarMatch = useMatch({ path: "/diary/calendar", end: true });
  const currentTab = isStarsMatch ? "stars" : isCalendarMatch ? "calendar" : "";
  const [modalData, setModalData] = useState(null);
  const handleSetShowModal = (show, data) => {
    setShowModal(show);
    setModalData(data);
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* 날짜 */}
        <DiaryDate currentDate={currentDate} setCurrentDate={setCurrentDate} />

        {/* 메인 */}
        <main className="flex-1">
          <Outlet context={{ currentDate }} />
        </main>

        {/* 버튼 */}
        <div className="flex justify-center items-center mt-3 space-x-8">
          <Button
            text="나의 별"
            type={`${currentTab === "stars" ? "NEXT" : "PREV"}`}
            onClick={() => navigate("/diary/stars")}
            className="w-24 h-9 text-sm"
          />

          {currentTab === "stars" ? (
            <Button
              text="3D"
              type="DEFAULT"
              className="h-10 w-10 rounded-full border border-white bg-transparent hover:bg-transparent"
              onClick={() =>
                navigate(
                  `/constellation/detail/${currentDate.getFullYear() - 1}` //현재-1
                )
              }
            />
          ) : (
            <Button
              text={<Add />}
              type="DEFAULT"
              className="h-10 w-10 rounded-full border border-white bg-transparent hover:bg-transparent"
              onClick={async () => {
                // try {
                const result = await diaryApi.createEmptyDiary(); // 수정된 부분
                // console.log(result);
                handleSetShowModal(true, result);

                //   if (result && result !== 401 && result !== 400) {
                //     console.log("성공");
                //     console.log();
                //
                //   } else {
                //     console.error("Failed to create diary:", result);
                //   }
                // } catch (error) {
                //   console.error("Error creating diary:", error);
                // }
              }}
            />
          )}

          <Button
            text="캘린더"
            type={`${currentTab === "calendar" ? "NEXT" : "PREV"}`}
            onClick={() => navigate("/diary/calendar")}
            className="w-24 h-9 text-sm"
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
