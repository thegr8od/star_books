import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//redux
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../store/userSlice";
//api함수
import useMemberApi from "@api/useMemberApi";
//커스텀
import LoginModal from "./LoginModal";
import CustomAlert from "../../components/CustomAlert";
//아이콘
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); //이메일
  const [password, setPassword] = useState(""); //패스워드
  const [showPassword, setShowPassword] = useState(false); //패스워드상태
  const [errors, setErrors] = useState({}); //에러
  const [isModalOpen, setIsModalOpen] = useState(false); //모달
  const [alertMessage, setAlertMessage] = useState(""); //알람
  const [showAlert, setShowAlert] = useState(false); //알람상태
  const dispatch = useDispatch();

  useEffect(() => {
  // ❌ localStorage.clear();  <-- 일단 제거
  dispatch(clearUser());      // 필요한 경우만 남기기

  const handleOAuthLogin = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      try {
        // ❌ localStorage.clear();  <-- 여기도 제거
        // ❌ dispatch(clearUser()); <-- 굳이 필요 없다면 제거

        console.log("Token received:", token);

        // 이 부분에서 바로 localStorage에 저장
        localStorage.setItem("accessToken", token);

        // 토큰 디코드 및 추가 작업
        const userData = await useMemberApi.handleOAuthToken(token);
        console.log("User data:", userData);

        // Redux 저장
        dispatch(setUser({
          ...userData,
          isLogin: true,
          isActive: true
        }));

        // URL 파라미터 제거 (옵션)
        window.history.replaceState({}, document.title, window.location.pathname);

        setAlertMessage("로그인에 성공했습니다!");
        setShowAlert(true);

        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);

      } catch (error) {
        console.error('OAuth 로그인 처리 실패:', error);
        localStorage.clear();
        dispatch(clearUser());
        setAlertMessage("로그인에 실패했습니다.");
        setShowAlert(true);
      }
    }
  };

  handleOAuthLogin();
}, [navigate, dispatch]);

  //에러
  const validateForm = () => {
    const newErrors = {};

    if (!email.includes("@") || !email.endsWith(".com")) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (password.length === 0) {
      newErrors.password = "비밀번호를 입력하세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // 기존 데이터 완전 제거
        localStorage.clear();
        dispatch(clearUser());

        const response = await useMemberApi.loginMember({
          email: email,
          password: password,
        });

        console.log("로그인 응답:", response);

        if (response && response.user) {
          dispatch(setUser({ 
            ...response.user, 
            isLogin: true,
          }));
          setAlertMessage("로그인에 성공했습니다!");
          setShowAlert(true);

          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          setAlertMessage("로그인에 실패했습니다.");
          setShowAlert(true);
        }
      } catch (error) {
        console.error("로그인 에러:", error);
        localStorage.clear();
        dispatch(clearUser());
        setAlertMessage("이메일 또는 비밀번호가 일치하지 않습니다.");
        setShowAlert(true);
      }
    }
  };

  // 소셜 로그인 함수
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const handleSocialLogin = (provider) => {
    // 현재 URL을 state로 저장
    sessionStorage.setItem('loginRedirectUrl', window.location.pathname);
    window.location.href = `${baseUrl}/oauth2/authorization/${provider}`;
  };

  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 p-6 z-50">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white/60 w-[60px]">
                e-mail:
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none focus:border-white text-left pl-[60px] leading-normal"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600/80">{errors.email}</p>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white/60">
                password:
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-0 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none focus:border-white pr-8 text-left pl-[83px]"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <VisibilityIcon sx={{ fontSize: 20 }} />
                ) : (
                  <VisibilityOffIcon sx={{ fontSize: 20 }} />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600/80">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors duration-300"
          >
            로그인
          </button>

          <div className="flex items-center justify-center text-sm text-white/60">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="hover:text-white"
            >
              비밀번호 찾기
            </button>
          </div>
          <div className="flex items-center gap-3 justify-center text-sm text-white/60">
            <div className="h-[1px] flex-1 bg-white/30"></div>
            <span>or</span>
            <div className="h-[1px] flex-1 bg-white/30"></div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
              onClick={() => handleSocialLogin("naver")}
            >
              <img
                src="/icons/naver_burron_white.png"
                alt="Naver"
                className="w-6 h-6"
              />
            </button>
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
              onClick={() => handleSocialLogin("google")}
            >
              <img
                src="/icons/google_bueeon@2x.png"
                alt="Google"
                className="w-6 h-6"
              />
            </button>
          </div>

          <div className="text-center text-white/60">
            <a
              href="#"
              onClick={() => navigate("signup/")}
              className="text-white hover:underline"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>

      <CustomAlert
        message={alertMessage}
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
      />

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Login;
