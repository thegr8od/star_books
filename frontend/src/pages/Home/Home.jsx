import { useEffect, useState } from 'react';
import HomeBackground from './HomeBackground';
import LoginHome from './LoginHome';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인
    const accessToken = sessionStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken); // accessToken이 있으면 true, 없으면 false
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return (
    <>
      {isLoggedIn ? <LoginHome /> : <HomeBackground />}
    </>
  );
};

export default Home;