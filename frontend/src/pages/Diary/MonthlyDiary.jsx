import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import Layout from "../../components/Layout";
import DiaryDate from "./DiaryDate";

const sampleData = [
  {
    id: 1,
    date: "2025-01-01",
    color: "#4169E1",
    content: "오늘은 뭔든 하트뿅뿅다. 하자면 주만 시작물화 보고 머튿다브니 분이 생겼다.",
    hashtags: ["즐적인", "감사한", "외로운", "행만한"],
    image: null,
  },
  {
    id: 2,
    date: "2025-01-03",
    color: "#FFD700",
    content: "재밌던 하루!!! 최애 콘서트를 다녀왔다!! ♥️♥️",
    hashtags: ["즐거운", "행복한", "재밌는", "차근한"],
    image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fCVFQSVCMyVBMCVFQyU5NiU5MSVFQyU5RCVCNHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 3,
    date: "2025-01-05",
    color: "#9370DB",
    content: "우울하다~~~~",
    hashtags: ["울적한", "슬픈", "외로운", "불안한", "울적한", "슬픈", "외로운", "불안한"],
    image: null,
  },
  {
    id: 4,
    date: "2025-01-07",
    color: "#FFD700",
    content: "재밌던 하루!!! 최애 콘서트를 다녀왔다!! ♥️♥️",
    hashtags: ["즐거운", "행복한", "재밌는", "차근한"],
    image: null,
  },
  {
    id: 5,
    date: "2025-01-11",
    color: "#FFD700",
    content: "재밌던 하루!!! 최애 콘서트를 다녀왔다!! ♥️♥️",
    hashtags: ["즐거운", "행복한", "재밌는", "차근한"],
    image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fCVFQSVCMyVBMCVFQyU5NiU5MSVFQyU5RCVCNHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 6,
    date: "2025-01-26",
    color: "#9370DB",
    content: "우울하다~~~~",
    hashtags: ["울적한", "슬픈", "외로운", "불안한", "울적한", "슬픈", "외로운", "불안한"],
    image: null,
  },
];

const MonthlyDiary = () => {
  const location = useLocation();
  const [diaries, setDiaries] = useState(sampleData);
  const selectedDate = location.state?.selectedDate;
  const diaryRefs = useRef({});

  useEffect(() => {
    console.log(selectedDate);
    if (selectedDate && diaryRefs.current[selectedDate]) {
      diaryRefs.current[selectedDate].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedDate]);

  // 수정 버튼 클릭 시
  const handleEdit = (id) => {
    console.log("Edit diary:", id);
  };

  // 삭제 버튼 클릭 시
  const handleDelete = (id) => {
    if (window.confirm("일기를 삭제하시겠습니까?")) {
      setDiaries(diaries.filter((diary) => diary.id !== id));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        {/* <DiaryDate /> */}
        <div className="flex-1 flex-col space-y-4 overflow-y-auto bg-neutral-100 rounded-3xl p-4" style={{ scrollbarWidth: "none" }}>
          {diaries?.length ? (
            diaries.map((diary, index) => {
              const diaryDate = new Date(diary.date);
              return (
                <div key={diary.id} ref={(el) => (diaryRefs.current[diary.date] = el)} className={`space-y-3 px-5 py-3 bg-white rounded-xl shadow-sm ${selectedDate === diary.date ? "animate-[pulse_1s_ease-in-out_1]" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: diary.color }} />
                      <div>
                        <p className="text-gray-600">{diaryDate.toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}</p>
                        <p className="text-xs text-gray-400">{diaryDate.toLocaleDateString("ko-KR", { weekday: "long" })}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button onClick={() => handleEdit(diary.id)} className="text-gray-400 hover:text-gray-700">
                        <Edit fontSize="inherit" />
                      </button>
                      <button onClick={() => handleDelete(diary.id)} className="text-gray-400 hover:text-gray-700">
                        <Delete fontSize="inherit" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm">{diary.content}</p>

                  {diary.image && (
                    <div>
                      <img src={diary.image} alt="Diary img" className="object-cover rounded-lg" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {diary.hashtags.map((tag, index) => (
                      <span key={index} className="text-xs text-gray-400">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <hr className="border-gray-200" />
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>해당 월에 작성한 일기가 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MonthlyDiary;
