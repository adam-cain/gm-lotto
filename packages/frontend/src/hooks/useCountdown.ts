import { useState, useEffect } from 'react';

type CountdownMode = 'endTime' | 'timeLeft';

/**
 * useCountdown
 * A custom hook that returns a human readable countdown string.
 *
 * @param {number} time - The time value in Unix timestamp (seconds)
 * @param {CountdownMode} mode - Whether the time parameter represents an end time or time left
 * @param {number} depth - How many time units to show (e.g. 2 would show days and hours, or hours and minutes)
 * @returns {string} A formatted string like "1d 3h 5m 10s" or null if the countdown is over.
 */
function useCountdown(time: number, mode: CountdownMode = 'endTime', depth: number = 4) {
  // Helper function to calculate the remaining time (in milliseconds)
  const calculateTimeLeft = () => {
    const now = new Date().getTime(); // Current time in milliseconds
    if (mode === 'endTime') {
      const endTimeMs = time * 1000; // Convert end time to milliseconds
      return endTimeMs - now;
    } else {
      // For timeLeft mode, we need to track when we started counting down
      const startTimeMs = time * 1000; // Convert time left to milliseconds
      const elapsedMs = now - (useCountdown as any).startTime;
      return Math.max(0, startTimeMs - elapsedMs);
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
    let remainingDepth = depth;

    if (days > 0 && remainingDepth > 0) {
      parts.push(`${days}d`);
      remainingDepth--;
      if (remainingDepth > 0) {
        parts.push(`${hours}h`);
        remainingDepth--;
        if (remainingDepth > 0) {
          parts.push(`${minutes}m`);
          remainingDepth--;
          if (remainingDepth > 0) {
            parts.push(`${seconds}s`);
          }
        }
      }
    } else if (hours > 0 && remainingDepth > 0) {
      parts.push(`${hours}h`);
      remainingDepth--;
      if (remainingDepth > 0) {
        parts.push(`${minutes}m`);
        remainingDepth--;
        if (remainingDepth > 0) {
          parts.push(`${seconds}s`);
        }
      }
    } else if (minutes > 0 && remainingDepth > 0) {
      parts.push(`${minutes}m`);
      remainingDepth--;
      if (remainingDepth > 0) {
        parts.push(`${seconds}s`);
      }
    } else if (remainingDepth > 0) {
      parts.push(`${seconds}s`);
    }
    
    return parts.join(' ') || null;
  };

  // Set the initial state with the time left.
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Initialize start time for timeLeft mode
    if (mode === 'timeLeft' && !(useCountdown as any).startTime) {
      (useCountdown as any).startTime = new Date().getTime();
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();

      if (newTimeLeft <= 0) {
        clearInterval(timer); // Stop the timer when countdown is complete
      }
      setTimeLeft(newTimeLeft);
    }, 1000);

    // Clean up the timer interval when the component unmounts.
    return () => clearInterval(timer);
  }, [time, mode]);

  // Return the formatted time string.
  return formatTime(timeLeft);
}

export default useCountdown;
