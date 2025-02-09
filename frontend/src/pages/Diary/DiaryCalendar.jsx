import { useState } from "react";
import Layout from "../../components/Layout";
import DiaryStars from "./DiaryStars";
import DiaryButton from "./DiaryButton";
import DiaryCalendarStyle from "./DiaryCalendarStyle";

function DiaryCalendar() {
  const [activeTab, setActiveTab] = useState(2);

  return (
    <Layout>
      {activeTab === 1 ? <DiaryStars /> : <DiaryCalendarStyle />}
      <DiaryButton activeTab={activeTab} setActiveTab={setActiveTab} />
    </Layout>
  );
}

export default DiaryCalendar;
