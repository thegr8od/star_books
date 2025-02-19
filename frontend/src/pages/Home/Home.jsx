import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/userSlice";
import HomeBackground from "./HomeBackground";
import LoginHome from "./LoginHome";
import useMemberApi from "../../api/useMemberApi";

const Home = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation(); // 현재 페이지 경로 가져오기
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(async () => {
    const token = searchParams.get("token");

    //oauth
    if (token) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", token);
      
      try {
        const response = await useMemberApi.getMemberMY();

        if(response.status === 200){
          const userData = { ...response.data.data, isLogin: true };
        
          //✅ Redux 저장 전에 localStorage에도 저장
          localStorage.setItem("user", JSON.stringify(userData));

          console.log(response.data.data.nickname);
          dispatch(setUser(userData));
          console.log(user.isLogin);
        }

      } catch(e) {
        console.error("Oauth 로그인인 에러:", error);
      }

      // setTimeout(() => {
      //   window.location.href = "/";
      // }, 2000);
    }
    
  }, [searchParams, location.pathname]); // searchParams 또는 현재 경로가 변경될 때 실행

  return <>{user.isLogin ? <LoginHome /> : <HomeBackground />}</>;
};

export default Home;
