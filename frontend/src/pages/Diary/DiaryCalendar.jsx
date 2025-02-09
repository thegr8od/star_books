import { useState } from "react";
import Layout from "../../components/Layout";
import DiaryHeader from "./DiaryHeader";
import DiaryStars from "./DiaryStars";
import DiaryButton from "./DiaryButton";
import DiaryCalendarStyle from "./DiaryCalendarStyle";

function DiaryCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState(2);

  return (
    <Layout>
      <DiaryHeader currentDate={currentDate} setCurrentDate={setCurrentDate} />
      {activeTab === 1 ? <DiaryStars /> : <DiaryCalendarStyle currentMonth={currentDate}/>}
      <DiaryButton activeTab={activeTab} setActiveTab={setActiveTab} />
    </Layout>
  );
}

export default DiaryCalendar;
