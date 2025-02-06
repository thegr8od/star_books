import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
const DiaryWrite = () => {
  const location = useLocation();
  const { emotions } = location.state;

  // 날짜, 요일 가져오기
  const getDayInfo = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토", "일"];
    // 추후 DB에 저장된 날 가져올 수 있도록 수정 필요
    const today = new Date();
    // 월
    const month = today.getMonth() + 1;
    // 날짜
    const dayNum = today.getDate();
    // 요일
    const dayName = days[today.getDay()];
    return { dayNum, dayName, month };
  };

  const { dayNum, dayName, month } = getDayInfo();

  return (
    <Layout>
      <div className="h-full">
        {/* 날짜 */}
        <div className="text-white p-3 mb-3">
          <div className="flex items-baseline gap-2 border-b border-white pb-1 w-fit">
            <span>{month}월</span>
            <span>{dayNum}일</span>
            <span>{dayName}요일</span>
          </div>
        </div>

        {/* 콘텐츠 - 흰색 카드 */}
        <div className="bg-white rounded-lg shadow-md"></div>

        {/* 텍스트 입력 */}

        {/* 이미지 업로드 */}

        {/* 해시태그 */}

        {/* 버튼 */}
      </div>
    </Layout>
  );
};

export default DiaryWrite;
