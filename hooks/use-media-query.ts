import { useSyncExternalStore } from "react";
import React from "react";

export function useMediaQuery(query: string): boolean {
  const getSnapshot = React.useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = React.useCallback(() => false, []);

  const subscribe = React.useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") return () => {};
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
