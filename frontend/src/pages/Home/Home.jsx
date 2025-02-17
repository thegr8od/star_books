import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import HomeBackground from "./HomeBackground";
import LoginHome from "./LoginHome";
import useMemberApi from "../../api/useMemberApi";
//redux
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation(); // 현재 페이지 경로 가져오기
  const dispatch = useDispatch();

  const getDetailData = async (jwt) => {
    
    try{
      const response = useMemberApi.getUserInfo(jwt)
      console.log(response);
      return response.data;
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const token = searchParams.get("token");
    const storedToken = localStorage.getItem("accessToken");

    if (token) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", token);
      setIsLoggedIn(true); // 로그인 상태 업데이트

      const data = getDetailData(token);
      if(data.gender === 'OTHER'){
        
      } else {
        dispatch(setUser({ ...data, isLogin: true }));
      }

      window.location.replace("/");
    } else if (storedToken) {
      // 기존 토큰이 있으면 로그인 유지
      setIsLoggedIn(true);
    }
  }, [searchParams, location.pathname]); // searchParams 또는 현재 경로가 변경될 때 실행

  return <>{isLoggedIn ? <LoginHome /> : <HomeBackground />}</>;
};

export default Home;
