import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

export function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = useCallback(
    (v: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setDebounced(v), delay);
    },
    [delay],
  );

  useFocusEffect(
    useCallback(() => {
      update(value);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [value, update]),
  );

  return debounced;
}
