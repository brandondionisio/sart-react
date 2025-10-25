import React from "react";

interface CountdownProps {
  countdown: number | null;
}

export const Countdown: React.FC<CountdownProps> = ({ countdown }) => {
  if (countdown === null) return null;

  return (
    <div className="fixed inset-0 bg-black z-1000 flex items-center justify-center pointer-events-none">
      <div className="text-center text-white">
        <div className="text-4xl font-normal mb-8 font-sans">Get Ready</div>
        <div className="flex justify-center gap-4">
          <span
            className={`text-6xl font-normal font-sans transition-opacity duration-300 ${
              countdown === 3
                ? "opacity-100 text-white"
                : "opacity-30 text-gray-500"
            }`}
          >
            3
          </span>
          <span
            className={`text-6xl font-normal font-sans transition-opacity duration-300 ${
              countdown === 2
                ? "opacity-100 text-white"
                : "opacity-30 text-gray-500"
            }`}
          >
            2
          </span>
          <span
            className={`text-6xl font-normal font-sans transition-opacity duration-300 ${
              countdown === 1
                ? "opacity-100 text-white"
                : "opacity-30 text-gray-500"
            }`}
          >
            1
          </span>
        </div>
      </div>
    </div>
  );
};
