import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  pulseSpeed: number;
  phase: number;
}

export const AmbientAtmosphere: React.FC<{ intensity?: 'light' | 'rain' | 'spores' }> = ({ intensity = 'light' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = intensity === 'rain' ? 80 : intensity === 'spores' ? 65 : 45;
    const particles: Particle[] = [];

    const colors = [
      'rgba(16, 185, 129, ', // emerald
      'rgba(52, 211, 153, ', // mint
      'rgba(255, 255, 255, ', // pure dew
      'rgba(6, 182, 212, '   // cyan atmosphere
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * (intensity === 'rain' ? 1.5 : 2.5) + 0.6,
        vx: (Math.random() - 0.45) * 0.4,
        vy: intensity === 'rain' ? Math.random() * 3 + 2 : -(Math.random() * 0.35 + 0.1),
        alpha: Math.random() * 0.5 + 0.1,
        maxAlpha: Math.random() * 0.5 + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.02 + 0.008,
        phase: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const currentAlpha = Math.sin(p.phase) * 0.5 + 0.5;
        const finalAlpha = p.alpha * currentAlpha;

        ctx.beginPath();
        if (intensity === 'rain') {
          // Rain streak
          ctx.strokeStyle = `rgba(180, 220, 240, ${finalAlpha * 0.7})`;
          ctx.lineWidth = p.radius * 0.8;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 3, p.y + p.vy * 4);
          ctx.stroke();
        } else {
          // Glowing biological / atmospheric spore
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
          gradient.addColorStop(0, `${p.color}${finalAlpha})`);
          gradient.addColorStop(1, `${p.color}0)`);
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2
      }}
    />
  );
};
