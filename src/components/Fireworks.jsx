import React, { useEffect, useRef } from 'react';

export default function Fireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Retina support
    const dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simulation Arrays
    let rockets = [];
    let particles = [];

    // Helper functions
    const randomRange = (min, max) => Math.random() * (max - min) + min;

    // Rocket Class
    class Rocket {
      constructor(startX, startY, targetX, targetY) {
        this.x = startX;
        this.y = startY;
        this.startX = startX;
        this.startY = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        
        // Calculate distance & angle to target
        const dx = targetX - startX;
        const dy = targetY - startY;
        this.distanceToTarget = Math.sqrt(dx * dx + dy * dy);
        this.distanceTraveled = 0;
        
        this.angle = Math.atan2(dy, dx);
        this.speed = randomRange(4, 7);
        this.acceleration = 1.03;
        
        // Motion vectors
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        this.hue = Math.floor(randomRange(0, 360));
        this.trail = [];
        this.trailLength = 4;
      }

      update(index) {
        // Record trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLength) {
          this.trail.shift();
        }

        // Accelerate
        this.speed *= this.acceleration;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        // Move
        this.x += this.vx;
        this.y += this.vy;

        // Calculate progress
        const dx = this.x - this.startX;
        const dy = this.y - this.startY;
        this.distanceTraveled = Math.sqrt(dx * dx + dy * dy);

        // Explode if target is reached or passed
        if (this.distanceTraveled >= this.distanceToTarget) {
          createExplosion(this.targetX, this.targetY, this.hue);
          rockets.splice(index, 1);
        }
      }

      draw() {
        if (this.trail.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let i = 1; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, 0.9)`;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.8)`;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }
    }

    // Particle Class
    class Particle {
      constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        
        // Spreading velocity
        this.angle = randomRange(0, Math.PI * 2);
        this.speed = randomRange(1, 6);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        
        // Physics attributes
        this.friction = 0.95;
        this.gravity = 0.12;
        
        this.alpha = 1;
        this.fade = randomRange(0.012, 0.024);
        
        this.trail = [];
        this.trailLength = 6;
      }

      update(index) {
        // Record trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLength) {
          this.trail.shift();
        }

        // Apply environment physics
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.alpha -= this.fade;

        if (this.alpha <= 0) {
          particles.splice(index, 1);
        }
      }

      draw() {
        if (this.trail.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let i = 1; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
        ctx.lineWidth = randomRange(1, 2);
        ctx.stroke();
      }
    }

    // Create a particle burst
    const createExplosion = (x, y, hue) => {
      // Different sizes & counts
      const count = Math.floor(randomRange(70, 110));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, hue + Math.floor(randomRange(-25, 25))));
      }
    };

    // Auto launcher controls
    let lastLaunchTime = 0;
    const launchInterval = 900; // ms between continuous launches

    const updateAndDraw = (timestamp) => {
      // Soft alpha overlay to create fireworks motion-blur
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Restore composite mode for bright particles
      ctx.globalCompositeOperation = 'lighter';

      // Auto launch rockets
      if (timestamp - lastLaunchTime > launchInterval) {
        const startX = randomRange(width * 0.1, width * 0.9);
        const startY = height;
        const targetX = randomRange(width * 0.15, width * 0.85);
        const targetY = randomRange(height * 0.1, height * 0.45);
        
        rockets.push(new Rocket(startX, startY, targetX, targetY));
        lastLaunchTime = timestamp;
      }

      // Update & Draw Rockets
      let i = rockets.length;
      while (i--) {
        rockets[i].update(i);
        if (rockets[i]) rockets[i].draw();
      }

      // Update & Draw Particles
      let j = particles.length;
      while (j--) {
        particles[j].update(j);
        if (particles[j]) particles[j].draw();
      }

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    // Start loop
    animationFrameId = requestAnimationFrame(updateAndDraw);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full block bg-transparent pointer-events-none z-10"
    />
  );
}
