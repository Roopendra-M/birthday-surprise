"use client";

import { useEffect, useState, useCallback } from "react";
import { prefersReducedMotion } from "@/utils/helpers";

/**
 * Returns true once the component has mounted on the client.
 * Prevents hydration mismatch for client-only features.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- canonical isMounted pattern
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

/**
 * Returns the current window scroll position (x, y).
 */
export function useScrollPosition(): { x: number; y: number } {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const update = () =>
      setPos({ x: window.scrollX, y: window.scrollY });
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return pos;
}

/**
 * Returns current window dimensions, updates on resize.
 */
export function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

/**
 * Controls a boolean toggle – useful for modals, dropdowns, etc.
 */
export function useToggle(
  initial = false
): [boolean, () => void, (v: boolean) => void] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
}

/**
 * Returns true when the element is in the viewport.
 */
export function useInView(
  ref: React.RefObject<Element | null>,
  options?: IntersectionObserverInit
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15, ...options }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return inView;
}

/**
 * Returns whether the user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  // Lazy init reads the current preference immediately (client-only hook)
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== "undefined" ? prefersReducedMotion() : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * Copies text to clipboard and returns a `copied` status.
 */
export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
      } catch {
        setCopied(false);
      }
    },
    [timeout]
  );

  return { copy, copied };
}

/**
 * Persist state in localStorage with JSON serialization.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (v: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === "function"
          ? (value as (p: T) => T)(prev)
          : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch { /* silent */ }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
