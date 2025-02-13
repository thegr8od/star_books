import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import Layout from "../../components/Layout";
import DiaryStars from "./DiaryStars";
import DiaryCalendar from "./DiaryCalendar";
import Button from "../../components/Button";
import MoodSurvey from "./MoodSurvey";
import DiaryDate from "./DiaryDate";

function Diary() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(2);
  const [showModal, setShowModal] = useState(false);

  // 에러 방지를 위한 임시 데이터
  const currentDate = new Date();

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        <DiaryDate />

        {/* 메인 */}
        <div className="flex-1">{activeTab === 1 ? <DiaryStars /> : <DiaryCalendar currentMonth={currentDate} />}</div>

        {/* 버튼 */}
        <div className="flex justify-center items-center mt-3 space-x-8">
          <Button text="나의 별" type={`${activeTab === 1 ? "NEXT" : "PREV"}`} onClick={() => setActiveTab(1)} className="w-24 h-9 text-sm" />
          {activeTab === 1 ? (
            <Button text="3D" type="DEFAULT" className="h-10 w-10 rounded-full border border-white bg-transparent hover:bg-transparent" onClick={() => navigate("/universe")} />
          ) : (
            <Button text={<Add />} type="DEFAULT" className="h-10 w-10 rounded-full border border-white bg-transparent hover:bg-transparent" onClick={() => setShowModal(true)} />
          )}
          <Button text="캘린더" type={`${activeTab === 2 ? "NEXT" : "PREV"}`} onClick={() => setActiveTab(2)} className="w-24 h-9 text-sm" />
        </div>
      </div>

      <MoodSurvey isOpen={showModal} onClose={() => setShowModal(false)} />
    </Layout>
  );
}

export default Diary;
