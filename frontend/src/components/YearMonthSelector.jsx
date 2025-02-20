import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function YearMonthSelector({ year, month, onYearChange, onMonthChange }) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const dropdownRef = useRef(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (year, month) => {
    const date = new Date(year, month - 1);
    if (year === currentYear) {
      return format(date, "MM월", { locale: ko });
    }
    return format(date, "yyyy.MM월", { locale: ko });
  };

  // 선택 가능한 날짜 옵션 생성 (최근 2년)
  const generateOptions = () => {
    const options = [];
    const startYear = currentYear - 1;

    for (let y = currentYear; y >= startYear; y--) {
      for (let m = 12; m >= 1; m--) {
        // 현재 년도의 경우 현재 월까지만 표시
        if (y === currentYear && m > new Date().getMonth() + 1) continue;

        options.push({
          year: y,
          month: m,
          label:
            y === currentYear
              ? format(new Date(y, m - 1), "MM월")
              : format(new Date(y, m - 1), "yyyy.MM"),
        });
      }
    }
    return options;
  };

  const handleSelect = (selectedYear, selectedMonth) => {
    onYearChange(selectedYear);
    onMonthChange(selectedMonth);
    setIsSelectOpen(false);
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full "
      ref={dropdownRef}
    >
      {/* 현재 선택된 날짜 표시 */}
      <button
        onClick={() => setIsSelectOpen(!isSelectOpen)}
        className="w-full flex items-center justify-center text-white text-sm focus:outline-none"
      >
        <span>{formatDate(year, month)}</span>
        {isSelectOpen ? (
          <KeyboardArrowUpIcon className="ml-2 text-white" />
        ) : (
          <KeyboardArrowDownIcon className="ml-2 text-white" />
        )}
      </button>

      {/* 드롭다운 메뉴 - z-index 추가 */}
      {isSelectOpen && (
        <div className="absolute mt-10 bg-white rounded-lg max-h-60 overflow-y-auto w-full max-w-xs md:max-w-lg lg:max-w-xl shadow-lg z-50">
          {generateOptions().map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option.year, option.month)}
              className={`w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100
                                ${
                                  year === option.year && month === option.month
                                    ? "bg-gray-200"
                                    : ""
                                }
                            `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default YearMonthSelector;
