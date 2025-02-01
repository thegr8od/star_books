import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from "../.././components/Nav";
import Header from "../.././components/Header";
import Button from "../.././components/Button";

function DiaryWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF9999');
  
  // 현재 날짜를 YYYY-MM-DD 형식으로 변환
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(formattedToday);

  const convertToTailwindColor = (hexColor) => {
    const colorMap = {
      '#FF9999': 'bg-red-500',
      '#FFB266': 'bg-orange-500',
      '#FFFF99': 'bg-yellow-500',
      '#99FF99': 'bg-green-500',
      '#99FFFF': 'bg-cyan-500',
      '#9999FF': 'bg-blue-500',
      '#FF99FF': 'bg-pink-500'
    };
    return colorMap[hexColor] || 'bg-red-500';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedDateTime = new Date(selectedDate);
    const date = selectedDateTime.getDate();
    const month = selectedDateTime.getMonth() + 1;
    const year = selectedDateTime.getFullYear();
    
    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    
    const diaryEntry = {
      id: Date.now(),
      date: `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`,
      color: convertToTailwindColor(selectedColor),
      time: timeString,
      title,
      content
    };

    try {
      console.log('Diary saved:', diaryEntry);

      const monthParam = `${year}${String(month).padStart(2, '0')}`;
      navigate(`/starbooks/diary/monthly/${monthParam}`, {
        state: {
          selectedDate: selectedDateTime.getTime(),
          day: date,
          newEntry: diaryEntry
        }
      });

      navigate(`/starbooks/diary/calendar?date=${date}&month=${month}&color=${encodeURIComponent(selectedColor)}`);
    } catch (error) {
      console.error('Failed to save diary:', error);
    }
  };

  return (
    <>
      <Nav />
      <div className="flex flex-col items-center w-full h-full px-4">
        <div className="w-full max-w-xl">
          <Header
            title="일기 작성"
            titleClassName="text-base md:text-lg font-semibold text-white"
          />
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* 날짜 선택 */}
            <div>
              <label className="block text-white text-sm mb-2">날짜 선택:</label>
              <input
                type="date"
                value={selectedDate}
                max={formattedToday} // 미래 날짜 선택 방지
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
            </div>

            {/* 제목 입력 */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
            </div>

            {/* 내용 입력 */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="오늘의 이야기를 들려주세요"
                className="w-full h-64 px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                required
              />
            </div>

            {/* 색상 선택 */}
            <div className="flex items-center space-x-4">
              <label className="text-white text-sm">오늘의 색상:</label>
              <div className="flex space-x-2">
                {['#FF9999', '#FFB266', '#FFFF99', '#99FF99', '#99FFFF', '#9999FF', '#FF99FF'].map((colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    onClick={() => setSelectedColor(colorOption)}
                    className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 ${
                      selectedColor === colorOption ? 'ring-2 ring-white' : ''
                    }`}
                    style={{ backgroundColor: colorOption }}
                  />
                ))}
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                저장하기
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DiaryWrite;