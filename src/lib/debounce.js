import { useEffect, useState } from "react";

/**
 * useDebouncedValue(value, delay)
 * ✅ Delay value changes so we don't call API on every keystroke/drag
 */
export function useDebouncedValue(value, delay = 450) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}