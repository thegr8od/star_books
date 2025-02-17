import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/member/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 시 저장한 키와 동일한 키를 제거
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("nickname");
        
        // 홈페이지로 이동
        navigate("/");
      } else {
        // 에러 처리
        console.error("로그아웃 실패:", data.message);
        alert("로그아웃 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("로그아웃 요청 중 오류 발생:", error);
      alert("로그아웃 처리 중 오류가 발생했습니다.");
    }
  };
  
  return (
    <div className="user-profile">
      <div className="user-logout-btn-container">
        <button className="user-logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Logout;