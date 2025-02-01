import { Link } from 'react-router-dom';
import { useState } from 'react';

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const currentYear = new Date().getFullYear();
  
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <nav>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >      
        <img src="/icons/menu.svg" alt="메뉴" />
      </button>

      {isOpen && (
        <div>                   
          <ul>
            {isLoggedIn ? (
              <>
                <li><Link to="/starbooks">Home</Link></li>
                <li>
                  <button 
                    onClick={() => setOpenSubMenu(openSubMenu === 'diary' ? null : 'diary')}
                    aria-expanded={openSubMenu === 'diary'}
                  >
                    나의 우주
                  </button>
                  {openSubMenu === 'diary' && (
                    <ul>
                      <li><Link to="/starbooks/diary/write">일기쓰기</Link></li>
                      <li><Link to="/starbooks/diary/calendar">달력</Link></li>
                      <li><Link to="/starbooks/diary/stars">나의 별</Link></li>
                      <li><Link to={`/starbooks/constellation/gallery/${currentYear}`}>나의 별자리</Link></li>   
                    </ul>
                  )}
                </li>
                <li><Link to="/starbooks/universe">우리의 우주</Link></li>
                <li><Link to="/starbooks/radio/list">라디오</Link></li>
                <li><button onClick={handleLogout}>로그아웃</button></li>
              </>
            ) : (
              <>
                <li><Link to="/starbooks/login" onClick={handleLogin}>로그인</Link></li>
                <li><Link to="/starbooks/signup" onClick={handleLogin}>회원가입</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Nav;