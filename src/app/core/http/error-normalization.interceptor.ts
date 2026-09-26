import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError, timeout } from 'rxjs';
import { AppRequestError } from '../../domain/errors';

export const errorNormalizationInterceptor: HttpInterceptorFn = (request, next) => next(request).pipe(
  timeout(15000),
  catchError(error => {
    if (error instanceof AppRequestError) return throwError(() => error);
    if (error instanceof HttpErrorResponse) {
      const message = error.status === 0 ? 'No se pudo conectar con PokéAPI.'
        : error.status === 404 ? 'No se encontró el Pokémon solicitado.'
        : 'PokéAPI no está disponible en este momento.';
      return throwError(() => new AppRequestError(message, error.status));
    }
    return throwError(() => new AppRequestError('La solicitud tardó demasiado. Inténtalo de nuevo.'));
  }),
);
