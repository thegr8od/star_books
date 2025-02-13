import { useState } from "react";
import Layout from "../../components/Layout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
];

const MonthlyDiary = () => {
  const [diaries, setDiaries] = useState(sampleData);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

    return {
      date: `${month}월 ${day}일`,
      weekday: `${weekday}요일`,
    };
  };

  // 수정
  const handleEdit = (id) => {
    console.log("Edit diary:", id);
  };

  // 삭제
  const handleDelete = (id) => {
    if (window.confirm("정말 일기를 삭제하시겠습니까?")) {
      setDiaries(diaries.filter((diary) => diary.id !== id));
    }
  };

  return (
    <Layout>
      <div className="h-full bg-white rounded-t-3xl">
        {diaries.map((diary) => {
          const { date, weekday } = formatDate(diary.date);

          return (
            <div key={diary.id} className="px-8 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: diary.color }} />
                  <div>
                    <p className="text-gray-600">{date}</p>
                    <p className="text-xs text-gray-400">{weekday}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={() => handleEdit(diary.id)} className="text-gray-400 hover:text-gray-700">
                    <EditIcon fontSize="inherit" />
                  </button>
                  <button onClick={() => handleDelete(diary.id)} className="text-gray-400 hover:text-gray-700">
                    <DeleteIcon fontSize="inherit" />
                  </button>
                </div>
              </div>

              <p className="text-sm">{diary.content}</p>

              {diary.image && (
                <div>
                  <img src={diary.image} alt="Diary img" className="h-40 object-cover rounded-lg" />
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
        })}
      </div>
    </Layout>
  );
};

export default MonthlyDiary;
