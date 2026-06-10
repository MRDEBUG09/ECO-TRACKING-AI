import React, { useEffect, useRef } from 'react';

export const EarthCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;
    const particles: Array<{ x: number; y: number; size: number; speed: number; alpha: number }> = [];

    // Initialize decorative floating carbon particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.35;

      // 1. Draw floating ambient space particles
      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) p.y = height;
        ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`; // neon emerald tint
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw outer atmosphere neon glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.3);
      glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
      glowGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.1)'); // teal
      glowGrad.addColorStop(1, 'rgba(5, 8, 22, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Earth Water base sphere
      const oceanGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
      oceanGrad.addColorStop(0, '#0284c7'); // Electric light blue
      oceanGrad.addColorStop(0.6, '#0f172a'); // Deep slate ocean
      oceanGrad.addColorStop(1, '#050816');
      ctx.fillStyle = oceanGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // 4. Draw rotating landmass coordinates mapped onto a pseudo-3D orthographic globe
      rotation += 0.003;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip(); // Clip landmasses to the sphere

      ctx.fillStyle = 'rgba(16, 185, 129, 0.7)'; // Emerald neon landmasses
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#10b981';

      // Draw a grid of simulated continents/green zones rotating
      const numLandmasses = 14;
      for (let i = 0; i < numLandmasses; i++) {
        const angleOffset = (i * Math.PI * 2) / numLandmasses;
        const currentAngle = angleOffset + rotation;
        
        // Calculate orthographic spherical projection coordinate
        const sphericalX = Math.sin(currentAngle) * radius;
        const sphericalY = Math.cos(angleOffset * 1.5) * radius * 0.5;

        // Is the coordinate on the visible side of the earth?
        const isFacingUser = Math.cos(currentAngle) >= 0;

        if (isFacingUser) {
          ctx.beginPath();
          // Scale size map based on center proximity
          const centerFactor = Math.abs(sphericalX) / radius;
          const horizontalWidth = (30 + (i % 3) * 15) * (1 - centerFactor * 0.5);
          const verticalHeight = 25 + (i % 2) * 12;

          ctx.ellipse(
            cx + sphericalX, 
            cy + sphericalY, 
            horizontalWidth, 
            verticalHeight, 
            0, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      ctx.restore();

      // 5. Draw orbital satellite climate tracking rings
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)'; // Neon cyan cycle
      ctx.lineWidth = 1;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(0.3); // tilt orbital inclination
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.3, radius * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Satellite blinking tracker
      const satelliteAngle = rotation * 2;
      const satX = Math.cos(satelliteAngle) * radius * 1.3;
      const satY = Math.sin(satelliteAngle) * radius * 0.35;
      
      // Halo around satellite
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.beginPath();
      ctx.arc(satX, satY, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#67e8f9'; // Cyan glowing node
      ctx.beginPath();
      ctx.arc(satX, satY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 6. Earth boundary atmospheric reflex line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx - 3, cy - 3, radius - 1, 0, Math.PI * 2);
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div id="earth_container" className="w-full h-full min-h-[350px] md:min-h-[450px] relative flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      {/* Absolute center styling block */}
      <div className="absolute inset-0 bg-transparent rounded-full border border-white/5 pointer-events-none scale-90 blur-xl animate-pulse" />
    </div>
  );
};
