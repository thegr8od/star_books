import { useState } from "react";
import { Link } from "react-router-dom";

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
            <li>
              <Link to="/starbooks/home">홈</Link>
            </li>
            <li>
              <Link to="/starbooks/login">로그인</Link>
            </li>
            <li>
              <Link to="/starbooks/mypage/:id">마이페이지</Link>
            </li>
            <li>
              <Link to="/starbooks/diary/calendar">나의 우주</Link>
            </li>
            <li>
              <Link to="/starbooks/universe">우리의 우주</Link>
            </li>
            <li>
              <Link to="/starbooks/constellation/create">별자리 그리기</Link>
            </li>
            <li>
              <Link to="/starbooks/constellation/gallery/:year">별자리 갤러리</Link>
            </li>
            <li>
              <Link to="/starbooks/universe/analysis">감정 통계</Link>
            </li>
            <li>
              <Link to="/starbooks/radio/list">라디오</Link>
            </li>
            <li>
              <Link to="">AI대화</Link>
            </li>
            <li>
              <Link to="/starbooks/logout">로그아웃</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
