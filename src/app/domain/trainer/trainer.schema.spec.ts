import { calculateAge, formatDui, TrainerProfileSchema } from './trainer.schema';

const base = { name: 'Ash Ketchum', hobby: '', birthDate: '2000-05-22', document: '12345678-9', photoDataUrl: 'data:image/png;base64,AA==' };

describe('TrainerProfileSchema', () => {
  it('requires a formatted DUI for an adult but lets a minor omit identification', () => {
    expect(TrainerProfileSchema.safeParse(base).success).toBe(true);
    expect(TrainerProfileSchema.safeParse({ ...base, document: '' }).success).toBe(false);
    expect(TrainerProfileSchema.safeParse({ ...base, birthDate: '2015-05-22', document: '' }).success).toBe(true);
  });
  it('rejects future or impossible dates and unsafe image data', () => {
    expect(TrainerProfileSchema.safeParse({ ...base, birthDate: '2024-02-31' }).success).toBe(false);
    expect(TrainerProfileSchema.safeParse({ ...base, birthDate: '2999-01-01' }).success).toBe(false);
    expect(TrainerProfileSchema.safeParse({ ...base, photoDataUrl: 'data:image/svg+xml;base64,AA==' }).success).toBe(false);
  });
  it('handles birthday boundaries and formats DUI input', () => {
    expect(calculateAge('2008-09-27', new Date(2026, 8, 26))).toBe(17);
    expect(calculateAge('2008-09-26', new Date(2026, 8, 26))).toBe(18);
    expect(formatDui('123456789')).toBe('12345678-9');
  });
});
