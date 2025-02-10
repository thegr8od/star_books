//Cursor.jsx

import { useEffect, useState, useRef } from "react";

const Cursor = () => {
  const [isClicked, setIsClicked] = useState(false);
  const cursorRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const speed = 0.09;
  const rafRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // 현재 스크롤 위치를 고려한 좌표 계산
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      positionRef.current = {
        x: e.clientX + scrollX, // clientX에 스크롤 위치를 더함
        y: e.clientY + scrollY, // clientY에 스크롤 위치를 더함
      };
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const animate = () => {
      if (!cursorRef.current) return;

      // 현재 스크롤 위치를 고려하여 transform 적용
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      targetRef.current.x +=
        (positionRef.current.x - targetRef.current.x) * speed;
      targetRef.current.y +=
        (positionRef.current.y - targetRef.current.y) * speed;

      // 스크롤 위치를 빼서 실제 화면상의 위치 계산
      const visualX = targetRef.current.x - scrollX;
      const visualY = targetRef.current.y - scrollY;

      cursorRef.current.style.transform = `translate(${visualX}px, ${visualY}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    // 이벤트 리스너들
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-50 pointer-events-none"
      ref={cursorRef}
    >
      <span
        className={`block w-8 h-8 bg-white/30 rounded-full -ml-1 -mt-1 transition-transform duration-200 ${
          isClicked ? "scale-50" : "scale-100"
        }`}
      />
    </div>
  );
};

export default Cursor;
