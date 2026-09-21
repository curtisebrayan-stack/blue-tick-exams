import { useEffect, useRef, useState } from "react";

/**
 * Chrono par question pour le mode examen réel : redémarre à chaque changement
 * de question et déclenche onExpire (avance forcée) quand il atteint zéro.
 */
export function usePerQuestionTimer(
  enabled: boolean,
  timeTable: number[],
  currentIndex: number,
  onExpire: () => void,
): number {
  const [secondsLeft, setSecondsLeft] = useState(() => timeTable[currentIndex] ?? 0);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setSecondsLeft(timeTable[currentIndex] ?? 0);
  }, [currentIndex, timeTable]);

  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          onExpireRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [enabled, currentIndex]);

  return secondsLeft;
}
