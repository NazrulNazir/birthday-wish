import React, { useEffect, useRef } from 'react';

export default function Confetti() {
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

    class ConfettiParticle {
      constructor(x, y, angle, force) {
        this.x = x;
        this.y = y;
        
        // Shoot particles upwards and inwards
        this.angle = angle + (Math.random() - 0.5) * 0.4;
        this.speed = force * (Math.random() * 0.6 + 0.7);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        this.width = Math.random() * 8 + 6;
        this.height = Math.random() * 12 + 8;
        
        // Confetti rotation
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;

        this.gravity = 0.25;
        this.friction = 0.96;
        
        // Spacial waving drift
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;

        this.alpha = 1;
        this.fade = Math.random() * 0.01 + 0.005;

        // Vivid palette colors
        const colors = [
          '#FF3E6C', '#FFD23F', '#3B82F6', '#10B981', 
          '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.rotation += this.rotationSpeed;
        this.wobble += this.wobbleSpeed;
        
        // Drift side to side
        this.x += Math.sin(this.wobble) * 0.5;

        this.alpha -= this.fade;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        // Draw confetti rectangle
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        ctx.restore();
      }
    }

    const particles = [];
    const particleCount = 75; // Per side, 150 total

    // Spawn Left Popper
    for (let i = 0; i < particleCount; i++) {
      particles.push(
        new ConfettiParticle(
          0, 
          height - 50, 
          -Math.PI / 4, // Up and Right
          Math.min(width * 0.016, 22) // Force scaled with width
        )
      );
    }

    // Spawn Right Popper
    for (let i = 0; i < particleCount; i++) {
      particles.push(
        new ConfettiParticle(
          width, 
          height - 50, 
          -Math.PI * 3 / 4, // Up and Left
          Math.min(width * 0.016, 22)
        )
      );
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      let activeParticles = 0;
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha > 0 && p.y < height + 20) {
          p.update();
          p.draw();
          activeParticles++;
        }
      }

      // If all particles faded or fell off screen, stop loop
      if (activeParticles > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
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
      className="absolute top-0 left-0 w-full h-full block pointer-events-none z-30"
    />
  );
}
