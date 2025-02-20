import { useEffect } from "react";
import { useSelector } from "react-redux";
import HomeBackground from "./HomeBackground";
import LoginHome from "./LoginHome";
import LoadingSpinner from "../../components/LoadingSpinner";

const Home = () => {
  const user = useSelector((state) => state.user);

  // 디버깅을 위한 로그
  // useEffect(() => {
  //   console.log("Current user state:", user);
  // // }, [user]);

  //   //oauth
  //   if (token) {
  //     // 토큰을 로컬 스토리지에 저장
  //     localStorage.setItem("accessToken", token);
  //     console.log(5)
  //     setIsLoggedIn(true); // 로그인 상태 업데이트

  //     // window.location.replace("/");
  //   } else if (storedToken) { //이미 oauth로 로그인한 사람 or 일반 로그인
  //     // 기존 토큰이 있으면 로그인 유지
  //     setIsLoggedIn(true);
  //   }
  // // }, [searchParams, location.pathname]); // searchParams 또는 현재 경로가 변경될 때 실행
  // },[] );

  return <>{user.isLogin ? <LoginHome /> : <HomeBackground />}</>;
};

export default Home;

