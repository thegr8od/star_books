import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import Layout from "../../components/Layout";
import DiaryDate from "./DiaryDate";
import useDiaryApi from "../../api/useDiaryApi";
import GetColor from "../../components/GetColor";

const MonthlyDiary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const diaryRefs = useRef({});

  const [diaries, setDiaries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const selectedDate = location.state?.selectedDate;

  // axios (mount 될 때, currentDate가 변경될 때마다 실행)
  useEffect(() => {
    (async () => {
      const requestData = { targetYear: currentDate.getFullYear(), targeMonth: currentDate.getMonth() + 1 };
      const response = await useDiaryApi.getDiariesByMonth(requestData);
      console.log(response);
      if (response.status === 200) {
        console.log("일기 조회 성공");
        setDiaries(response.data);
      } else {
        console.log("일기 조회 실패");
      }
    })();
  }, [currentDate]);

  // 선택된 날짜가 있을 경우 스크롤 (mount 될 때)
  useEffect(() => {
    if (selectedDate && diaryRefs.current[selectedDate]) {
      diaryRefs.current[selectedDate].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  // 수정 버튼 클릭 시
  const handleEdit = (diary) => {
    navigate(`/diary/edit/${diary.diaryId}`, {
      state: {
        diary,
      },
    });
  };

  // 삭제 버튼 클릭 시
  const handleDelete = async (diary) => {
    console.log(diary.diaryId);
    if (window.confirm("일기를 삭제하시겠습니까?")) {
      const response = await useDiaryApi.deleteDiary(diary.diaryId);
      console.log(response);
      if (response.status === 204) {
        console.log("일기 삭제 성공");
        setDiaries(diaries.filter((d) => d.diaryId !== diary.diaryId));
      } else {
        console.log("일기 삭제 실패");
        alert("일기 삭제에 실패하였습니다.");
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <DiaryDate currentDate={currentDate} setCurrentDate={setCurrentDate} />
        <div className="flex-1 flex-col space-y-4 overflow-y-auto bg-neutral-100 rounded-3xl p-4" style={{ scrollbarWidth: "none" }}>
          {diaries?.length ? (
            diaries.map((diary, index) => {
              const diaryDate = new Date(diary.createdAt);
              return (
                <div key={diary.diaryId} ref={(el) => (diaryRefs.current[diary.createdAt.split("T")[0]] = el)} className={`space-y-3 px-5 py-3 bg-white rounded-xl shadow-sm ${selectedDate === diary.createdAt.split("T")[0] ? "animate-[pulse_1s_ease-in-out_1]" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: GetColor(diary.emotions[0].xValue, diary.emotions[0].yValue) }} />
                      <div>
                        <p className="text-gray-600">{diaryDate.toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}</p>
                        <p className="text-xs text-gray-400">{diaryDate.toLocaleDateString("ko-KR", { weekday: "long" })}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button onClick={() => handleEdit(diary)} className="text-gray-400 hover:text-gray-700">
                        <Edit fontSize="inherit" />
                      </button>
                      <button onClick={() => handleDelete(diary)} className="text-gray-400 hover:text-gray-700">
                        <Delete fontSize="inherit" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm">{diary.content}</p>

                  {diary.imageUrl && (
                    <div>
                      <img src={diary.imageUrl} alt="Diary img" className="object-cover rounded-lg" />
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
