import { useEffect, useState, useRef } from 'react';
import Login from '../Auth/Login';

const HomeBackground = () => {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef([]);

  // Gradient styles for circles
  const gradientStyles = {
    section0: { background: 'linear-gradient(45deg, hsl(0, 67%, 68%), rgb(237, 245, 128))' },
    section1: { background: 'linear-gradient(45deg, #80bad1, #8854b8)' },
    section2: { background: 'linear-gradient(45deg, rgb(237, 245, 128), #74c986)' },
    section3: { background: 'linear-gradient(45deg, #74c986, #80bad1)' },
    section4: { background: 'linear-gradient(45deg, #80bad1, #8854b8)' },
    section5: { background: 'linear-gradient(45deg, #8854b8, #888888)' },
    section6: { background: 'linear-gradient(45deg, #888888, hsl(226, 20%, 17%))' },
    section7: { background: 'linear-gradient(45deg, hsl(226, 20%, 17%), hsl(0, 67%, 68%))' },
    section8: { background: 'linear-gradient(45deg, hsl(0, 67%, 68%), rgb(237, 245, 128))' }
  };

  // Active and hover colors for each section
  const sectionColors = {
    0: { active: 'text-[#ff9b9b]', hover: 'hover:text-[#ff9b9b]' },
    1: { active: 'text-[#f5ed80]', hover: 'hover:text-[#f5ed80]' },
    2: { active: 'text-[#74c986]', hover: 'hover:text-[#74c986]' },
    3: { active: 'text-[#80bad1]', hover: 'hover:text-[#80bad1]' },
    4: { active: 'text-[#8854b8]', hover: 'hover:text-[#8854b8]' },
    5: { active: 'text-[#888888]', hover: 'hover:text-[#888888]' },
    6: { active: 'text-[#292d3e]', hover: 'hover:text-[#292d3e]' },
    7: { active: 'text-[#ff9b9b]', hover: 'hover:text-[#ff9b9b]' },
    8: { active: 'text-[#f5ed80]', hover: 'hover:text-[#f5ed80]' }
  };

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

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'a', type: 'video', label: '' },
    { id: 'b', type: 'image', label: '# 열정', imageUrl: 'src/assets/images/6.jpg' },
    { id: 'c', type: 'image', label: '# 기쁨', imageUrl: 'src/assets/images/2.jpg' },
    { id: 'd', type: 'image', label: '# 안정', imageUrl: 'src/assets/images/3.jpg', fixed: true },
    { id: 'e', type: 'image', label: '# 우울', imageUrl: 'src/assets/images/4.jpg' },
    { id: 'f', type: 'image', label: '# 슬픔', imageUrl: 'src/assets/images/5.jpg' },
    { id: 'g', type: 'image', label: '# 외로움', imageUrl: 'src/assets/images/6.jpg' },
    { id: 'h', type: 'image', label: '# 피곤', imageUrl: 'src/assets/images/7.jpg' },
    { id: 'i', type: 'video', label: 'Login' }
  ];

  // Circle component with Tailwind styles
  const Circle = ({ type, sectionStyle }) => {
    const baseStyles = "absolute left-1/2 top-1/2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500";
    
    const circleStyles = {
      main: "w-full h-full z-30 shadow-lg",
      back: "w-[110%] h-[110%] opacity-60 blur z-20",
      'far-back': "w-[120%] h-[120%] opacity-30 blur-lg z-10"
    };

    return (
      <div 
        className={`${baseStyles} ${circleStyles[type]}`}
        style={sectionStyle}
      />
    );
  };

  return (
    <div className="relative w-full font-['Diphylleia']">
      {/* Title */}
      <h2 className={`fixed left-1/2 top-[10%] z-50 font-bold text-3xl md:text-5xl lg:text-6xl
        transform -translate-x-1/2 opacity-60 transition-colors duration-500 text-center
        ${activeSection === 1 || activeSection === 4 
          ? 'text-fuchsia-300' : 'text-white'}`}>
        Star books
        <hr className="border-b border-current border-opacity-60 mt-1" />
      </h2>

      {/* Sections */}
      {sections.map((section, index) => (
        <div
          key={section.id}
          id={section.id}
          ref={el => sectionsRef.current[index] = el}
          className={`h-screen overflow-hidden ${
            section.type === 'image' 
              ? `bg-cover bg-center ${section.fixed ? 'bg-fixed' : ''}`
              : 'relative bg-black'
          }`}
          style={section.type === 'image' ? { backgroundImage: `url(${section.imageUrl})` } : {}}
        >
          {section.type === 'video' && (
            <>
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto 
                  transform -translate-x-1/2 -translate-y-1/2 object-cover"
              >
                <source src="src/assets/videos/home.mp4" type="video/mp4" />
              </video>
              {index === sections.length - 1 && <Login />}
            </>
          )}
        </div>
      ))}

      {/* Navigation - Hidden on last two sections */}
      {activeSection < sections.length - 2 && (
        <nav className="fixed right-5 top-1/2 transform -translate-y-1/2 z-50">
          {sections.map((section, index) => (
            <div key={section.id} className="mb-4">
              <a
                href={`#${section.id}`}
                onClick={(e) => scrollToSection(e, section.id)}
                className={`relative block transition-colors duration-500 py-1 pr-6
                  ${activeSection === index 
                    ? sectionColors[index]?.active || 'text-white'
                    : `text-white ${sectionColors[index]?.hover || ''}`
                  }`}>
                <div 
                  className={`absolute left-[-20px] top-1/2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 transform -translate-y-1/2 
                    transition-transform duration-500 bg-cover
                    ${activeSection === index ? 'rotate-360' : ''}`}
                  style={{
                    backgroundImage: 'url(/assets/images/3.png)',
                    backgroundPosition: activeSection === index ? '0 16px' : '0 0'
                  }}
                />
                <span className="text-[16px] md:text-[25px] lg:text-[30px] inline-block">{section.label}</span>
              </a>
            </div>
          ))}
        </nav>
      )}

      {/* 3D Circles - Hidden on last two sections */}
      {activeSection < sections.length - 2 && (
        <div className="fixed left-1/2 top-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2"
             style={{ perspective: '1000px' }}>
          <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80"
               style={{ transformStyle: 'preserve-3d' }}>
            <Circle type="far-back" sectionStyle={gradientStyles[`section${activeSection}`]} />
            <Circle type="back" sectionStyle={gradientStyles[`section${activeSection}`]} />
            <Circle type="main" sectionStyle={gradientStyles[`section${activeSection}`]} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeBackground;