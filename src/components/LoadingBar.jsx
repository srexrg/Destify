import { useState, useEffect } from 'react';

const LoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 12 * 1000; 
    const increment = 10; // Progress increment per interval

    const steps = interval / increment;
    let currentStep = 0;

    const updateProgress = () => {
      setProgress((currentStep / steps) * 100);
      currentStep++;

      if (currentStep <= steps) {
        setTimeout(updateProgress, increment);
      }
    };

    setTimeout(updateProgress, increment);

    return () => {
      clearTimeout(updateProgress);
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-8">
    <div className="relative w-56 h-4 bg-gray-300 rounded-full overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full bg-blue-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
  );
};

export default LoadingBar;