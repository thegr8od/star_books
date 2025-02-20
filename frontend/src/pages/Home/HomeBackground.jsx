import { useEffect, useState, useRef } from "react";
import Login from "../Auth/Login";
import Lottie from "lottie-react";
import astronaut from "../../../public/lottie/astronaut.json";

const HomeBackground = () => {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef([]);
  const starsRef = useRef(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  // 각 섹션별 대비되는 배경색 설정
  const backgroundStyles = {
    section0: "from-black via-[] to-black", // 연한 핑크 그라데이션
    section1: "from-black via-[] to-black", // 살몬핑크 그라데이션
    section2: "from-black via-[] to-black", // 골드 그라데이션
    section3: "from-black via-[] to-black", // 살몬 그라데이션
    section4: "from-black via-[] to-black", // 연한 초록 그라데이션
    section5: "from-black via-[] to-black", // 연한 보라 그라데이션
    section6: "from-black via-[] to-black", // 하늘색 그라데이션
    section7: "from-black via-[] to-black", // 연한 회색 그라데이션
    section8: "from-black via-[] to-black", // 연한 회색 그라데이션
  };

  // stars effect
  useEffect(() => {
    if (starsRef.current) {
      const starCount = 200;
      const container = starsRef.current;
      container.innerHTML = "";

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "absolute rounded-full";
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite ${
          Math.random() * 2
        }s`;
        star.style.opacity = Math.random();
        star.style.backgroundColor =
          Math.random() > 0.5 ? "#ffffff" : "#ffffd9";
        container.appendChild(star);
      }
    }
  }, [activeSection]);

  // 스크롤 이벤트 핸들러 수정
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        const sectionIndex = Math.round(scrollPosition / windowHeight);

        isScrolling.current = true;

        sectionsRef.current[sectionIndex]?.scrollIntoView({
          behavior: "smooth",
        });
        setActiveSection(sectionIndex);

        // 스크롤 애니메이션이 끝난 후 isScrolling 플래그 해제
        setTimeout(() => {
          isScrolling.current = false;
        }, 1000);
      }, 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Join 버튼 클릭 핸들러 수정
  const handleJoinClick = () => {
    const loginSection = sectionsRef.current[sections.length - 1];
    if (loginSection) {
      isScrolling.current = true;
      loginSection.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sections.length - 1);
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    }
  };

  // sections 배열 업데이트
  const sections = [
    {
      id: "intro",
      type: "video",
      label: "# 별에 별 일",
      content: {
        title: "당신만의 감정 우주를 시작하세요",
        description:
          "하루하루의 감정을 별빛처럼 반짝이는 이야기로 기록해보세요",
        details: [
          {
            title: "나만의 감정 스토리",
            description:
              "매일의 감정이 하나의 별이 되어 당신만의 이야기를 만들어갑니다.",
            icon: "✨",
          },
          {
            title: "감정의 흐름 돌아보기",
            description: "시간의 흐름 속에서 변화하는 나의 감정을 발견하세요.",
            icon: "📅",
          },
        ],
      },
    },
    {
      id: "my-universe",
      type: "image",
      label: "# 나의 우주",
      imageUrl: "/images/6.jpg",
      content: {
        title: "일기로 만드는 나만의 별자리",
        description:
          "하나하나의 일기가 모여 특별한 의미를 가진 별자리가 됩니다.",
        features: [
          {
            title: "자유로운 별자리 디자인",
            description:
              "모은 별들을 원하는 모양으로 배치하여 나만의 이야기를 담아보세요.",
            animation: "star-constellation",
          },
          {
            title: "감정 패턴 인사이트",
            description: "시각화된 데이터로 나의 감정 흐름을 이해해보세요.",
            animation: "report-analysis",
          },
        ],
      },
    },
    {
      id: "our-universe",
      type: "image",
      label: "# 우리의 우주",
      imageUrl: "/images/2.jpg",
      content: {
        title: "함께 빛나는 감정의 공간",
        description:
          "수많은 이야기가 담긴 별들이 모여 만드는 아름다운 행성을 경험하세요.\n당신의 이야기도 이 곳에서 반짝이게 될 거예요.",
        lottieAnimation: true,
      },
    },
    {
      id: "ai-chat",
      type: "image",
      label: "# AI 채팅",
      imageUrl: "/images/3.jpg",
      content: {
        title: "마음을 나누는 특별한 대화",
        description:
          "당신의 감정을 이해하고 공감하는 AI 친구와 함께\n 깊이 있는 대화를 나눠보세요.",
      },
    },
    {
      id: "ai-constellation",
      type: "image",
      label: "# AI 별자리",
      // imageUrl: "/images/4.jpg",
      photo: "images/lighthouse.jpg",
      overlayImage: "/images/lighthouse2.png",
      content: {
        title: "사진 속 추억을 별자리로",
        description:
          "소중한 순간이 담긴 사진을 AI가 분석하여\n 유니크한 별자리 패턴으로\n 재해석해드립니다.",
      },
    },
    { id: "login", type: "video" },
  ];

  // 섹션 컨텐츠 렌더링 컴포넌트
  const SectionContent = ({ content, isActive, sectionId }) => {
    if (!content) return null;

    return (
      <div
        className={`absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 
      w-full max-w-5xl px-6 text-white ${
        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } 
      transition-all duration-700 ease-out`}
      >
        <h3
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 
        tracking-tight leading-tight animate-slideUp font-['SBAggroB']"
        >
          {content.title}
        </h3>
        <p
          className="text-xl md:text-2xl lg:text-3xl mb-12 text-white/90 
        font-light leading-relaxed animate-slideUp animation-delay-200 whitespace-pre-line font-['SBAggroM']"
        >
          {content.description}
        </p>

        {/* AI Chat section icons */}
        {sectionId === "ai-chat" && (
          <div className="flex flex-row items-center justify-center gap-8 mt-16">
            {[
              { src: "/images/NAVY.png", delay: 0 },
              { src: "/images/BLUE.png", delay: 200 },
              { src: "/images/RED.png", delay: 400 },
              { src: "/images/PINK.png", delay: 600 },
              { src: "/images/GREEN.png", delay: 800 },
            ].map((icon, index) => (
              <div
                key={index}
                className={`w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40
                  ${isActive ? "animate-bounceIn" : "opacity-0"}
                `}
                style={{
                  animationDelay: `${icon.delay}ms`,
                }}
              >
                <img
                  src={icon.src}
                  alt={`AI Character ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        )}

        {/* our-universe 섹션일 때만 Lottie 표시 */}
        {content.lottieAnimation && (
          <div className="relative w-full flex items-center justify-end animate-slideUp animation-delay-400 mt-4 pr-20">
            <div className="w-70 h-70 md:w-80 md:h-80 lg:w-100 lg:h-100">
              <Lottie
                animationData={astronaut}
                loop={true}
                autoplay={true}
                className="w-full h-full"
                rendererSettings={{
                  preserveAspectRatio: "xMidYMid meet",
                }}
              />
            </div>
          </div>
        )}
        {content.details && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideUp animation-delay-400">
            {content.details.map((detail, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 
                transform hover:scale-105 transition-all duration-500 hover:bg-white/15"
              >
                <div className="text-4xl mb-6">{detail.icon}</div>
                <h4 className="text-2xl font-bold mb-4 font-['SBAggroM']">
                  {detail.title}
                </h4>
                <p className="text-lg text-white/80 leading-relaxed font-['SBAggroL']">
                  {detail.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {content.features && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 animate-slideUp animation-delay-400">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl 
                bg-gradient-to-r from-white/10 to-white/5 p-8
                transform hover:scale-105 transition-all duration-500
                hover:bg-white/15"
              >
                <h4 className="text-2xl font-bold mb-4 font-['SBAggroM']">
                  {feature.title}
                </h4>
                <p className="text-lg text-white/80 leading-relaxed font-['SBAggroL']">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'SBAggroB';
            src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroB.woff') format('woff');
            font-weight: normal;
            font-style: normal;
        }
            
        @font-face {
            font-family: 'SBAggroM';
            src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroM.woff') format('woff');
            font-weight: normal;
            font-style: normal;
        }
        
        @font-face {
          font-family: 'SBAggroL';
          src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroL.woff') format('woff');
          font-weight: normal;
          font-style: normal;
        }
          
          html {
            scroll-snap-type: y mandatory;
            scroll-behavior: smooth;
            height: 100%;
          }

          body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          #root {
            width: 100%;
            overflow-x: hidden;
          }

          .section {
            scroll-snap-align: start;
            scroll-snap-stop: always;
            height: 100vh;
            width: 100%;
            position: relative;
            overflow: hidden;
          }

          /* 스크롤바 스타일링 */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }

          /* 섹션 트랜지션 */
          .section-content {
            transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          }

          .section-content.hidden {
            opacity: 0;
            transform: translateY(20px);
          }

          .section-content.visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* 모바일 최적화 */
          @media (max-width: 768px) {
            html {
              scroll-snap-type: y proximity;
            }
          }

          @keyframes twinkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
          
          @keyframes glow {
            0%, 100% { 
              filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))
                     drop-shadow(0 0 20px rgba(255, 255, 255, 0.4))
                     drop-shadow(0 0 30px rgba(255, 255, 255, 0.2));
            }
            50% { 
              filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.9))
                     drop-shadow(0 0 30px rgba(255, 255, 255, 0.5))
                     drop-shadow(0 0 45px rgba(255, 255, 255, 0.3));
                     
            }
          }
          
          .logo-animation {
            animation: float 6s ease-in-out infinite, glow 3s ease-in-out infinite;
            opacity: 0.95;
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-slideUp {
            animation: slideUp 0.8s ease-out forwards;
          }
          
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          
          .animation-delay-400 {
            animation-delay: 0.4s;
          }

          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: translateY(40px) scale(0.3);
            }
            50% {
              transform: translateY(-20px) scale(1.1);
            }
            70% {
              transform: translateY(10px) scale(0.9);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .animate-bounceIn {
            animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          }
        `}
      </style>
      <div className="relative w-full overflow-hidden">
        {/* Stars background */}
        <div
          ref={starsRef}
          className={`fixed inset-0 z-10 overflow-hidden bg-gradient-to-b transition-colors duration-1000 ${
            backgroundStyles[`section${activeSection}`]
          }`}
        />

        {/* Title with enhanced visibility */}
        <h2
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveSection(0);
          }}
          className="fixed left-1/2 top-[10%] z-50 transform -translate-x-1/2 text-center cursor-pointer"
        >
          <img
            src="/icons/Logo.svg"
            alt="STARBOOKS"
            className="logo-animation w-64 md:w-72 lg:w-80 h-auto mx-auto
            drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
          />
        </h2>
        {/* Join Button */}
        {activeSection < sections.length - 1 && (
          <button
            onClick={handleJoinClick}
            className="fixed right-8 md:right-12 lg:right-16 top-[10%] z-50
              px-4 py-2 rounded-full border border-current 
              hover:bg-white/10 transition-colors duration-300
              text-sm lg:text-base font-['양진체']
              text-white"
          >
            Join
          </button>
        )}

        {/* Sections with enhanced content */}
        {sections.map((section, index) => (
          <div
            key={section.id}
            id={section.id}
            ref={(el) => (sectionsRef.current[index] = el)}
            className="section"
            style={{
              ...(section.type === "image" && {
                backgroundImage: `url(${section.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }),
            }}
          >
            {section.type === "video" && (
              <>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute top-0 left-0 w-full h-full object-cover"
                >
                  <source src="/videos/home.mp4" type="video/mp4" />
                </video>
                {index === sections.length - 1 && <Login />}
              </>
            )}

            {/* Add base and overlay images for ai-constellation section */}
            {section.id === "ai-constellation" && (
              <div className="absolute inset-0 flex items-center justify-center space-x-14">
                <div className="relative w-[300px] h-[400px] group">
                  <img
                    src={section.photo}
                    alt="Original"
                    className="w-full h-full object-cover rounded-lg shadow-lg 
                    transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg" />
                </div>

                <div className="relative w-[300px] h-[400px] group">
                  <img
                    src={section.overlayImage}
                    alt="AI Constellation"
                    className={`w-full h-full object-cover rounded-lg shadow-lg 
                    transition-all duration-1000 group-hover:scale-105
                    ${
                      activeSection ===
                      sections.findIndex((s) => s.id === "ai-constellation")
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg" />
                </div>
              </div>
            )}

            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/50" />
            <SectionContent
              content={section.content}
              isActive={activeSection === index}
              sectionId={section.id}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default HomeBackground;
