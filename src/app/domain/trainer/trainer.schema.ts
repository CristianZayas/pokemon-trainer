import { z } from 'zod';

export const TrainerProfileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  hobby: z.string().trim().max(100),
  birthDate: z.iso.date(),
  document: z.string().trim().max(32),
  photoDataUrl: z.string().regex(/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/),
}).superRefine((value, context) => {
  const age = calculateAge(value.birthDate);
  if (age === null) {
    context.addIssue({ code: 'custom', path: ['birthDate'], message: 'Invalid birth date' });
  } else if (age >= 18 && !/^\d{8}-\d$/.test(value.document)) {
    context.addIssue({ code: 'custom', path: ['document'], message: 'DUI must use ########-#' });
  }
});

export type TrainerProfile = z.infer<typeof TrainerProfileSchema>;

export function calculateAge(date: string, today = new Date()): number | null {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return null;
  const birth = new Date(year, month - 1, day);
  if (birth.getFullYear() !== year || birth.getMonth() !== month - 1 || birth.getDate() !== day || birth > today) return null;
  let age = today.getFullYear() - year;
  if (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day)) age--;
  return age;
}

export function formatDui(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  return digits.length > 8 ? `${digits.slice(0, 8)}-${digits.slice(8)}` : digits;
}
