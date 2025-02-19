import { useEffect, useRef } from 'react';

const WaveAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 캔버스 크기 설정
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // 웨이브 설정
    const waves = [
      { frequency: 0.02, amplitude: 50, speed: 0.01, color: 'rgba(255,255,255,0.2)' },
      { frequency: 0.03, amplitude: 30, speed: 0.02, color: 'rgba(255,255,255,0.3)' },
      { frequency: 0.04, amplitude: 20, speed: 0.015, color: 'rgba(255,255,255,0.4)' }
    ];

    let time = 0;

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;

        for (let x = 0; x < canvas.width; x++) {
          const y = Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude;
          
          if (x === 0) {
            ctx.moveTo(x, canvas.height / 2 + y);
          } else {
            ctx.lineTo(x, canvas.height / 2 + y);
          }
        }

        ctx.stroke();
      });

      time += 1;
      requestAnimationFrame(drawWave);
    };

    drawWave();

    window.addEventListener('resize', setCanvasSize);
    return () => window.removeEventListener('resize', setCanvasSize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'overlay' }}
    />
  );
};

export default WaveAnimation; 