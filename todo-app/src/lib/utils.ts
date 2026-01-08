import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to merge class names using tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to a readable string
export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date);

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to formatDate:', date);
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

// Format date for display in relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = new Date(date);

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to formatRelativeTime:', date);
    return 'Invalid Date';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  // For older dates, return formatted date
  return formatDate(dateObj);
}

// Validate todo title length
export function isValidTodoTitle(title: string): boolean {
  return title.length >= 1 && title.length <= 100;
}

// Validate todo description length
export function isValidTodoDescription(description?: string): boolean {
  if (!description) return true; // Description is optional
  return description.length <= 500;
}

// Validate priority value
export function isValidPriority(priority: string): priority is 'low' | 'medium' | 'high' {
  return ['low', 'medium', 'high'].includes(priority);
}

// Generate a random pastel color for UI elements
export function getRandomPastelColor(): string {
  const r = Math.floor((Math.random() * 127) + 127);
  const g = Math.floor((Math.random() * 127) + 127);
  const b = Math.floor((Math.random() * 127) + 127);
  return `rgb(${r}, ${g}, ${b})`;
}

// Debounce function to limit the rate at which a function can fire
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitFor: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

// Capitalize the first letter of a string
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}