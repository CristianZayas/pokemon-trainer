import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { APP_SETTINGS } from './core/config/app-settings';
import { apiBaseUrlInterceptor } from './core/http/api-base-url.interceptor';
import { requestSecurityInterceptor } from './core/http/request-security.interceptor';
import { errorNormalizationInterceptor } from './core/http/error-normalization.interceptor';
import { loadingInterceptor } from './core/http/loading.interceptor';
import { TrainerRealtimePort } from './core/realtime/trainer-realtime.port';
import { NoopTrainerRealtimeGateway } from './core/realtime/noop-trainer-realtime.gateway';
import { SockJsTrainerRealtimeGateway } from './core/realtime/sockjs-trainer-realtime.gateway';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiBaseUrlInterceptor, requestSecurityInterceptor, loadingInterceptor, errorNormalizationInterceptor])),
    {
      provide: TrainerRealtimePort,
      useFactory: () => inject(APP_SETTINGS).realtimeEnabled ? inject(SockJsTrainerRealtimeGateway) : inject(NoopTrainerRealtimeGateway),
      deps: [],
    },
    NoopTrainerRealtimeGateway,
    SockJsTrainerRealtimeGateway,
  ]
};
