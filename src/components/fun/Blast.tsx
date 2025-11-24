"use client";

import { useEffect, useState } from "react";

const Blast = () => {
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

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Flash */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-150 ${
          stage >= 1 && stage < 2 ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Expanding orange glow */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
          stage >= 2 ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div
          className="absolute rounded-full bg-gradient-radial from-orange-400 via-red-500 to-transparent transition-all duration-300"
          style={{
            width: stage >= 1 ? '200vw' : '0vw',
            height: stage >= 1 ? '200vh' : '0vh',
            opacity: stage === 1 ? 0.8 : 0,
          }}
        />
      </div>
       {/* Smoke effect */}
       <div
        className={`absolute inset-0 bg-black/80 transition-opacity duration-1000 ${
          stage >= 3 ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};

export default Blast;
