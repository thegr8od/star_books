import { useEffect, useState, useRef } from "react";
import Login from "../Auth/Login";

const HomeBackground = () => {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef([]);
  const starsRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const titleRef = useRef(null);

  // 배경 그라디언트 스타일 수정
  const backgroundStyles = {
    section0: "from-[#0B1437] via-[#1B2B4D] to-[#0B1437]", // 첫 페이지와 동일한 깊은 밤하늘
    section1: "from-[#0B1437] via-[#1B2B4D] to-[#0B1437]", // 깊은 밤하늘 유지
    section2: "from-[#1B2B4D] via-[#2B3F6B] to-[#1B2B4D]", // 조금 더 밝은 밤하늘
    section3: "from-[#2B3F6B] via-[#3B5389] to-[#2B3F6B]", // 새벽녘 하늘
    section4: "from-[#3B5389] via-[#0B1437] to-[#3B5389]", // 다시 어두워지는 하늘
    section5: "from-[#0B1437] via-[#1B2B4D] to-[#0B1437]", // 마지막 페이지 깊은 밤하늘
  };

  // 원의 그라디언트 스타일 수정
  const gradientStyles = {
    section0: { 
      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)",
      boxShadow: "0 0 150px rgba(255,255,255,0.1)"
    },
    section1: { 
      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)",
      boxShadow: "0 0 150px rgba(255,255,255,0.1)"
    },
    section2: { 
      background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0) 100%)",
      boxShadow: "0 0 150px rgba(255,255,255,0.12)"
    },
    section3: { 
      background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)",
      boxShadow: "0 0 150px rgba(255,255,255,0.15)"
    },
    section4: { 
      background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0) 100%)",
      boxShadow: "0 0 150px rgba(255,255,255,0.12)"
    },
    section5: { 
      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)",
      boxShadow: "0 0 150px rgba(255,255,255,0.1)"
    }
  };

  const sectionColors = {
    0: { active: "text-[#FFFFFF]", hover: "hover:text-[#FFFFFF]" }, // 연한 핑크
    1: { active: "text-[#FF8C69]", hover: "hover:text-[#FF8C69]" }, // 살몬핑크
    2: { active: "text-[#FFDAB9]", hover: "hover:text-[#FFDAB9]" }, // 피치
    3: { active: "text-[#98FB98]", hover: "hover:text-[#98FB98]" }, // 연한 초록
    4: { active: "text-[#DDA0DD]", hover: "hover:text-[#DDA0DD]" }, // 연한 보라
    5: { active: "text-[#87CEEB]", hover: "hover:text-[#87CEEB]" }, // 하늘색
    6: { active: "text-[#B0C4DE]", hover: "hover:text-[#B0C4DE]" }, // 연한 회색
    7: { active: "text-[#D3D3D3]", hover: "hover:text-[#D3D3D3]" }, // 밝은 회색
  };

  useEffect(() => {
    if (starsRef.current) {
      const starCount = 200; // 별 개수 증가
      const container = starsRef.current;
      container.innerHTML = "";

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "absolute rounded-full";

        // 별 크기를 더 작게 조정
        const size = Math.random() * 2 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // 반짝임 애니메이션 더 부드럽게
        star.style.animation = `twinkle ${Math.random() * 3 + 3}s infinite ${
          Math.random() * 3
        }s`;
        
        // 별 밝기 조정
        star.style.opacity = Math.random() * 0.5 + 0.3;

        // 별 색상을 더 차분하게
        const colors = ['#ffffff', '#f8f8ff', '#f0f8ff', '#f5f5f5'];
        star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(star);
      }
    }
  }, [activeSection]);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      const winScrollTop = window.scrollY;
      sectionsRef.current.forEach((section, index) => {
        if (!section) return;
        const offsetTop = section.offsetTop;
        const offsetBottom = offsetTop + section.clientHeight;

        if (winScrollTop >= offsetTop && offsetBottom > winScrollTop) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // sections 배열을 다음과 같이 수정
  const sections = [
    { 
      id: "intro", 
      type: "video", 
      label: "# Intro",
      content: {
        title: "당신의 감정을 기록하세요",
        description: "스타북스와 함께 하루하루의 감정을 별처럼 기록해보세요"
      }
    },
    {
      id: "ai-chat",
      type: "image",
      label: "# AI 채팅",
      imageUrl: "/images/chat.jpg",
      content: {
        title: "AI와 함께하는 감정 대화",
        description: "당신의 이야기를 들어줄 준비가 된 AI 친구가 기다리고 있어요"
      }
    },
    {
      id: "radio",
      type: "image",
      label: "# 감정 라디오",
      imageUrl: "/images/radio.jpg",
      content: {
        title: "감정에 어울리는 음악",
        description: "현재 감정에 맞는 음악을 추천받고 다른 사람과 공유해보세요"
      }
    },
    {
      id: "diary",
      type: "image",
      label: "# 감정 일기",
      imageUrl: "/images/diary.jpg",
      content: {
        title: "나만의 감정 달력",
        description: "하루하루 쌓이는 감정을 달력으로 한눈에 확인해보세요"
      }
    },
    {
      id: "universe",
      type: "image",
      label: "# 감정 우주",
      imageUrl: "/images/universe.jpg",
      content: {
        title: "우리들의 감정 우주",
        description: "다른 사람들의 감정을 별자리처럼 둘러보세요"
      }
    },
    { id: "login", type: "video", label: "# Login" }
  ];

  const Circle = ({ type, sectionStyle }) => {
    const baseStyles =
      "absolute left-1/2 top-1/2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500";

    const circleStyles = {
      main: "w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 backdrop-blur-sm z-30",
      back: "w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 opacity-30 z-20",
      "far-back": "w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 opacity-10 z-10",
    };

    return (
      <div
        className={`${baseStyles} ${circleStyles[type]}`}
        style={{
          ...sectionStyle,
          backdropFilter: type === 'main' ? 'blur(8px)' : 'none'
        }}
      />
    );
  };

  // Intersection Observer 설정
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    }, observerOptions);

    // 모든 애니메이션 요소 관찰
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 스크롤 위치에 따른 타이틀 투명도 계산
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 타이틀 투명도 계산
  const titleOpacity = Math.max(0, 1 - scrollPosition / 300);

  return (
    <div className="fixed inset-0 w-full h-full">
      <div className="relative w-full h-full font-['SUIT'] snap-y snap-mandatory overflow-y-scroll 
                      [&::-webkit-scrollbar]:w-[3px] 
                      [&::-webkit-scrollbar-track]:bg-transparent
                      [&::-webkit-scrollbar-thumb]:bg-white/20
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb]:hover:bg-white/30">
        <div
          ref={starsRef}
          className={`fixed inset-0 z-10 overflow-hidden bg-gradient-to-b transition-colors duration-1000 ${
            backgroundStyles[`section${activeSection}`]
          }`}
        />

        {/* STAR BOOKS 타이틀 - 첫 섹션에서만 표시 */}
        {activeSection === 0 && (
          <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-40 text-center w-full">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4
                         tracking-wider animate-titleFadeIn">
              STAR BOOKS
            </h1>
            <div className="flex items-center justify-center gap-4 animate-titleFadeIn animation-delay-300">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-white to-transparent" />
              <div className="text-white/80 text-xl">✧</div>
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-white to-transparent" />
            </div>
          </div>
        )}

        {/* 중앙 장식 요소 - 각 섹션에 따라 다르게 표시 */}
        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20
                        pointer-events-none mix-blend-screen">
          {activeSection === 0 ? (
            // 첫 페이지의 특별한 장식 요소
            <div className="relative">
              <div className="absolute -inset-32 bg-gradient-radial from-white/5 via-white/3 to-transparent
                            animate-pulse" />
              <div className="relative flex items-center justify-center">
                <div className="absolute animate-spin-slow">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-40 w-[1px] origin-bottom"
                      style={{
                        transform: `rotate(${i * 45}deg)`,
                        background: 'linear-gradient(to top, transparent, white)',
                        opacity: 0.2
                      }}
                    />
                  ))}
                </div>
                <div className="text-white text-6xl opacity-30">✧</div>
              </div>
            </div>
          ) : (
            // 다른 섹션들의 장식 요소
            <div className="w-32 h-32 opacity-20 animate-pulse">
              <div className="absolute inset-0 bg-gradient-radial from-white/20 via-white/5 to-transparent" />
            </div>
          )}
        </div>

        {/* Sections */}
        {sections.map((section, index) => (
          <div
            key={section.id}
            id={section.id}
            ref={(el) => (sectionsRef.current[index] = el)}
            className={`h-screen w-full relative snap-start snap-always ${
              section.type === 'image' ? 'bg-cover bg-center' : ''
            }`}
            style={
              section.type === "image"
                ? { backgroundImage: `url(${section.imageUrl})` }
                : {}
            }
          >
            {section.type === "video" ? (
              <div className="relative w-full h-full z-30 flex items-center justify-center">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/videos/home.mp4" type="video/mp4" />
                </video>
                {index === sections.length - 1 ? (
                  <div className="relative z-40 w-full h-full flex items-center justify-center">
                    <div className="w-full max-w-md">
                      <Login />
                    </div>
                  </div>
                ) : (
                  <div className="relative z-40 w-full max-w-4xl mx-auto px-4">
                    <div className="text-center text-white">
                      <h2 className="animate-on-scroll opacity-0 transition-opacity duration-1000 ease-out 
                                  text-4xl md:text-5xl lg:text-6xl mb-6 font-bold tracking-wide">
                        {section.content.title}
                      </h2>
                      <p className="animate-on-scroll opacity-0 transition-opacity duration-1000 delay-300 ease-out 
                                 text-xl md:text-2xl lg:text-3xl opacity-90 font-normal leading-relaxed">
                        {section.content.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
                <div className="w-full max-w-4xl mx-auto px-4">
                  <div className="text-center text-white">
                    <h2 className="animate-on-scroll opacity-0 transition-opacity duration-1000 ease-out 
                                text-4xl md:text-5xl lg:text-6xl mb-6 font-bold tracking-wide">
                      {section.content.title}
                    </h2>
                    <p className="animate-on-scroll opacity-0 transition-opacity duration-1000 delay-300 ease-out 
                               text-xl md:text-2xl lg:text-3xl opacity-90 font-normal leading-relaxed">
                      {section.content.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Navigation */}
        {activeSection < sections.length - 2 && (
          <nav className="fixed right-3 top-[55%] transform -translate-y-1/2 z-50 drop-shadow-lg">
            {sections.map((section, index) => (
              <div key={section.id} className="mb-4">
                <a
                  href={`#${section.id}`}
                  onClick={(e) => scrollToSection(e, section.id)}
                  className={`relative block transition-colors duration-500 py-1 pr-6 font-medium tracking-wide
                    ${
                      activeSection === index
                        ? sectionColors[index]?.active || "text-white"
                        : `text-white/70 hover:text-white ${sectionColors[index]?.hover || ""}`
                    }`}
                >
                  <div
                    className={`absolute left-[-20px] top-1/2 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transform -translate-y-1/2  
                      transition-transform duration-500 bg-cover
                      ${activeSection === index ? "rotate-360" : ""}`}
                  />
                  <span className="text-[13px] md:text-[17px] lg:text-[20px] inline-block">
                    {section.label}
                  </span>
                </a>
              </div>
            ))}
          </nav>
        )}

        {/* 3D Circles */}
        {activeSection < sections.length - 1 && (
          <div
            className="fixed left-1/2 top-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 animate-[fade_2s_ease-in-out_infinite] opacity-85"
            style={{ perspective: "1000px" }}
          >
            <div
              className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Circle
                type="far-back"
                sectionStyle={gradientStyles[`section${activeSection}`]}
              />
              <Circle
                type="back"
                sectionStyle={gradientStyles[`section${activeSection}`]}
              />
              <Circle
                type="main"
                sectionStyle={gradientStyles[`section${activeSection}`]}
              />
            </div>
          </div>
        )}

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.2; }
          }

          .animate-on-scroll.show {
            opacity: 1;
          }

          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }

          @keyframes titleFadeIn {
            0% { 
              opacity: 0; 
              transform: translateY(-30px);
            }
            100% { 
              opacity: 1; 
              transform: translateY(0);
            }
          }

          .animate-titleFadeIn {
            animation: titleFadeIn 1.5s ease-out forwards;
          }

          .animation-delay-300 {
            animation-delay: 300ms;
          }
        `}</style>
      </div>
    </div>
  );
};

export default HomeBackground;
