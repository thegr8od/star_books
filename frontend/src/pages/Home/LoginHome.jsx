import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function LoginHome() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 네비게이션 항목 정의 - 72도 간격으로 배치
  const navItems = [
    { name: "AI채팅", angle: 270, path: "chat", delay: 0 },
    { name: "라디오", angle: 342, path: "radio", delay: 0.2 },
    { name: "캘린더", angle: 54, path: "diary/calendar", delay: 0.4 },
    { name: "나의별", angle: 126, path: "diary/stars", delay: 0.6 },
    { name: "우리별", angle: 198, path: "universe", delay: 0.8 },
  ];

  const radius = 150; // 선과 점의 위치를 동일하게 설정

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 min-w-full min-h-full object-cover z-0 opacity-80"
      >
        <source src=" /videos/home.mp4.mp4" type="video/mp4" />
      </video>

      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* 메인 컨텐츠 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div
          className="text-white text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.3em] text-center mb-8 
                             opacity-0 animate-[fadeIn_1.5s_ease-out_forwards]"
        >
          STAR BOOKS
        </div>

        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid meet"
          >
            {navItems.map((item) => {
              const x = 200 + radius * Math.cos((item.angle * Math.PI) / 180);
              const y = 200 + radius * Math.sin((item.angle * Math.PI) / 180);
              return (
                <line
                  key={item.name}
                  x1="200"
                  y1="200"
                  x2={x}
                  y2={y}
                  stroke="white"
                  strokeWidth="0.5"
                  className="animate-[twinkle_2s_infinite_ease-in-out]"
                  style={{ animationDelay: `${item.delay}s` }}
                />
              );
            })}
          </svg>

          {navItems.map((item) => {
            const x = radius * Math.cos((item.angle * Math.PI) / 180);
            const y = radius * Math.sin((item.angle * Math.PI) / 180);

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`absolute left-[43%] top-1/2 text-white 
                                          text-base md:text-lg lg:text-xl
                                          opacity-0 cursor-pointer
                                          transition-all duration-500 ease-in-out
                                          hover:scale-110 hover:text-shadow-lg
                                          ${isLoaded ? "opacity-100" : ""}`}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  transitionDelay: `${item.delay}s`,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-white/80 mx-auto shadow-white/80" />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }
            `}</style>
    </div>
  );
}

export default LoginHome;
