import { Routes } from '@angular/router';
import { profileGuard } from './core/guards/profile.guard';
import { teamGuard } from './core/guards/team.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'perfil-entrenador' },
  { path: 'perfil-entrenador', loadComponent: () => import('./features/trainer-profile/trainer-profile').then(m => m.TrainerProfilePage) },
  { path: 'seleccionar-equipo', canActivate: [profileGuard], loadComponent: () => import('./features/pokemon-team/pokemon-team').then(m => m.PokemonTeamPage) },
  { path: 'mi-perfil', canActivate: [profileGuard, teamGuard], loadComponent: () => import('./features/trainer-summary/trainer-summary').then(m => m.TrainerSummaryPage) },
  { path: '**', redirectTo: 'perfil-entrenador' },
];
