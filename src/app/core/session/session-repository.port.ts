import { Pokemon } from '@domain/pokemon/pokemon.schema';
import { TrainerProfile } from '@domain/trainer/trainer.schema';

export type TrainerSession = Readonly<{
  profile: TrainerProfile | null;
  team: Pokemon[];
}>;

export abstract class SessionRepository {
  abstract load(): TrainerSession;
  abstract save(session: TrainerSession): void;
  abstract clear(): void;
}
