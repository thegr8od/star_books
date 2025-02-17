import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import diaryApi from "../../api/useDiaryApi";
import GetColor from "../../components/GetColor";

// 캘린더의 각 날짜 타일을 표시하는 컴포넌트
// marker prop이 있으면 해당 날짜에 감정 색상 표시
const CalendarTile = ({ children, marker }) => {
  return (
    <div className="rounded-lg text-xs md:text-sm h-16 text-white relative">
      {children}
      {marker && (
        <div
          className={`w-2 h-2 rounded-full absolute bottom-2 left-1/2 transform -translate-x-1/2 ${marker.color}`}
        />
      )}
    </div>
  );
};

// 메인 캘린더 컴포넌트
const DiaryCalendar = () => {
  const navigate = useNavigate();
  const { currentDate } = useOutletContext(); // 상위 컴포넌트에서 현재 날짜 받아오기
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜 상태
  const [diaryEntries, setDiaryEntries] = useState([]); // 다이어리 엔트리 데이터 상태
  const today = new Date(); // 오늘 날짜

  // 현재 월의 다이어리 데이터를 서버에서 가져오는 useEffect
  useEffect(() => {
    const fetchMonthlyDiaries = async () => {
      try {
        const data = {
          targetYear: currentDate.getFullYear(),
          targetMonth: currentDate.getMonth() + 1,
        };

        const response = await diaryApi.getDiariesByMonth(data);

        if (response && response.data) {
          const formattedEntries = response.data.map((entry) => {
            const emotion = entry.emotions[0];
            return {
              id: entry.diaryId,
              date: {
                year: entry.createdAt[0],
                month: entry.createdAt[1] - 1, // JavaScript의 월은 0부터 시작하므로 1을 빼줍니다
                day: entry.createdAt[2],
              },
              color: GetColor(emotion.xValue, emotion.yValue),
            };
          });
          setDiaryEntries(formattedEntries);
        }
      } catch (error) {
        console.error("다이어리 데이터 조회 실패:", error);
      }
    };

    fetchMonthlyDiaries();
  }, [currentDate]);

  // 현재 월의 총 일수 계산
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // 현재 월의 1일이 무슨 요일인지 계산 (0: 일요일, 6: 토요일)
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // 달력에 표시할 날짜 배열 생성
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  // 오늘 날짜인지 확인하는 함수
  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  // 특정 날짜의 다이어리 엔트리와 감정 색상을 찾는 함수
  const getMarkerForDay = (day) => {
    const entry = diaryEntries.find((entry) => {
      return (
        entry.date.day === day &&
        entry.date.month === currentDate.getMonth() &&
        entry.date.year === currentDate.getFullYear()
      );
    });

    return entry ? { color: entry.color } : null;
  };

  // URL에 사용할 년/월 형식으로 변환하는 함수
  const formatMonthParam = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}/${month}`;
  };

  // 날짜 클릭 시 해당 날짜의 상세 페이지로 이동하는 함수
  const handleDateClick = (day) => {
    // 해당 날짜에 일기가 있는지 확인
    const entry = diaryEntries.find(
      (entry) =>
        entry.date.day === day &&
        entry.date.month === currentDate.getMonth() &&
        entry.date.year === currentDate.getFullYear()
    );

    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(selectedDate);

    // 일기가 있는 경우에만 monthly 페이지로 이동
    if (entry) {
      const monthParam = formatMonthParam(selectedDate);
      navigate(`/diary/monthly/${monthParam}`, {
        state: {
          selectedDate: selectedDate.toLocaleDateString("fr-CA"),
        },
      });
    }
  };

  // 캘린더 UI 렌더링
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="w-full max-w-xs md:max-w-lg lg:max-w-xl">
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {/* 요일 헤더 표시 */}
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center p-1 text-xs md:text-sm text-white font-medium mb-2"
            >
              {day}
            </div>
          ))}

          {/* 첫 주의 빈 칸 처리 */}
          {Array(firstDayOfMonth)
            .fill(null)
            .map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

          {/* 날짜 타일 표시 */}
          {days.map((day) => (
            <CalendarTile key={day} marker={getMarkerForDay(day)}>
              <button
                onClick={() => handleDateClick(day)}
                className={`
                  w-full 
                  h-full 
                  flex
                  justify-center
                  items-start
                  p-1
                  rounded-lg
                  cursor-pointer
                  ${
                    getMarkerForDay(day)
                      ? "hover:bg-blue-50/20"
                      : "hover:bg-blue-50/10"
                  } 
                  ${
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentDate.getMonth() &&
                    selectedDate.getFullYear() === currentDate.getFullYear()
                      ? "bg-blue-100 bg-opacity-20"
                      : ""
                  } 
                  ${
                    isToday(day)
                      ? "border border-white/55 hover:bg-blue-50/50"
                      : ""
                  }
                `}
              >
                {day}
              </button>
            </CalendarTile>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiaryCalendar;
