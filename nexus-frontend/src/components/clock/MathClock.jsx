"use client";

import { useState, useEffect, useRef } from "react";
import "../clock/MathClock.css"
export default function MathClock() {
  const [time, setTime] = useState(new Date());
  const hourHandRef = useRef(null);
  const minuteHandRef = useRef(null);
  const secondHandRef = useRef(null);

  // Mathematical expressions for each hour position
  const hourMarkers = [
    "√121", // 11
    "π⁰", // 12
    "2×3!", // 1
    "2!", // 2
    "3²", // 3
    "4+3×2", // 4
    "√25", // 5
    "2³", // 6
    "∑n", // 7
    "√(3²+4²)", // 8
    "det[³₁₃]", // 9
    "2²", // 10
  ];

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now);

      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;

      // Calculate rotation angles
      const secondsDegrees = (seconds / 60) * 360;
      const minutesDegrees = ((minutes + seconds / 60) / 60) * 360;
      const hoursDegrees = ((hours + minutes / 60) / 12) * 360;

      // Apply rotations
      if (secondHandRef.current) {
        secondHandRef.current.style.transform = `rotate(${secondsDegrees}deg)`;
      }

      if (minuteHandRef.current) {
        minuteHandRef.current.style.transform = `rotate(${minutesDegrees}deg)`;
      }

      if (hourHandRef.current) {
        hourHandRef.current.style.transform = `rotate(${hoursDegrees}deg)`;
      }
    };

    updateClock(); // Run immediately

    // Update every second
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clock-container">
      <div className="clock-face">
        {/* Hour markers with math expressions */}
        {hourMarkers.map((marker, index) => {
          const angle = ((index + 1) / 12) * 360;
          return (
            <div
              key={index}
              className="hour-marker"
              style={{
                transform: `rotate(${angle}deg) translateY(-160px) rotate(-${angle}deg)`,
              }}
            >
              {marker}
            </div>
          );
        })}

        {/* Clock hands */}
        <div className="hand hour-hand" ref={hourHandRef}></div>
        <div className="hand minute-hand" ref={minuteHandRef}></div>
        <div className="hand second-hand" ref={secondHandRef}></div>

        {/* Center dot */}
        <div className="center-dot"></div>

        {/* Math formulas background */}
        <div className="math-background"></div>
      </div>
    </div>
  );
}
