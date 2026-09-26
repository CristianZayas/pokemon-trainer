import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'perfil-entrenador' },
  { path: 'perfil-entrenador', loadComponent: () => import('./shared/placeholder').then(m => m.Placeholder) },
  { path: 'seleccionar-equipo', loadComponent: () => import('./shared/placeholder').then(m => m.Placeholder) },
  { path: 'mi-perfil', loadComponent: () => import('./shared/placeholder').then(m => m.Placeholder) },
  { path: '**', redirectTo: 'perfil-entrenador' },
];
