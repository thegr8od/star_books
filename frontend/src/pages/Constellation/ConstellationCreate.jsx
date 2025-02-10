import { useState, useMemo } from "react";
import ConstellationCreateAi from "./ConstellationCreateAi";
import ConstellationCreateHand from "./ConstellationCreateHand";
import YearMonthSelector from "../../components/YearMonthSelector";
import Button from "../../components/Button";
import Layout from "../../components/Layout";

function ConstellationCreate() {
  const [isOpened, setIsOpened] = useState(false);

  // 현재 날짜의 이전 달을 초기값으로 설정
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(() => {
    const prevMonth = currentDate.getMonth();
    return prevMonth === 0 ? 12 : prevMonth;
  });

  // 더미 데이터를 메모이제이션
  const constellationData = useMemo(
    () => ({
      color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"],
      count: 5,
    }),
    []
  );

  // 현재 모드에 따른 텍스트와 버튼 타입 설정
  const modeConfig = {
    text: {
      title: "별자리 만들기",
      description: isOpened
        ? "별을 움직여 나만의 별자리를 만들어 보세요."
        : "사진을 선택해 나만의 별자리를 만들어 보세요.",
    },
    buttonTypes: {
      ai: isOpened ? "PREV" : "DEFAULT",
      hand: isOpened ? "DEFAULT" : "PREV",
    },
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen p-4">
        {/* 제목과 설명 - 최대 너비 설정 */}
        <div className="flex flex-col items-center">
          <h1 className="text-lg md:text-xl font-bold mb-1 text-white text-center">
            {modeConfig.text.title}
          </h1>
          <p className="text-xs md:text-base mb-1 text-white text-center max-w-[240px] md:max-w-[320px]">
            {modeConfig.text.description}
          </p>

          {/* hr 선 - 설명 텍스트와 동일한 너비 */}
          <div className="w-full max-w-[240px] md:max-w-[320px] mb-3">
            <hr />
          </div>

          {/* 버튼 영역 - 설명 텍스트와 동일한 너비 */}
          <div className="w-full max-w-[240px] md:max-w-[320px] flex space-x-2 mb-2">
            <Button
              text="AI로 만들기"
              type={modeConfig.buttonTypes.ai}
              className="flex-1 px-4 py-1 text-sm md:text-base"
              onClick={() => setIsOpened(false)}
            />
            <Button
              text="직접 만들기"
              type={modeConfig.buttonTypes.hand}
              className="flex-1 px-4 py-1 text-sm md:text-base"
              onClick={() => setIsOpened(true)}
            />
          </div>
        </div>

        {/* 연도/월 선택 컴포넌트 */}
        <div className="mb-2">
          <YearMonthSelector
            year={year}
            month={month}
            onYearChange={setYear}
            onMonthChange={setMonth}
          />
        </div>

        {/* 메인 컨텐츠 */}
        {!isOpened ? (
          <ConstellationCreateAi
            constellationData={constellationData}
            setIsOpened={setIsOpened}
            year={year}
            month={month}
          />
        ) : (
          <ConstellationCreateHand
            constellationData={constellationData}
            setIsOpened={setIsOpened}
            year={year}
            month={month}
          />
        )}
      </div>
    </Layout>
  );
}

export default ConstellationCreate;
