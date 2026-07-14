import { type ClassValue, clsx } from "clsx";

/**
 * Merges class names using clsx.
 * Drop-in for the popular `cn` utility used with Tailwind.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
