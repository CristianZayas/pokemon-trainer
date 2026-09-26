import { Injectable } from '@angular/core';

export type LogContext = Readonly<Record<string, unknown>>;

export abstract class LoggingService {
  abstract error(error: unknown, context?: LogContext): void;
}

@Injectable()
export class ConsoleLoggingService implements LoggingService {
  error(error: unknown, context: LogContext = {}): void {
    console.error('[pokemon-trainer]', context, error);
  }
}
