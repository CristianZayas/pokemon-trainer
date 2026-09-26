import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly pending = signal(0);
  readonly active = this.pending.asReadonly();
  start(): void { this.pending.update(value => value + 1); }
  end(): void { this.pending.update(value => Math.max(0, value - 1)); }
}
