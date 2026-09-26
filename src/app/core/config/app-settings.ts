import { InjectionToken } from '@angular/core';

export const APP_SETTINGS = new InjectionToken<AppSettings>('APP_SETTINGS', {
  providedIn: 'root',
  factory: () => ({ apiBaseUrl: 'https://pokeapi.co/api/v2/', realtimeEnabled: false, realtimeUrl: '' }),
});

export type AppSettings = Readonly<{
  apiBaseUrl: string;
  realtimeEnabled: boolean;
  realtimeUrl: string;
}>;
