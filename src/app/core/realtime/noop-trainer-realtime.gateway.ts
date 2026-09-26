import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { TrainerRealtimePort } from './trainer-realtime.port';

@Injectable()
export class NoopTrainerRealtimeGateway implements TrainerRealtimePort {
  readonly events$ = EMPTY;
  async connect(): Promise<void> {}
  disconnect(): void {}
}
