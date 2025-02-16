import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SocialRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      localStorage.setItem("accessToken", token);

      const email = new URLSearchParams(window.location.search).get("email");
      const nickname = new URLSearchParams(window.location.search).get(
        "nickname"
      );

      if (email) localStorage.setItem("email", email);
      if (nickname) localStorage.setItem("nickname", nickname);

      window.location.href = "/";
    } else {
      window.location.href = "/";
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-white text-xl">로그인 처리중...</div>
    </div>
  );
};

export default SocialRedirect;
