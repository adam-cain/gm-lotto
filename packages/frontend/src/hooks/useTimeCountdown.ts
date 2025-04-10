import { useState, useEffect } from 'react';

export function useTimeCountdown(startTime: number, endTime: number): number {
  const [time, setTime] = useState(() => {
    const now = Date.now();
    if (now < startTime) {
      // Countdown hasn't started yet, return time until start
      return startTime - now;
    }
    if (now >= endTime) {
      // Countdown has ended
      return 0;
    }
    // Countdown is in progress
    return endTime - now;
  });

  useEffect(() => {
    // Don't set up interval if time is 0 or falsy
    if (!time) return;

    const interval = setInterval(() => {
      const now = Date.now();
      
      if (now < startTime) {
        // Countdown hasn't started yet, set time to the full wait period
        setTime(endTime - startTime);
      } else if (now >= endTime) {
        // Countdown has ended
        setTime(0);
        clearInterval(interval);
      } else {
        // Countdown is in progress
        setTime(endTime - now);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, time]);

  return time;
}
