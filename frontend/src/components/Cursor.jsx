import { useEffect, useState, useRef } from 'react';

const Cursor = () => {
 const [isClicked, setIsClicked] = useState(false);
 const cursorRef = useRef(null);
 const targetRef = useRef({ x: 0, y: 0 });
 const positionRef = useRef({ x: 0, y: 0 });
 const speed = 0.09;
 const rafRef = useRef(null);

 useEffect(() => {
   const handleMouseMove = (e) => {
     positionRef.current = { x: e.pageX, y: e.pageY };
   };

   const handleMouseDown = () => setIsClicked(true);
   const handleMouseUp = () => setIsClicked(false);

   const animate = () => {
     if (!cursorRef.current) return;
     
     targetRef.current.x += (positionRef.current.x - targetRef.current.x) * speed;
     targetRef.current.y += (positionRef.current.y - targetRef.current.y) * speed;

     cursorRef.current.style.transform = `translate(${targetRef.current.x}px, ${targetRef.current.y}px)`;
     rafRef.current = requestAnimationFrame(animate);
   };

   window.addEventListener('mousemove', handleMouseMove);
   window.addEventListener('mousedown', handleMouseDown);
   window.addEventListener('mouseup', handleMouseUp);
   rafRef.current = requestAnimationFrame(animate);

   return () => {
     window.removeEventListener('mousemove', handleMouseMove);
     window.removeEventListener('mousedown', handleMouseDown);
     window.removeEventListener('mouseup', handleMouseUp);
     if (rafRef.current) {
       cancelAnimationFrame(rafRef.current);
     }
   };
 }, []);

 return (
   <div ref={cursorRef} className="fixed top-0 left-0 z-50 pointer-events-none">
     <span className={`fixed w-[30px] h-[30px] bg-gray-300/30 rounded-full -ml-[5px] -mt-[5px] transition-transform duration-200 ${isClicked ? 'scale-50' : 'scale-100'}`} />
   </div>
 );
};

export default Cursor;