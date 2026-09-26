import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { APP_SETTINGS, AppSettings } from '@core/config/app-settings';
import { apiBaseUrlInterceptor } from '@core/http/api-base-url.interceptor';
import { requestSecurityInterceptor } from '@core/http/request-security.interceptor';
import { errorNormalizationInterceptor } from '@core/http/error-normalization.interceptor';
import { errorReportingInterceptor } from '@core/http/error-reporting.interceptor';
import { loadingInterceptor } from '@core/http/loading.interceptor';
import { ConsoleLoggingService, LoggingService } from '@core/logging/logging.service';
import { TrainerRealtimePort } from '@core/realtime/trainer-realtime.port';
import { NoopTrainerRealtimeGateway } from '@core/realtime/noop-trainer-realtime.gateway';
import { SockJsTrainerRealtimeGateway } from '@core/realtime/sockjs-trainer-realtime.gateway';
import { LocalStorageSessionRepository } from '@core/session/local-storage-session.repository';
import { SessionRepository } from '@core/session/session-repository.port';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiBaseUrlInterceptor, requestSecurityInterceptor, loadingInterceptor, errorReportingInterceptor, errorNormalizationInterceptor])),
    { provide: SessionRepository, useClass: LocalStorageSessionRepository },
    { provide: LoggingService, useClass: ConsoleLoggingService },
    {
      provide: TrainerRealtimePort,
      useFactory: (settings: AppSettings, sockJs: SockJsTrainerRealtimeGateway, noop: NoopTrainerRealtimeGateway) => settings.realtimeEnabled ? sockJs : noop,
      deps: [APP_SETTINGS, SockJsTrainerRealtimeGateway, NoopTrainerRealtimeGateway],
    },
    NoopTrainerRealtimeGateway,
    SockJsTrainerRealtimeGateway,
  ]
};
