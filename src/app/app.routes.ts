import { Routes } from '@angular/router';
import { profileGuard } from './core/guards/profile.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'perfil-entrenador' },
  { path: 'perfil-entrenador', loadComponent: () => import('./features/trainer-profile/trainer-profile').then(m => m.TrainerProfilePage) },
  { path: 'seleccionar-equipo', canActivate: [profileGuard], loadComponent: () => import('./features/pokemon-team/pokemon-team').then(m => m.PokemonTeamPage) },
  { path: 'mi-perfil', loadComponent: () => import('./shared/placeholder').then(m => m.Placeholder) },
  { path: '**', redirectTo: 'perfil-entrenador' },
];
