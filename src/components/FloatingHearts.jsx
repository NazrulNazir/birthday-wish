import React, { useEffect, useRef } from 'react';

export default function FloatingHearts() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Heart {
      constructor() {
        this.reset();
        // Stagger spawn heights on initial load
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 12 + 6;
        this.speedY = Math.random() * 0.8 + 0.4;
        // Side-to-side drift parameters
        this.swingSpeed = Math.random() * 0.02 + 0.005;
        this.swingRange = Math.random() * 20 + 10;
        this.swingOffset = Math.random() * Math.PI * 2;
        
        // Colors: romantic pinks, reds, and purples
        const hues = [340, 350, 0, 280]; // pink, rose, red, purple
        this.hue = hues[Math.floor(Math.random() * hues.length)];
        this.opacity = Math.random() * 0.4 + 0.15;
      }

      update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.y * this.swingSpeed + this.swingOffset) * 0.3;

        // Reset heart if it drifts out of view
        if (this.y < -this.size * 2) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, 1)`;
        ctx.beginPath();
        
        // Standard parametric bezier heart formula
        const x = this.x;
        const y = this.y;
        const size = this.size;

        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
          x - size / 2, y - size / 2, 
          x - size, y + size / 3, 
          x, y + size
        );
        ctx.bezierCurveTo(
          x + size, y + size / 3, 
          x + size / 2, y - size / 2, 
          x, y
        );
        
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // Allocate heart counts based on screen width
    const heartCount = Math.min(Math.floor(width / 35), 45);
    const hearts = Array.from({ length: heartCount }, () => new Heart());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      hearts.forEach((heart) => {
        heart.update();
        heart.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full block pointer-events-none z-0"
    />
  );
}
