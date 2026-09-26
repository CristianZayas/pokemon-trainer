import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { APP_SETTINGS } from '../config/app-settings';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (request, next) => {
  if (/^https?:\/\//i.test(request.url)) return next(request);
  const path = request.url.replace(/^\/+/, '');
  if (path.split('/').includes('..')) throw new Error('Invalid API path');
  const url = new URL(path, inject(APP_SETTINGS).apiBaseUrl).toString();
  return next(request.clone({ url }));
};
