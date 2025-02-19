import { useEffect, useState, useRef } from "react";
import Login from "../Auth/Login";

const HomeBackground = () => {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef([]);
  const starsRef = useRef(null);

  // 원의 그라디언트 스타일 (기존 유지)
  const gradientStyles = {
    section0: { background: "linear-gradient(45deg,  #FFD700,  #FFB6C1)" }, // 연한 핑크와 부드러운 골드
    section1: {
      background: "linear-gradient(45deg, #FFA07A, #FF8C69, #FFFFFF)",
    }, // 살몬핑크, 연한 살몬, 흰색
    section2: { background: "linear-gradient(45deg, #FFD700, #FFDAB9)" }, // 골드와 피치
    section3: { background: "linear-gradient(45deg, #FFA07A, #98FB98)" }, // 살몬과 연한 초록
    section4: { background: "linear-gradient(45deg, #98FB98, #DDA0DD)" }, // 연한 초록과 연한 보라
    section5: { background: "linear-gradient(45deg, #DDA0DD, #87CEEB)" }, // 연한 보라와 하늘색
    section6: { background: "linear-gradient(45deg, #87CEEB, #B0C4DE)" }, // 하늘색과 연한 회색
    section7: { background: "linear-gradient(45deg, #B0C4DE, #D3D3D3)" }, // 연한 회색과 밝은 회색
  };

  // 각 섹션별 대비되는 배경색 설정
  const backgroundStyles = {
    section0: "from-black via-[#FFB6C133] to-black", // 연한 핑크 그라데이션
    section1: "from-black via-[#FF8C6933] to-black", // 살몬핑크 그라데이션
    section2: "from-black via-[#FFD70033] to-black", // 골드 그라데이션
    section3: "from-black via-[#FFA07A33] to-black", // 살몬 그라데이션
    section4: "from-black via-[#98FB9833] to-black", // 연한 초록 그라데이션
    section5: "from-black via-[#DDA0DD33] to-black", // 연한 보라 그라데이션
    section6: "from-black via-[#87CEEB33] to-black", // 하늘색 그라데이션
    section7: "from-black via-[#B0C4DE33] to-black", // 연한 회색 그라데이션
    section8: "from-black via-[#FFB6C133] to-black", // 연한 회색 그라데이션
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
  }, [activeSection]); // activeSection이 변경될 때마다 별들 재생성

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

  // sections 배열 업데이트
  const sections = [
    {
      id: "intro",
      type: "video",
      label: "# 별에 별 일",
      content: {
        title: "당신의 감정을 기록하세요",
        description: "스타북스와 함께 하루하루의 감정을 별처럼 기록해보세요",
        details: [
          {
            title: "감정 기록의 새로운 방법",
            description:
              "텍스트, 이미지, 음성 등 다양한 방식으로 감정을 기록하세요",
            icon: "📝",
          },
          {
            title: "나만의 감정 달력",
            description: "하루하루 기록된 감정을 달력으로 한눈에 확인하세요",
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
        title: "내 감정이 그리는 별자리",
        description: "감정이 별이 되고, 그 별들로 나만의 별자리를 만들어봐요.",
        features: [
          {
            title: "감정 별자리 생성",
            description: "기록된 감정은 자동으로 별자리로 변환됩니다",
            animation: "star-constellation",
          },
          {
            title: "감정 분석 리포트",
            description: "월간, 연간 감정 변화를 한눈에 파악하세요",
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
        title: "감정이 빛나는 우주",
        description:
          "사람들의 감정이 빛나는 행성을 둘러보며, 그 속에서 나의 감정도 함께 어우러지는 순간을 느껴보세요.",
      },
    },
    {
      id: "ai-chat",
      type: "image",
      label: "# AI 채팅",
      imageUrl: "/images/3.jpg",
      fixed: true,
      content: {
        title: "AI와 함께하는 대화",
        description:
          "당신의 이야기를 들어줄 준비가 된 AI 친구가 기다리고 있어요",
      },
    },
    {
      id: "radio",
      type: "image",
      label: "# AI 별자리",
      imageUrl: "/images/4.jpg",
      content: {
        title: "추억을 담은 나만의 별자리",
        description: "소중한 사진을 AI로 분석해 특별한 별자리로 만들어보세요.",
      },
    },
    { id: "i", type: "video" },
  ];

  const Circle = ({ type, sectionStyle }) => {
    const baseStyles =
      "absolute left-1/2 top-1/2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-110";
    const circleStyles = {
      main: "w-full h-full z-30 shadow-lg cursor-pointer flex items-center justify-center",
      back: "w-[110%] h-[110%] opacity-60 blur z-20",
      "far-back": "w-[120%] h-[120%] opacity-30 blur-lg z-10",
    };

    return (
      <div
        className={`${baseStyles} ${circleStyles[type]}`}
        style={sectionStyle}
      >
        {type === "main" && sections[activeSection].content && (
          <div className="text-center text-white p-4 md:p-6 lg:p-8">
            <h3 className="text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 lg:mb-4 font-bold">
              {sections[activeSection].content.title}
            </h3>
            <p className="text-sm md:text-base lg:text-lg">
              {sections[activeSection].content.description}
            </p>
          </div>
        )}
      </div>
    );
  };

  // 섹션 컨텐츠 렌더링 컴포넌트
  const SectionContent = ({ content, isActive }) => {
    if (!content) return null;

    return (
      <div
        className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
        w-full max-w-4xl px-6 text-white ${
          isActive ? "opacity-100" : "opacity-0"
        } 
        transition-opacity duration-500`}
      >
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          {content.title}
        </h3>
        <p className="text-xl md:text-2xl mb-12">{content.description}</p>

        {content.details && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.details.map((detail, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 
                transform hover:scale-105 transition-transform duration-300"
              >
                <div className="text-3xl mb-4">{detail.icon}</div>
                <h4 className="text-xl font-bold mb-2">{detail.title}</h4>
                <p className="text-gray-200">{detail.description}</p>
              </div>
            ))}
          </div>
        )}

        {content.features && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg 
                bg-gradient-to-r from-white/5 to-white/10 p-6"
              >
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-200">{feature.description}</p>
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
              font-family: '양진체';
              src: url('https://fastly.jsdelivr.net/gh/supernovice-lab/font@0.9/yangjin.woff') format('woff');
              font-weight: normal;
              font-style: normal;
          }
        `}
      </style>
      <div className="relative w-full">
        {/* Stars background */}
        <div
          ref={starsRef}
          className={`fixed inset-0 z-10 overflow-hidden bg-gradient-to-b transition-colors duration-1000 ${
            backgroundStyles[`section${activeSection}`]
          }`}
        />

        {/* Title */}
        <h2
          className={`fixed left-1/2 top-[10%] z-50 text-3xl md:text-5xl lg:text-6xl
          transform -translate-x-1/2 opacity-60 transition-colors duration-500 text-center drop-shadow-lg
          ${sectionColors[activeSection]?.active || "text-white"}`}
        >
          <img
            src="/icons/Logo.svg"
            alt="STARBOOKS"
            className="logo-animation w-64 md:w-72 lg:w-80 h-auto mx-auto"
          />
        </h2>
        {/* Join Button */}
        {activeSection < sections.length - 1 && ( // 마지막 섹션(로그인)이 아닐 때만 보이도록
          <button
            onClick={() => scrollToSection({ preventDefault: () => {} }, "i")}
            className={`fixed right-8 md:right-12 lg:right-16 top-[10%] z-50
    px-4 py-2 rounded-full border border-current 
    hover:bg-white/10 transition-colors duration-300
    text-sm lg:text-base font-['양진체']
    ${sectionColors[activeSection]?.active || "text-white"}`}
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
            className={`relative h-screen overflow-hidden ${
              section.type === "image"
                ? `bg-cover bg-center ${section.fixed ? "bg-fixed" : ""}`
                : "relative"
            }`}
            style={
              section.type === "image"
                ? { backgroundImage: `url(${section.imageUrl})` }
                : {}
            }
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

            {/* Add content overlay */}
            <div className="absolute inset-0 bg-black/50" />
            <SectionContent
              content={section.content}
              isActive={activeSection === index}
            />
          </div>
        ))}

        {/* Navigation */}
        {activeSection < sections.length - 1 && (
          <nav className="fixed right-3 top-[55%] transform -translate-y-1/2 z-50 drop-shadow-lg animate-[pulse_5s_ease-in-out_infinite] font-['양진체']">
            {sections.map((section, index) => (
              <div key={section.id} className="mb-4">
                <a
                  href={`#${section.id}`}
                  onClick={(e) => scrollToSection(e, section.id)}
                  className={`relative block transition-colors duration-500 py-1 pr-6
                    ${
                      activeSection === index
                        ? sectionColors[index]?.active || "text-white"
                        : `text-white ${sectionColors[index]?.hover || ""}`
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

        {/* 3D Circles*/}
        {/* {activeSection < sections.length - 1 && (
          <div
            className="fixed left-1/2 top-1/2 lg:top-[58%] z-20 transform -translate-x-1/2 -translate-y-1/2 animate-[fade_2s_ease-in-out_infinite] opacity-85 font-['양진체']"
            style={{ perspective: "1000px" }}
          >
            <div
              className="relative w-48 h-48 md:w-80 md:h-80 lg:w-96 lg:h-96"
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
        )} */}

        <style>
          {`
          @font-face {
            font-family: '양진체';
            src: url('https://fastly.jsdelivr.net/gh/supernovice-lab/font@0.9/yangjin.woff') format('woff');
            font-weight: normal;
            font-style: normal;
          }
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
       @keyframes glow {
            0%, 100% { 
              filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))
                     drop-shadow(0 0 4px rgba(255, 255, 255, 0.3));
            }
            50% { 
              filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.7))
                     drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))
                     drop-shadow(0 0 12px rgba(255, 255, 255, 0.2));
            }
          }
          .logo-animation {
            animation: float 6s ease-in-out infinite, glow 3s ease-in-out infinite;
            opacity: 1;
          }
      `}
        </style>
      </div>
    </>
  );
};

export default HomeBackground;
