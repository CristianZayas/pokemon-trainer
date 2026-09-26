import { InjectionToken } from '@angular/core';
import { environment } from '@env/environment.development';


export const APP_SETTINGS = new InjectionToken<AppSettings>('APP_SETTINGS', {
  providedIn: 'root',
  factory: () => environment,
});

export type AppSettings = Readonly<{
  apiBaseUrl: string;
  pokemonSpritesBaseUrl: string;
  realtimeEnabled: boolean;
  realtimeUrl: string;
}>;
