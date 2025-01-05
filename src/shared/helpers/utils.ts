/**
 * @author Remco Stoeten
 * @description Utility functions for class name merging and type safety
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 