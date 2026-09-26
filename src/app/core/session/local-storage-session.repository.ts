import { Injectable } from '@angular/core';
import { z } from 'zod';
import { PokemonSchema } from '@domain/pokemon/pokemon.schema';
import { TrainerProfileSchema } from '@domain/trainer/trainer.schema';
import { SessionRepository, TrainerSession } from './session-repository.port';

const STORAGE_KEY = 'pokemon-trainer/session';
const EMPTY_SESSION: TrainerSession = { profile: null, team: [] };
const SessionSchema = z.object({
  profile: TrainerProfileSchema.nullable(),
  team: z.array(PokemonSchema).max(3),
});

@Injectable()
export class LocalStorageSessionRepository implements SessionRepository {
  load(): TrainerSession {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (!value) return EMPTY_SESSION;
      const parsed = SessionSchema.safeParse(JSON.parse(value));
      return parsed.success ? parsed.data : EMPTY_SESSION;
    } catch {
      return EMPTY_SESSION;
    }
  }

  save(session: TrainerSession): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); } catch { /* Storage can be unavailable or full. */ }
  }

  clear(): void {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage can be unavailable. */ }
  }
}
