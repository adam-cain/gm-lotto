import { useState, useEffect } from 'react';

type CountdownMode = 'endTime' | 'timeLeft';

/**
 * useCountdown
 * A custom hook that returns a human readable countdown string.
 *
 * @param {number} time - The time value in Unix timestamp (seconds)
 * @param {CountdownMode} mode - Whether the time parameter represents an end time or time left
 * @returns {string} A formatted string like "1d 3h 5m 10s" or null if the countdown is over.
 */
function useCountdown(time: number, mode: CountdownMode = 'endTime') {
  // Helper function to calculate the remaining time (in milliseconds)
  const calculateTimeLeft = () => {
    const now = new Date().getTime(); // Current time in milliseconds
    if (mode === 'endTime') {
      const endTimeMs = time * 1000; // Convert end time to milliseconds
      return endTimeMs - now;
    } else {
      // For timeLeft mode, we just need to convert seconds to milliseconds
      return time * 1000;
    }
  };

  // Helper function to format the milliseconds difference to a string.
  const formatTime = (ms: number) => {
    if (!ms || ms <= 0) {
      return null;
    }
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);
    
    return parts.join(' ') || null;
  };

  // Set the initial state with the time left.
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Only set up interval if we're in endTime mode
    if (mode === 'endTime') {
      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();

        if (newTimeLeft <= 0) {
          clearInterval(timer); // Stop the timer when countdown is complete
        }
        setTimeLeft(newTimeLeft);
      }, 1000);

      // Clean up the timer interval when the component unmounts.
      return () => clearInterval(timer);
    } else {
      // For timeLeft mode, just set the initial time
      setTimeLeft(calculateTimeLeft());
    }
  }, [time, mode]);

  // Return the formatted time string.
  return formatTime(timeLeft);
}

export default useCountdown;
