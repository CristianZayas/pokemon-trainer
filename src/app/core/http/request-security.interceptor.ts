import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { APP_SETTINGS } from '../config/app-settings';

export const requestSecurityInterceptor: HttpInterceptorFn = (request, next) => {
  const base = new URL(inject(APP_SETTINGS).apiBaseUrl);
  const target = new URL(request.url);
  if (base.protocol !== 'https:' || target.protocol !== 'https:' || target.origin !== base.origin) {
    throw new Error('Request blocked: insecure or unauthorized API origin');
  }
  if (!['GET', 'HEAD'].includes(request.method)) throw new Error('Request blocked: unsupported method');
  return next(request);
};
