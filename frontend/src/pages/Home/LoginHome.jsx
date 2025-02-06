import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function LoginHome() {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // 네비게이션 항목 정의 - 5개로 변경
    const navItems = [
        { name: '별자리', angle: 270, path: '../constellation/gallery', delay: 0 },
        { name: '일기장', angle: 324, path: '../diary/write', delay: 0.2 },
        { name: '프로필', angle: 18, path: '../auth/profile', delay: 0.4 },
        { name: '라디오', angle: 72, path: '../diary/stars', delay: 0.6 },
        { name: '포토북', angle: 126, path: '../diary/photos', delay: 0.8 }
    ];

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            {/* 비디오 배경 */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 min-w-full min-h-full object-cover z-0 opacity-80"
            >
                <source src="/src/assets/videos/home.mp4" type="video/mp4" />
            </video>

            {/* 반투명 오버레이 */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10" />

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }

                .planet {
                    transition: all 0.5s ease;
                }

                .planet:hover {
                    transform: scale(1.1);
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
                }

                .connection-line {
                    animation: twinkle 2s infinite ease-in-out;
                }

                .star-logo {
                    animation: fadeIn 1.5s ease-out;
                }
            `}</style>

            {/* 네비게이션 컨테이너 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                {/* 중앙 로고 */}
                <div className="star-logo text-white text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.3em] text-center mb-8">
                    STAR BOOKS
                </div>

                {/* 행성형 네비게이션 */}
                <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                    {/* 연결선 */}
                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 400 400">
                        {navItems.map((item, index) => {
                            const radius = 150;
                            const x = 200 + radius * Math.cos((item.angle * Math.PI) / 180);
                            const y = 200 + radius * Math.sin((item.angle * Math.PI) / 180);
                            return (
                                <line
                                    key={`line-${index}`}
                                    x1="200"
                                    y1="200"
                                    x2={x}
                                    y2={y}
                                    stroke="white"
                                    strokeWidth="0.5"
                                    className="connection-line"
                                    style={{ animationDelay: `${item.delay}s` }}
                                />
                            );
                        })}
                    </svg>

                    {/* 행성 네비게이션 버튼 */}
                    {navItems.map((item, index) => {
                        const radius = 150;
                        const x = radius * Math.cos((item.angle * Math.PI) / 180);
                        const y = radius * Math.sin((item.angle * Math.PI) / 180);

                        return (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`planet absolute left-1/2 top-1/2 text-white 
                                          text-base md:text-lg lg:text-xl
                                          opacity-0 cursor-pointer
                                          ${isLoaded ? 'opacity-100' : ''}`}
                                style={{
                                    transform: `translate(${x}px, ${y}px)`,
                                    transition: `opacity 0.5s ease ${item.delay}s, transform 0.5s ease ${item.delay}s`,
                                }}
                            >
                                <div className="w-3 h-3 rounded-full bg-white/80 mb-2 mx-auto shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                {item.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default LoginHome;