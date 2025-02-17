import { useState, useEffect } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { DIARY_ENTRIES } from "../../data/diaryData";

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
//상위폴더에 헤더를 넣었기 때문에, props를 주고 받는 로직을 추가해야 할 듯!
const DiaryCalendar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentDate } = useOutletContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryEntries, setDiaryEntries] = useState(() => {
    // localStorage에서 데이터 불러오기
    const savedEntries = localStorage.getItem("diaryEntries");
    return savedEntries ? JSON.parse(savedEntries) : DIARY_ENTRIES;
  });
  const today = new Date();

  // URL 파라미터 처리
  useEffect(() => {
    const date = searchParams.get("date");
    const month = searchParams.get("month");
    const color = searchParams.get("color");

    if (date && month && color) {
      const currentDate = new Date();
      const newEntry = {
        id: Date.now(),
        date: `${currentDate.getFullYear()}-${String(month).padStart(
          2,
          "0"
        )}-${String(date).padStart(2, "0")}`,
        color: color,
      };

      setDiaryEntries((prev) => {
        const updatedEntries = [...prev, newEntry];
        localStorage.setItem("diaryEntries", JSON.stringify(updatedEntries));
        return updatedEntries;
      });

      // URL 파라미터 제거
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const getMarkerForDay = (day) => {
    const entry = diaryEntries.find((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getDate() === day &&
        entryDate.getMonth() === currentDate.getMonth() &&
        entryDate.getFullYear() === currentDate.getFullYear()
      );
    });

    return entry ? { color: entry.color } : null;
  };

  const formatMonthParam = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}/${month}`;
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(selectedDate);
    const monthParam = formatMonthParam(selectedDate);
    navigate(`/diary/monthly/${monthParam}`, {
      state: {
        selectedDate: selectedDate.toLocaleDateString("fr-CA"),
      },
    });
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="w-full max-w-xs md:max-w-lg lg:max-w-xl">
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center p-1 text-xs md:text-sm text-white font-medium mb-2"
            >
              {day}
            </div>
          ))}

          {Array(firstDayOfMonth)
            .fill(null)
            .map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

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
                  ${
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentDate.getMonth() &&
                    selectedDate.getFullYear() === currentDate.getFullYear()
                      ? "bg-blue-100 bg-opacity-20"
                      : ""
                  } 
                  ${
                    isToday(day)
                      ? "bg-blue-100 bg-opacity-20 border border-white/55 hover:bg-blue-50/50"
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
