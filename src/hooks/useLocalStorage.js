import { useState, useEffect } from "react";

/**
 * Same API as useState, but the value is persisted to localStorage
 * under `key` and restored on next load.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable (private mode, quota, etc.) — fail silently
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;