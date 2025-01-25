import { Link } from 'react-router-dom';
import { useState } from 'react';
import BackButton from './BackButton.jsx';
import './nav.css';

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const currentYear = new Date().getFullYear();
  
  function handleLogin() {
    setIsLoggedIn(true);
  }
  
  function handleLogout() {
    setIsLoggedIn(false);
  }

  return (
    <div>
      <div className="nav-container">
        <div className="nav-bar">
          <div className="nav-button-container">
            <BackButton />
            <button onClick={() => setIsOpen(!isOpen)}>      
              <img src="/icons/menu.svg" alt="메뉴" className="menu-icon" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="frame">
          <div className="group" />
          <div className="group-wrapper">
            <div className="div">
              {isLoggedIn ? (
                <>
                  <li><Link to="">Home</Link></li>
                  {/* <li><Link to="/profile" >Profile</Link></li> */}
                  <Link 
                    to="diary" 
                    onClick={() => setOpenSubMenu(openSubMenu === 'diary' ? null : 'diary')}
                  >
                    나의 우주
                  </Link>
                  {openSubMenu === 'diary' && (
                    <ul>
                      <li><Link to="diary/write">일기쓰기</Link></li>
                      <li><Link to="diary/calendar">달력</Link></li>
                      <li><Link to="diary/stars">나의 별</Link></li>
                      <li><Link to={`constellation/gallery/${currentYear}`}>나의 별자리</Link></li>   
                    </ul>
                  )}
                   <li><Link to="universe" >우리의 우주</Link></li>
                   <li> <Link to="radio/list">라디오</Link></li>
                  <button onClick={handleLogout}>로그아웃</button>
                </>
              ) : (
                <>
                  <li><Link to="login" onClick={handleLogin}>로그인</Link></li>
                  <li><Link to="signup" onClick={handleLogin}>회원가입</Link></li>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;