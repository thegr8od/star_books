import { Link } from 'react-router-dom';
import { useState } from 'react';

   function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const currentYear = new Date().getFullYear();
    // const userId = localStorage.getItem('userId') // login구현 후 가능!

    function handleLogin() {
        setIsLoggedIn(true);
      }
     
      function handleLogout() {
        setIsLoggedIn(false);
      }

    return (
      <div>
     <button onClick={() => setIsOpen(!isOpen)}>☰</button>
     
     {isOpen && (
       <nav>
         <ul>
           {isLoggedIn ? (
            <>
             {/* <li>
             <li><Link to={`mypage/${userId}`}>프로필</Link></li>
             </li> */}
              <li><button onClick={handleLogout}>로그아웃</button></li>
              <li>
                <Link to="diary" onClick={() => setOpenSubMenu(openSubMenu === 'diary' ? null : 'diary')}>
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
              </li>
              <li><Link to="universe">우리의 우주</Link></li>
              <li><Link to="radio/list">라디오</Link></li>
            </>

           ) : (
             <>
               <li><Link to="login" onClick={handleLogin}>로그인</Link></li>
               <li><Link to="signup" onClick={handleLogin}>회원가입</Link></li>
             </>
           )}
           
           
         </ul>
       </nav>
     )}
   </div>
    );
   }

   export default Nav