import { useState } from "react";

function getFromLocalStorage<T>(key: string): T | null {
  const saved = localStorage.getItem(key);
  if (saved === null) return null;
  return JSON.parse(saved);
}

export const useLocalStorage = <T>(
  key: string
): [T | null, (v: T | null) => void] => {
  const [value, setValue] = useState<T | null>(getFromLocalStorage(key));

  function storeValue(v: T | null): void {
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  }

  return [value, storeValue];
};
