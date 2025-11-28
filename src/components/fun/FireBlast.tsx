"use client";

import { useEffect, useState, useMemo } from "react";

const FireBlast = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const flashTimer = setTimeout(() => setStage(1), 50);
    const fadeTimer = setTimeout(() => setStage(2), 200);
    const smokeTimer = setTimeout(() => setStage(3), 500);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(fadeTimer);
      clearTimeout(smokeTimer);
    };
  }, []);

  
  const particles = useMemo(() => {
    if (stage < 1) return [];
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
      delay: Math.random() * 0.5,
      duration: Math.random() * 1 + 0.5,
      color: `hsl(${Math.random() * 30 + 10}, 100%, 50%)`,
    }));
  }, [stage]);

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {/* Flash */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-150 ${
          stage >= 1 && stage < 2 ? 'opacity-80' : 'opacity-0'
        }`}
      />
      {/* Fire Particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              animation: `fire-particle ${p.duration}s ${p.delay}s ease-out forwards`,
              opacity: stage === 1 ? 1 : 0,
            }}
          />
        ))}
      </div>
      {/* Smoke effect */}
      <div
        className={`absolute inset-0 bg-black/80 transition-opacity duration-1000 ${
          stage >= 3 ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <style jsx>{`
        @keyframes fire-particle {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(${Math.random() * 20 + 10}) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FireBlast;
