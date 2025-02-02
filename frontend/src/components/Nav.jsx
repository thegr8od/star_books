import React, { useState } from "react";
import { Link } from "react-router-dom";

const Nav_ITEMS = [
  { label: "홈", path: "/starbooks/home" },
  { label: "마이페이지", path: "/starbooks/mypage/:id" },
  { label: "나의 우주", path: "/starbooks/diary/calendar" },
  { label: "우리의 우주", path: "/starbooks/universe" },
  { label: "별자리 그리기", path: "/starbooks/constellation/create" },
  { label: "별자리 갤러리", path: "/starbooks/constellation/gallery/:year" },
  { label: "감정 통계", path: "/starbooks/universe/analysis" },
  { label: "라디오", path: "/starbooks/radio/list" },
  { label: "AI대화", path: "" },
  { label: "로그아웃", path: "/starbooks/logout" },
];

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="text-white">
      <button onClick={toggleMenu}>☰</button>

      {isOpen && (
        <div>
          <ul onClick={toggleMenu}>
            {Nav_ITEMS.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
