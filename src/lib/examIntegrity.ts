// Signaux anti-triche (partage de réponses / usage d'IA) pour les exercices pratiques.
// Principe : on détecte et on journalise pour l'admin, on ne bloque jamais automatiquement
// un apprenant — un signal peut avoir une explication légitime (relecture, distraction...).

import { useEffect, useRef, useState } from "react";

export type IntegrityFlags = {
  tabSwitches: number;
  fullscreenExits: number;
  pasted?: boolean;
  fastTyping?: boolean;
  slowAnswers?: number;
};

export function useExamIntegrity() {
  const tabSwitches = useRef(0);
  const fullscreenExits = useRef(0);
  const wasFullscreen = useRef(false);
  const [fullscreenActive, setFullscreenActive] = useState(false);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") tabSwitches.current += 1;
    };
    const onFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement !== null;
      if (wasFullscreen.current && !isFullscreen) fullscreenExits.current += 1;
      wasFullscreen.current = isFullscreen;
      setFullscreenActive(isFullscreen);
    };
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => {
      // Refusé par le navigateur/la plateforme (mobile, permissions...) — on continue sans bloquer.
    });
  };

  const preventContextMenu = (e: React.MouseEvent) => e.preventDefault();

  const baseFlags = (): Pick<IntegrityFlags, "tabSwitches" | "fullscreenExits"> => ({
    tabSwitches: tabSwitches.current,
    fullscreenExits: fullscreenExits.current,
  });

  return { fullscreenActive, enterFullscreen, preventContextMenu, baseFlags };
}
