import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import Layout from "../../components/Layout";
import DiaryDate from "./DiaryDate";
import useDiaryApi from "../../api/useDiaryApi";
import GetColor from "../../components/GetColor";
import ConfirmModal from "../../components/Modal/ConfirmModal";

const MonthlyDiary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const diaryRefs = useRef({});

  const [diaries, setDiaries] = useState([]); // 작성한 일기 정보
  const [currentDate, setCurrentDate] = useState(new Date()); // 날짜(년, 월)
  const selectedDate = location.state?.selectedDate; // 선택된 날짜 (선택된 날짜가 있으면 스크롤)

  // 모달 상태 추가
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    diaryToDelete: null,
  });

  // axios (mount 될 때, currentDate가 변경될 때마다 실행) -> 해당 월에 작성한 일기 정보 요청
  useEffect(() => {
    (async () => {
      const requestData = {
        targetYear: currentDate.getFullYear(),
        targetMonth: currentDate.getMonth() + 1,
      };
      const response = await useDiaryApi.getDiariesByMonth(requestData);
      if (response.status === 200) {
        console.log("일기 조회 성공");
        setDiaries(response.data);
        console.log(response.data)
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

  // 수정 버튼 클릭 시 -> 수정 페이지로 이동
  const handleEdit = (diary) => {
    navigate(`/diary/edit/${diary.diaryId}`, {
      state: {
        diary,
      },
    });
  };

  // 삭제 버튼 클릭 시 -> 삭제 요청 후 성공시 정보 업데이트
  const handleDelete = async () => {
    const diary = deleteModal.diaryToDelete;
    const response = await useDiaryApi.deleteDiary(diary.diaryId);
    console.log(response);
    if (response.status === 204) {
      console.log("일기 삭제 성공");
      setDiaries(diaries.filter((d) => d.diaryId !== diary.diaryId));
    } else {
      console.log("일기 삭제 실패");
    }

    setDeleteModal({ isOpen: false, diaryToDelete: null });
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <DiaryDate currentDate={currentDate} setCurrentDate={setCurrentDate} />
        <div className="flex-1 flex-col space-y-4 overflow-y-auto bg-neutral-100 rounded-3xl p-4" style={{ scrollbarWidth: "none" }}>
          {diaries?.length ? (
            diaries.map((diary, index) => {
              // 요일 표시를 위해 Date 객체 생성
              const diaryDateObj = new Date(diary.diaryDate[0], diary.diaryDate[1] - 1, diary.diaryDate[2]);
              const formattedDate = `${diary.diaryDate[0]}-${String(diary.diaryDate[1]).padStart(2, "0")}-${String(diary.diaryDate[2]).padStart(2, "0")}`;
              return (
                <div key={diary.diaryId} ref={(el) => (diaryRefs.current[formattedDate] = el)} className={`space-y-3 px-5 py-3 bg-white rounded-xl shadow-sm ${selectedDate === formattedDate ? "animate-[pulse_1s_ease-in-out_1]" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      {/* 감정 색 */}
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{
                          backgroundColor: GetColor(diary.DiaryEmotion?.xValue, diary.DiaryEmotion?.yValue),
                        }}
                      />
                      {/* 날짜 */}
                      <div>
                        <p className="text-gray-600">
                          {diary.diaryDate[1]}월 {diary.diaryDate[2]}일
                        </p>
                        <p className="text-xs text-gray-400">
                          {diaryDateObj.toLocaleDateString("ko-KR", {
                            weekday: "long",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* 수정 버튼 */}
                      <button onClick={() => handleEdit(diary)} className="text-gray-400 hover:text-gray-700">
                        <Edit fontSize="inherit" />
                      </button>
                      {/* 삭제 버튼 */}
                      <button onClick={() => setDeleteModal({ isOpen: true, diaryToDelete: diary })} className="text-gray-400 hover:text-gray-700">
                        <Delete fontSize="inherit" />
                      </button>
                    </div>
                  </div>

                  {/* 내용 */}
                  <p className="text-sm">{diary.content}</p>

                  {/* 사진 */}
                  {diary.imageUrl && (
                    <div>
                      <img src={diary.imageUrl} alt="Diary img" className="object-cover rounded-lg" />
                    </div>
                  )}

                  {/* 해시태그 */}
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

      {/* 모달 추가 */}
      <ConfirmModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, diaryToDelete: null })} onConfirm={handleDelete} title="잠시만요" />
    </Layout>
  );
};

export default MonthlyDiary;
