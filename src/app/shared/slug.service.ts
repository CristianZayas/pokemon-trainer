import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SlugService {
  create(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
}
