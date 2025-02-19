import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/userSlice";
import HomeBackground from "./HomeBackground";
import LoginHome from "./LoginHome";
import useMemberApi from "../../api/useMemberApi";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation(); // 현재 페이지 경로 가져오기
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const token = searchParams.get("token");
    const storedToken = localStorage.getItem("accessToken");

    //oauth
    if (token) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", token);

      setIsLoggedIn(true); // 로그인 상태 업데이트

      window.location.replace("/");
    } else if (storedToken) { //이미 oauth로 로그인한 사람 or 일반 로그인
      // 기존 토큰이 있으면 로그인 유지
      setIsLoggedIn(true);
    }
  }, [searchParams, location.pathname]); // searchParams 또는 현재 경로가 변경될 때 실행

  return <>{isLoggedIn ? <LoginHome /> : <HomeBackground />}</>;
};

export default Home;
