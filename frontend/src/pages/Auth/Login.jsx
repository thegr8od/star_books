import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../.././data/users';
import Button from '../../components/Button';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const user = users.find(
        user => user.email === email && user.password === password
      );
      
      if (user) {
        setLoginStatus('success');
        console.log('로그인 성공!');
        // 로그인 성공 시 홈 화면으로 이동
        setTimeout(() => {
          navigate('/starbooks/diary/calendar');
        }, 500); // 성공 메시지를 잠깐 보여주기 위해 0.5초 후 이동
      } else {
        setLoginStatus('error');
      }
    }
  };

  const handleSignUp = () => {
    navigate('/starbooks/signup');
  };

  return (
    
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow">        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-white/90 text-sm">
                  email:
                </span>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 block w-full pl-16 text-sm rounded-md shadow-sm p-2 text-white/90"
                  placeholder="starbooks@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600/80">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-white/90 text-sm">
                  password:
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 block w-full pl-24 rounded-md shadow-sm p-2 text-white/90"
                  placeholder=""
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600/80">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-evenly">
            <Button
              imgSrc='../.././icons/google.png'
              type='PREV'
              className="bg-white/80 px-1 py-1 rounded-full mx-1 sm:mx-3"
            />
            <Button
              text='로그인'
              type='NEXT'
              className="bg-white/10 px-6 sm:px-12 py-2 mx-1 rounded-lg text-sm font-normal text-white/80 hover:bg-white/20"
            />
            <Button
              text='회원가입'
              type='NEXT'
              className="bg-white/10 px-10 sm:px-15 py-2 rounded-lg text-sm font-normal text-white/80 hover:bg-white/20"
              onClick={handleSignUp}
            />
          </div>
        </form>

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
      </div>
   
  );
};

export default Login;