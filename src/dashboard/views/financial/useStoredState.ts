import { useEffect, useState } from 'react';

export default function useStoredState<T>(key: string, initialValue: T, validate?: (value: unknown) => boolean) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (!validate || validate(parsed)) return parsed as T;
      }
    } catch {
      // Storage may be unavailable in a private or restricted browser session.
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Workspace interactions continue to work without persistence.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
