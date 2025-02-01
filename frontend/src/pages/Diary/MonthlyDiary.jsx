import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Nav from "../.././components/Nav";
import { DIARY_ENTRIES } from '../../data/diaryData';

const MonthlyDiary = () => {
  const { month } = useParams();
  const location = useLocation();
  const selectedDate = location.state?.selectedDate;
  const selectedDay = location.state?.day;
  const newEntry = location.state?.newEntry;
  
  const containerRef = useRef(null);
  const targetDateRef = useRef(null);
  const [diaryEntries, setDiaryEntries] = useState(() => {
    // localStorage에서 데이터 불러오기
    const savedEntries = localStorage.getItem('diaryEntries');
    // 저장된 데이터가 없으면 더미 데이터 사용
    return savedEntries ? JSON.parse(savedEntries) : DIARY_ENTRIES;
  });
  const [hasScrolled, setHasScrolled] = useState(false);

  // 해당 월의 일기만 필터링
  const filteredEntries = diaryEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const entryYearMonth = `${entryDate.getFullYear()}${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
    return entryYearMonth === month;
  });

  // 새로운 엔트리 추가
  useEffect(() => {
    if (newEntry) {
      setDiaryEntries(prev => {
        const filteredEntries = prev.filter(entry => entry.id !== newEntry.id);
        const updatedEntries = [...filteredEntries, newEntry].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
        return updatedEntries;
      });
    }
  }, [newEntry]);

  // 선택된 날짜로 스크롤하는 함수
  const scrollToSelectedDate = () => {
    if (targetDateRef.current && !hasScrolled) {
      setTimeout(() => {
        targetDateRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        setHasScrolled(true);
      }, 100);
    }
  };

  useEffect(() => {
    scrollToSelectedDate();
  }, [selectedDate, month, diaryEntries]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // month 파라미터에서 년월 추출
  const year = month.substring(0, 4);
  const monthNum = month.substring(4, 6);

  return (
    <>
      <Nav />
      <div 
        ref={containerRef} 
        className="h-screen overflow-y-auto bg-gray-100 px-4 py-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {year}년 {parseInt(monthNum)}월의 일기
        </h1>

        <div className="max-w-2xl mx-auto space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              이번 달에 작성된 일기가 없습니다.
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const entryDate = new Date(entry.date);
              const day = entryDate.getDate();
              const isSelected = day === selectedDay && 
                               entryDate.getMonth() === new Date(selectedDate).getMonth() &&
                               entryDate.getFullYear() === new Date(selectedDate).getFullYear();
              
              return (
                <div
                  key={entry.id}
                  ref={isSelected ? targetDateRef : null}
                  className={`
                    bg-white rounded-lg p-6 shadow-md
                    ${isSelected ? 'ring-2 ring-blue-500' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-4 h-4 rounded-full ${entry.color}`} 
                        title="Selected Color"
                      />
                      <h2 className="text-xl font-semibold text-gray-800">
                        {entry.title}
                      </h2>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(entry.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {entry.time}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-gray-600 whitespace-pre-line">
                    {entry.content}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default MonthlyDiary;