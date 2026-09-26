import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TrainerSessionStore } from '../state/trainer-session.store';

export const teamGuard: CanActivateFn = () => inject(TrainerSessionStore).hasCompleteTeam()
  || inject(Router).createUrlTree(['/seleccionar-equipo']);
