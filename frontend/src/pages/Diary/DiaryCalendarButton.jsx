import Button from "../.././components/Button"
import { Link } from "react-router-dom"
import { useState } from "react"
import MoodSurvey from "./MoodSurvey"


function DiaryCalendarButton() {
  const [showModal, setShowModal] = useState(false);
    return (
      <>
      <div className="flex justify-center mt-10">
        <Link to="/starbooks/diary/stars">
          <Button text="나의 별" type="PREV" className="px-8 py-2 rounded-full text-sm" />
        </Link>
        <Button 
        imgSrc="../../../icons/plus2.png" 
        type="PREV" 
        className="px-1 py-1 mx-10 rounded-full " 
        onClick={() => setShowModal(!showModal)}
        />
        <Button text=" 캘린더" type="NEXT" className="px-8 py-2rounded-full text-sm" />
      </div>
      
      <MoodSurvey 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      </>
    );
  }
  
export default DiaryCalendarButton