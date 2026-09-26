import { Observable } from 'rxjs';

export abstract class TrainerRealtimePort {
  abstract readonly events$: Observable<string>;
  abstract connect(): void;
  abstract disconnect(): void;
}
