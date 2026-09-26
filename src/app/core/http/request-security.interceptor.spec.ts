import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiBaseUrlInterceptor } from './api-base-url.interceptor';
import { requestSecurityInterceptor } from './request-security.interceptor';

describe('request security interceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([apiBaseUrlInterceptor, requestSecurityInterceptor])), provideHttpClientTesting()] }));
  it('blocks insecure or foreign origins and write methods', () => {
    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);
    const errors: unknown[] = [];
    http.get('http://pokeapi.co/api/v2/pokemon').subscribe({ error: error => errors.push(error) });
    http.get('https://untrusted.example/pokemon').subscribe({ error: error => errors.push(error) });
    http.post('pokemon', {}).subscribe({ error: error => errors.push(error) });
    expect(errors).toHaveLength(3);
    controller.expectNone(() => true);
    controller.verify();
  });
});
