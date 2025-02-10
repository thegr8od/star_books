import { createContext, useState, useEffect } from "react";
import axios from "axios";
import ConstellationGallery from "./ConstellationGallery";
import ConstellationDetail from "./ConstellationDetail";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Layout from "../../components/Layout";

// Context 생성 시 기본값 설정
export const ConstellationContext = createContext({
  galleryData: [],
  isOpened: false,
  setIsOpened: () => {},
  currentYear: new Date().getFullYear(),
  setCurrentYear: () => {},
});

function Constellation() {
  const [isOpened, setIsOpened] = useState(false);
  const [galleryData, setGalleryData] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // 연도별 더미 데이터
  const yearlyDummyData = {
    2023: [
      {
        month: 1,
        xy: [
          // 삼각형 모양
          { start: { x: 0, y: 5 }, end: { x: -4, y: -3 } },
          { start: { x: -4, y: -3 }, end: { x: 4, y: -3 } },
          { start: { x: 4, y: -3 }, end: { x: 0, y: 5 } },
        ],
      },
      {
        month: 2,
        xy: [
          // 마름모 모양
          { start: { x: 0, y: 5 }, end: { x: 5, y: 0 } },
          { start: { x: 5, y: 0 }, end: { x: 0, y: -5 } },
          { start: { x: 0, y: -5 }, end: { x: -5, y: 0 } },
          { start: { x: -5, y: 0 }, end: { x: 0, y: 5 } },
        ],
      },
    ],
    2024: [
      {
        month: 1,
        xy: [
          // 정사각형 모양
          { start: { x: -3, y: 3 }, end: { x: 3, y: 3 } },
          { start: { x: 3, y: 3 }, end: { x: 3, y: -3 } },
          { start: { x: 3, y: -3 }, end: { x: -3, y: -3 } },
          { start: { x: -3, y: -3 }, end: { x: -3, y: 3 } },
        ],
      },
      {
        month: 2,
        xy: [
          // 십자가 모양
          { start: { x: 0, y: 5 }, end: { x: 0, y: -5 } },
          { start: { x: -5, y: 0 }, end: { x: 5, y: 0 } },
        ],
      },
    ],
    2025: [
      {
        month: 1,
        xy: [
          // 육각형 모양
          { start: { x: -3, y: 5 }, end: { x: 3, y: 5 } },
          { start: { x: 3, y: 5 }, end: { x: 6, y: 0 } },
          { start: { x: 6, y: 0 }, end: { x: 3, y: -5 } },
          { start: { x: 3, y: -5 }, end: { x: -3, y: -5 } },
          { start: { x: -3, y: -5 }, end: { x: -6, y: 0 } },
          { start: { x: -6, y: 0 }, end: { x: -3, y: 5 } },
        ],
      },
      {
        month: 2,
        xy: [
          // 별 모양
          { start: { x: 0, y: 5 }, end: { x: 1, y: 1 } },
          { start: { x: 1, y: 1 }, end: { x: 5, y: 0 } },
          { start: { x: 5, y: 0 }, end: { x: 1, y: -1 } },
          { start: { x: 1, y: -1 }, end: { x: 0, y: -5 } },
          { start: { x: 0, y: -5 }, end: { x: -1, y: -1 } },
          { start: { x: -1, y: -1 }, end: { x: -5, y: 0 } },
          { start: { x: -5, y: 0 }, end: { x: -1, y: 1 } },
          { start: { x: -1, y: 1 }, end: { x: 0, y: 5 } },
        ],
      },
    ],
  };

  // 데이터 fetch 함수 수정
  const fetchConstellationData = async (year) => {
    try {
      const response = await axios.get(`/api/constellations/${year}`);
      setGalleryData(response.data);
    } catch (error) {
      console.error("Failed to fetch constellation data:", error);
      // API 요청 실패시 해당 연도의 더미 데이터 사용
      setGalleryData(yearlyDummyData[year] || []);
    }
  };

  // 연도가 변경될 때마다 데이터 fetch
  useEffect(() => {
    fetchConstellationData(currentYear);
  }, [currentYear]);

  // 초기 마운트 시 더미 데이터로 시작
  useEffect(() => {
    setGalleryData(yearlyDummyData[currentYear] || []);
  }, []);

  // 년도 이동 핸들러
  const handlePrevYear = () => {
    setCurrentYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  // Context에 전달할 값
  const contextValue = {
    galleryData,
    isOpened,
    setIsOpened,
    currentYear,
    setCurrentYear,
  };

  // 갤러리 모드일 때 보여줄 헤더 컴포넌트
  const GalleryHeader = () => (
    <>
      <div className="text-center my-1">
        <h1 className="text-white/90 text-xl font-bold">별자리 갤러리</h1>
        <hr className="mx-auto w-2/3 my-2 border-white/60" />
      </div>

      <Header
        className="mb-1"
        title={`${currentYear}년`}
        titleClassName="text-sm md:text-md font-semibold"
        leftChild={
          <Button
            type="DEFAULT"
            className="px-2 py-2 bg-transparent text-white"
            imgSrc="../../../icons/left.png"
            imgClassName="w-4 h-4 md:w-5 md:h-5"
            onClick={handlePrevYear}
          />
        }
        rightChild={
          <Button
            type="DEFAULT"
            className="px-2 py-2 bg-transparent text-white"
            imgSrc="../../../icons/right.png"
            imgClassName="w-4 h-4 md:w-5 md:h-5"
            onClick={handleNextYear}
          />
        }
      />
    </>
  );

  return (
    <ConstellationContext.Provider value={contextValue}>
      <div className="min-h-screen">
        {!isOpened ? (
          <Layout>
            <GalleryHeader />
            <ConstellationGallery />
          </Layout>
        ) : (
          <ConstellationDetail />
        )}
      </div>
    </ConstellationContext.Provider>
  );
}

export default Constellation;
