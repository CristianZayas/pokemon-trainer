import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { LoggingService } from '@core/logging/logging.service';

export const errorReportingInterceptor: HttpInterceptorFn = (request, next) => {
  const logger = inject(LoggingService);
  return next(request).pipe(catchError(error => {
    logger.error(error, { method: request.method, url: request.urlWithParams });
    return throwError(() => error);
  }));
};
