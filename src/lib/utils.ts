import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a clean, alphanumeric document ID safe for Firestore security rules
 */
export function getSafeEntryId(
  userId?: string | null,
  vargId?: string | null,
  subject?: string | null,
  testId?: string | null
): string {
  const cleanUid = String(userId || 'guest')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 32);
  const cleanVarg = String(vargId || 'varg')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 20);
  const cleanSub = String(subject || 'general')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);
  const cleanTest = String(testId || '1')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);

  return `${cleanUid}_${cleanVarg}_${cleanSub}_${cleanTest}`.slice(0, 120);
}
