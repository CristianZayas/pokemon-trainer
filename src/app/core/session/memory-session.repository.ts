import { Injectable } from '@angular/core';
import { SessionRepository, TrainerSession } from './session-repository.port';

const EMPTY_SESSION: TrainerSession = { profile: null, team: [] };

@Injectable()
export class MemorySessionRepository implements SessionRepository {
  private session = EMPTY_SESSION;

  load(): TrainerSession { return this.session; }
  save(session: TrainerSession): void { this.session = session; }
  clear(): void { this.session = EMPTY_SESSION; }
}
