import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../store/userSlice";
import useMemberApi from "@api/useMemberApi";
// ... other imports

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // ... other states

  // OAuth 로그인 처리
  useEffect(() => {
    const handleOAuthLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        try {
          // Redux 상태만 초기화
          dispatch(clearUser());
          
          console.log("Received new token:", token);
          
          // 새로운 사용자 데이터 가져오기
          const userData = await useMemberApi.handleOAuthToken(token);
          console.log("New user data:", userData);
          
          if (!userData || !userData.email) {
            throw new Error("Invalid user data received");
          }

          // Redux store에 새 데이터 저장
          dispatch(setUser(userData));

          // URL 파라미터 제거
          window.history.replaceState({}, document.title, window.location.pathname);

          setAlertMessage("로그인에 성공했습니다!");
          setShowAlert(true);

          // 홈으로 이동
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        } catch (error) {
          console.error('OAuth 로그인 처리 실패:', error);
          dispatch(clearUser());
          localStorage.removeItem("accessToken");  // 실패시에만 토큰 제거
          
          setAlertMessage("로그인에 실패했습니다.");
          setShowAlert(true);
        }
      }
    };

    handleOAuthLogin();
  }, [navigate, dispatch]);

  // 일반 로그인 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Redux 상태만 초기화
        dispatch(clearUser());

        const response = await useMemberApi.loginMember({
          email: email,
          password: password,
        });

        console.log("Login response:", response);

        if (response && response.user) {
          dispatch(setUser({ 
            ...response.user, 
            isLogin: true,
            isActive: true 
          }));
          
          setAlertMessage("로그인에 성공했습니다!");
          setShowAlert(true);

          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        } else {
          throw new Error("Invalid response data");
        }
      } catch (error) {
        console.error("로그인 에러:", error);
        dispatch(clearUser());
        localStorage.removeItem("accessToken");  // 실패시에만 토큰 제거
        
        setAlertMessage("이메일 또는 비밀번호가 일치하지 않습니다.");
        setShowAlert(true);
      }
    }
  };

  // ... rest of the component code
};

export default Login;
