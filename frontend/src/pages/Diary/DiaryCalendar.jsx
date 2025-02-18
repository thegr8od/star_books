import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import diaryApi from "../../api/useDiaryApi";
import GetColor from "../../components/GetColor";

// 캘린더의 각 날짜 타일을 표시하는 컴포넌트: style로 바꾸기 + 조건문으로 children이 month,day랑 겹치면 이런 조건을 넣던가 아니면 배열을 같이 묶어서 여기 보내던가 하기.
// marker prop이 있으면 해당 날짜에 감정 색상 표시
const CalendarTile = ({ children, marker }) => {
  return (
    <div className="rounded-lg text-xs md:text-sm h-16 text-white relative">
      {children}
      {marker && (
        <div
          className="w-2 h-2 rounded-full absolute bottom-2 left-1/2 transform -translate-x-1/2"
          style={{ backgroundColor: marker.color }}
        />
      )}
    </div>
  );
};

// 메인 캘린더 컴포넌트
const DiaryCalendar = () => {
  const navigate = useNavigate();
  const { currentDate, setClickDay } = useOutletContext(); // 상위 컴포넌트에서 현재 날짜 받아오기
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜 상태
  const [diaryEntries, setDiaryEntries] = useState([]); // 다이어리 엔트리 데이터 상태

  const today = new Date(); // 오늘 날짜

  // 현재 날짜 데이터를 Diary에서 가져오는 useEffect
  useEffect(() => {
    const CalendarMonthly = async () => {
      try {
        const targetYear = currentDate.getFullYear();
        const targetMonth = currentDate.getMonth() + 1;
        const data = { targetYear: targetYear, targetMonth: targetMonth };

        // console.log(targetYear); //2025
        // console.log(targetMonth); //2
        //참고용
        // const getDiariesByMonth = async (data) => {
        //     const jwt = localStorage.getItem("accessToken");

        //     try {
        //         const response = await useAxiosInstance
        //             .authApiClient(jwt)
        //       .get(`/diary/year/${data.targetYear}/month/${data.targetMonth}`);

        //         return response;
        //     } catch(e) {
        //         return e.response;
        //     }
        // }

        const response = await diaryApi.getDiariesByMonth(data);
        //참고용 response형식
        // [
        //   {
        //     "diaryId": 101,
        //     "title": "따뜻한 봄날",
        //      "diaryDate": "2025-02-18"
        //     "content": "오늘은 날씨가 따뜻해서 산책을 다녀왔다. 기분이 상쾌하다!",
        //     "emotions": [
        //       { "xValue": 3.5, "yValue": 2.0 }
        //     ],
        //     "hashtags": ["행복한", "설레는", "기쁜"],
        //     "imageUrls": [
        //       "https://example.com/image1.jpg",
        //       "https://example.com/image2.jpg"
        //     ],
        //     "createdAt": "2025-03-05T14:30:00"
        //   },
        //   {
        //     "diaryId": 102,
        //     "title": "바쁜 하루",
        //     "diaryDate": "2025-02-19"
        //     "content": "오늘은 업무가 많아서 정신없이 보냈다. 피곤하지만 뿌듯한 하루였다.",
        //     "emotions": [
        //       { "xValue": 2.0, "yValue": 3.5 }
        //     ],
        //     "hashtags": ["지친", "만족스러운"],
        //     "imageUrls": [
        //       "https://example.com/image3.png"
        //     ],
        //     "createdAt": "2025-03-15T09:45:00"
        //   },
        //   {
        //     "diaryId": 103,
        //     "title": "비 오는 날",
        //     "diaryDate": "2025-02-20"
        //     "content": "오늘은 비가 내려서 기분이 조금 가라앉았다. 따뜻한 차 한잔으로 위로했다.",
        //     "emotions": [
        //       { "xValue": -1.5, "yValue": -2.0 }
        //     ],
        //     "hashtags": ["우울한", "조용한"],
        //     "imageUrls": [],
        //     "createdAt": "2025-03-28T18:20:00"
        //   }
        // ]
        // console.log(response); // 데이터가 있어야 조회가 된다.
        //참고용: response.data는 배열로 받아진다.

        // data
        // :
        // Array(8)
        // 0
        // :
        // {diaryId: 128, title: '', content: '', emotions: Array(0), hashtags: Array(0), …}
        // 1
        // :
        // {diaryId: 129, title: '', content: '', emotions: Array(0), hashtags: Array(0), …}
        // 2
        // :
        // {diaryId: 130, title: '', content: '', emotions: Array(0), hashtags: Array(0), …}
        // 3
        // :
        // {diaryId: 131, title: '', content: '', emotions: Array(0), hashtags: Array(0), …}
        // 4
        // :
        // {diaryId: 133, title: '', content: '', emotions: Array(1), hashtags: Array(4), …}
        // 5
        // :
        // {diaryId: 135, title: '', content: '', emotions: Array(1), hashtags: Array(5), …}
        // 6
        // :
        // {diaryId: 136, title: '', content: '', emotions: Array(1), hashtags: Array(5), …}
        // 7
        // :
        // {diaryId: 155, title: '오늘의 다이어리', content:
        //받은 데이터 가공 함수
        // console.log(response.data);

        if (response && response.data) {
          const diaryDatas = response.data.map((oneday) => {
            // console.log("각 일기 데이터:", oneday); // 데이터 구조 확인
            return {
              id: oneday.diaryId,
              date: oneday.diaryDate, // diaryDate 사용
              color: oneday.emotions[0]
                ? GetColor(oneday.emotions[0].xValue, oneday.emotions[0].yValue)
                : null,
            };
          });
          // console.log("가공된 데이터:", diaryDatas); // 가공된 데이터 확인
          setDiaryEntries(diaryDatas);
        }
      } catch (error) {
        console.error("다이어리 데이터 조회 실패:", error);
      }
    };

    CalendarMonthly();
  }, [currentDate]);

  //여기부터 캘린더 함수들
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
  const getColorForDay = (day) => {
    // console.log("현재 확인하는 날짜:", day);
    // console.log("전체 일기 데이터:", diaryEntries);

    const entry = diaryEntries.find((entry) => {
      // entry.date가 배열인지 확인
      if (!Array.isArray(entry.date)) {
        console.error("Invalid date format:", entry.date);
        return false;
      }

      const [entryYear, entryMonth, entryDay] = entry.date;

      console.log(
        `비교: ${entryDay} === ${day} && ${entryMonth} === ${
          currentDate.getMonth() + 1
        } && ${entryYear} === ${currentDate.getFullYear()}`
      );

      return (
        entryDay === day &&
        entryMonth === currentDate.getMonth() + 1 &&
        entryYear === currentDate.getFullYear()
      );
    });

    return entry && entry.color ? { color: entry.color } : null;
  };

  //참고: diaryEntries는 아래와 같음.
  //id: oneday.diaryId,
  // date: oneday.diaryDate,
  // color: GetColor(
  //   oneday.emotions[0].xValue,
  //   oneday.emotions[0].yValue

  // URL에 사용할 년/월 형식으로 변환하는 함수
  const formatMonthParam = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}/${month}`;
  };

  // 날짜 클릭 시 해당 날짜의 상세 페이지로 이동하는 함수
  const handleDateClick = (day) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(selectedDate);

    // YYYY-MM-DD 형식으로 변환하여 전달
    const formattedDate = selectedDate.toISOString().split("T")[0];
    console.log("선택된 날짜:", formattedDate); // 날짜 형식 확인
    setClickDay(formattedDate);

    // 해당 날짜에 일기가 있는지 확인
    const entry = diaryEntries.find(
      (entry) =>
        entry.date.day === day &&
        entry.date.month === currentDate.getMonth() &&
        entry.date.year === currentDate.getFullYear()
    );

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
            <CalendarTile key={day} marker={getColorForDay(day)}>
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
                    getColorForDay(day)
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

// days.map()은:

// 캘린더 UI를 처음 그릴 때 한 번 실행됩니다
// 각 날짜 타일을 생성하기 위해 사용됩니다
// 이때 각 날짜 버튼에 onClick 핸들러가 이미 할당됩니다

// 클릭했을 때는:

// 해당 버튼에 이미 할당된 onClick 핸들러가 바로 실행됩니다
// 이미 해당 버튼에는 자신의 day 값이 클로저로 저장되어 있습니다
// 따라서 추가적인 배열 순회 없이 바로 해당 날짜 값을 사용할 수 있습니다

// 캘린더에서:
// 날짜 선택 → "YYYY-MM-DD" 형식으로 변환
// + 버튼 클릭 → 빈 다이어리 생성
// 성공 시 → 모달창 표시
// 실패 시 → 에러 메시지 표시
