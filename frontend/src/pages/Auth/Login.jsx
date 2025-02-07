import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginStatus, setLoginStatus] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.includes('@') || !email.endsWith('.com')) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    
    if (password.length < 5) {
      newErrors.password = '비밀번호는 5자리 이상이어야 합니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = await axios.post('/api/member/login', {
          email: email,
          password: password
        });

        if (response.data.statusCode === 200) {
          setLoginStatus('success');
          console.log(response.data.message);
          
          // 세션 스토리지에 사용자 정보 저장
          sessionStorage.setItem('accessToken', response.data.data.accessToken);
          sessionStorage.setItem('email', response.data.data.user.email);
          sessionStorage.setItem('nickname', response.data.data.user.nickname);
          
          // 로그인 성공 후 홈으로 리다이렉션
          setTimeout(() => {
            navigate('/');
          }, 500);
        }
      } catch (error) {
        console.error('로그인 에러:', error);
        setLoginStatus('error');
        
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          console.error(errorData.message);
        }
      }
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 p-6 z-50">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white/60">e-mail:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-0 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none focus:border-white text-left pl-[60px]"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600/80">{errors.email}</p>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white/60">password:</span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-0 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none focus:border-white pr-8 text-left pl-[83px]"
            />
            <button 
              type="button" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <img src="/icons/show.png" alt="Show password" className="h-5 w-5 opacity-60" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600/80">{errors.password}</p>
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
          <button type="button" className="hover:text-white">아이디/비밀번호 찾기</button>
        </div>
        <div className="flex items-center gap-3 justify-center text-sm text-white/60">
          <div className="h-[1px] flex-1 bg-white/30"></div>
          <span>or</span>
          <div className="h-[1px] flex-1 bg-white/30"></div>
        </div>

        <div className="flex justify-center space-x-4">
          <button type="button" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
            <img src="/icons/naver_burron_white.png" alt="Naver" className="w-6 h-6" />
          </button>
          <button type="button" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
            <img src="/icons/google_bueeon@2x.png" alt="Google" className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center text-white/60">
          <a 
            href="#" 
            onClick={() => navigate('signup/')} 
            className="text-white hover:underline"
          >
            Sign up
          </a>
        </div>

        {loginStatus === 'success' && (
          <div className="mt-4 p-4 rounded-md bg-white/30 border border-green-500/50">
            <p className="text-green-200 font-medium text-sm">로그인 성공!</p>
          </div>
        )}
        
        {loginStatus === 'error' && (
          <div className="mt-4 p-4 rounded-md bg-white/30 border border-red-500/50">
            <p className="text-red-200 font-medium text-sm">이메일 또는 비밀번호가 일치하지 않습니다.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;