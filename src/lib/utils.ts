import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date; // Or customize this format if needed
};

export const getDifferenceDate = (date1: Date, date2: Date) => {
  const diff = formatDistance(date1, date2, { addSuffix: true });
  return diff;
}
