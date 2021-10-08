import { useState, useEffect } from 'react';

/**
 * Rerenders a component after a specified amount of time.
 */
export const useTimeout = (delay: number) => {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setTriggered(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  return triggered;
};
