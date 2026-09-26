import { Routes } from '@angular/router';
import { profileGuard } from '@core/guards/profile.guard';
import { teamGuard } from '@core/guards/team.guard';
import { APP_PATHS } from '@core/routing/app-paths';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: APP_PATHS.profile },
  { path: APP_PATHS.profile, loadComponent: () => import('./features/trainer-profile/trainer-profile').then(m => m.TrainerProfilePage) },
  { path: APP_PATHS.team, canActivate: [profileGuard], loadComponent: () => import('./features/pokemon-team/pokemon-team').then(m => m.PokemonTeamPage) },
  { path: APP_PATHS.summary, canActivate: [profileGuard, teamGuard], loadComponent: () => import('./features/trainer-summary/trainer-summary').then(m => m.TrainerSummaryPage) },
  { path: '**', redirectTo: APP_PATHS.profile },
];
