import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { profileGuard } from './profile.guard';
import { teamGuard } from './team.guard';
import { TrainerSessionStore } from '../state/trainer-session.store';
import { Pokemon } from '../../domain/pokemon/pokemon.schema';

const pokemon = (id: number): Pokemon => ({ id, name: `pokemon-${id}`, sprite: '', types: [], stats: [] });

describe('trainer route guards', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));
  it('redirects incomplete sessions and accepts a full team', () => {
    const store = TestBed.inject(TrainerSessionStore);
    const router = TestBed.inject(Router);
    const run = (guard: typeof profileGuard) => TestBed.runInInjectionContext(() => guard({} as never, {} as never));
    expect(router.serializeUrl(run(profileGuard) as UrlTree)).toBe('/perfil-entrenador');
    store.saveProfile({ name: 'Ash', hobby: '', birthDate: '2000-01-01', document: '12345678-9', photoDataUrl: 'data:image/png;base64,AA==' });
    expect(run(profileGuard)).toBe(true);
    expect(router.serializeUrl(run(teamGuard) as UrlTree)).toBe('/seleccionar-equipo');
    [1, 2, 3, 4].forEach(id => store.togglePokemon(pokemon(id)));
    expect(store.team().map(entry => entry.id)).toEqual([1, 2, 3]);
    expect(run(teamGuard)).toBe(true);
  });
});
