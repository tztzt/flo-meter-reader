import { useState, useEffect } from "react";

/**
 * basic hook that returns a state and a setter that syncs the state to local storage
 */
export const useSyncState = (key: string) => {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
