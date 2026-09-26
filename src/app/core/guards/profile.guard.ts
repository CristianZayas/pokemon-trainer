import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TrainerSessionStore } from '../state/trainer-session.store';

export const profileGuard: CanActivateFn = () => inject(TrainerSessionStore).hasProfile()
  || inject(Router).createUrlTree(['/perfil-entrenador']);
