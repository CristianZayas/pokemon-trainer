import { Observable } from 'rxjs';

export abstract class TrainerRealtimePort {
  abstract readonly events$: Observable<string>;
  abstract connect(): Promise<void>;
  abstract disconnect(): void;
}
