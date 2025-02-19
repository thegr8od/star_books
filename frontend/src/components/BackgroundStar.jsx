import { useEffect, useRef } from 'react';

const BackgroundStar = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // 별 개수 
    const starCount = 30;

    const colors = [
      'hsla(350, 100%, 88%, 0.8)', // 파스텔 핑크
      'hsla(280, 100%, 88%, 0.8)', // 파스텔 퍼플
      'hsla(200, 100%, 88%, 0.8)', // 파스텔 블루
      'hsla(180, 100%, 88%, 0.8)', // 파스텔 민트
      'hsla(60, 100%, 88%, 0.8)',  // 파스텔 옐로우
      'hsla(0, 0%, 100%, 0.8)',    // 화이트
    ];

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'absolute rounded-full';
      
      // (0.5px - 2px)
      const size = Math.random() * 1.5 + 0.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // 가장자리에 더 많은 별들이 위치하도록 
      let x, y;
      if (Math.random() < 0.9) { // 70%의 별들은 가장자리에 위치
        if (Math.random() < 0.1) {
          // 좌우 가장자리
          x = Math.random() < 0.5 ? Math.random() * 20 : 80 + Math.random() * 20;
          y = Math.random() * 100;
        } else {
          // 상하 가장자리
          x = Math.random() * 100;
          y = Math.random() < 0.5 ? Math.random() * 20 : 80 + Math.random() * 20;
        }
      } else { // 10%의 별들은 중앙 영역에 랜덤하게 위치
        x = 20 + Math.random() * 60;
        y = 20 + Math.random() * 60;
      }
      
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      
      // 애니메이션 속도와 딜레이
      const duration = Math.random() * 4 + 2; // 2-6초
      const delay = Math.random() * 5;
      star.style.animation = `twinkle ${duration}s ease-in-out infinite ${delay}s, 
                            colorChange ${Math.random() * 10 + 5}s ease-in-out infinite ${Math.random() * 5}s,
                            pulse ${Math.random() * 3 + 4}s ease-in-out infinite ${Math.random() * 3}s`;
      
      // 랜덤 색상 선택
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      star.style.backgroundColor = randomColor;
      star.style.boxShadow = `0 0 ${size * 2}px ${randomColor}`;
      
      container.appendChild(star);
    }
  }, []);

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none">
        <style>
          {`
            @keyframes twinkle {
              0%, 100% { opacity: 0.1; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.2); }
            }
            
            @keyframes colorChange {
              0%, 100% { filter: hue-rotate(0deg); }
              50% { filter: hue-rotate(30deg); }
            }

            @keyframes pulse {
              0%, 100% { transform: translate(0, 0); }
              25% { transform: translate(2px, 1px); }
              50% { transform: translate(-1px, -1px); }
              75% { transform: translate(-2px, 1px); }
            }
          `}
        </style>
      </div>
    </>
  );
};

export default BackgroundStar;