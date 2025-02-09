import Button from "../../components/Button";
import { useState } from "react";
import MoodSurvey from "./MoodSurvey";
import { Add } from "@mui/icons-material";

function DiaryButton({ activeTab, setActiveTab }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex justify-center items-center mt-3 space-x-8">
        <Button text="나의 별" type={`${activeTab === 1 ? "NEXT" : "PREV"}`} onClick={() => setActiveTab(1)} className="w-24 h-9 text-sm" />
        <Button text={<Add />} type="DEFAULT" className="h-10 w-10 rounded-full border border-white bg-transparent hover:bg-transparent" onClick={() => setShowModal(!showModal)} />
        <Button text="캘린더" type={`${activeTab === 2 ? "NEXT" : "PREV"}`} onClick={() => setActiveTab(2)} className="w-24 h-9 text-sm" />
      </div>

      <MoodSurvey isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

export default DiaryButton;
