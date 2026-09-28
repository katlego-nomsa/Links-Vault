import { useEffect, useState } from 'react';

// Generic hook that syncs a piece of state with window.localStorage.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch (err) {
      console.error(`Failed to read localStorage key "${key}"`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Failed to write localStorage key "${key}"`, err);
    }
  }, [key, value]);

  return [value, setValue] as const;
}