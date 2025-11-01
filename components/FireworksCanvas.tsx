import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
}

const FireworksCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Fix: Provide an initial value to `useRef` to resolve the "Expected 1 arguments, but got 0" error.
  const animationFrameId = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const createExplosion = (x: number, y: number) => {
      const hue = Math.floor(Math.random() * 360);
      const count = 40 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 40 + Math.random() * 40,
          hue,
          size: 1 + Math.random() * 3,
        });
      }
    };

    const update = () => {
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.life -= 1;
      });
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `hsla(${p.hue},100%,60%,${Math.max(0, p.life / 80)})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    
    const animate = () => {
        update();
        draw();
        animationFrameId.current = requestAnimationFrame(animate);
    }
    
    // Initial burst
    for (let i = 0; i < 8; i++) {
        createExplosion(Math.random() * W * 0.8 + W * 0.1, Math.random() * H * 0.6 + H * 0.1);
    }

    animate();
    
    const timeoutId = setTimeout(() => {
        if(animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        particlesRef.current = [];
        ctx.clearRect(0,0,W,H);
    }, 3200);

    return () => {
      window.removeEventListener('resize', handleResize);
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed left-0 top-0 pointer-events-none w-full h-full z-50"
    />
  );
};

export default FireworksCanvas;
