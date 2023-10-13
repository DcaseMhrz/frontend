import { useState, useEffect } from "react";

type SetValue<T> = (newValue: T | ((prevValue: T) => T)) => void;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Check if window is defined to avoid issues during SSR
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
        return initialValue;
      }
    } else {
      // Return initialValue during SSR
      return initialValue;
    }
  });

  const setValue: SetValue<T> = (newValue) => {
    // Check if window is defined to avoid issues during SSR
    if (typeof window !== "undefined") {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(storedValue) : newValue;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    }
  };

  useEffect(() => {
    // Check if window is defined to avoid issues during SSR
    if (typeof window !== "undefined") {
      const handleStorageChange = () => {
        try {
          const item = window.localStorage.getItem(key);
          setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (error) {
          console.warn(
            `Error reading localStorage key “${key}” on storage event:`,
            error
          );
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
