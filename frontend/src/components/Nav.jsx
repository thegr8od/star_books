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
    <nav className="fixed top-0 right-0 z-50 p-4 text-white">
      <button onClick={toggleMenu}>☰</button>

      {/* Backdrop */}
      <div className={`fixed inset-0 bg-black bg-opacity-40 ${!isOpen && "hidden"}`} />

      {/* Menu panel */}
      <div className={`fixed top-0 right-0 h-full w-60 bg-gray-900 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={toggleMenu} className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-purple-700 transition-colors">
          <img src="/icons/close2.png" alt="close" className="w-4 h-4" />
        </button>
        <ul className="pt-16 pb-6 space-y-2">
          {Nav_ITEMS.map((item, index) => (
            <li key={index}>
              <Link to={item.path} className="block px-6 py-3 hover:bg-purple-700 transition-colors">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
