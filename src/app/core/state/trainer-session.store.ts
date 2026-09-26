import { computed, Injectable, signal } from '@angular/core';
import { Pokemon } from '../../domain/pokemon/pokemon.schema';
import { TrainerProfile } from '../../domain/trainer/trainer.schema';

@Injectable({ providedIn: 'root' })
export class TrainerSessionStore {
  readonly profile = signal<TrainerProfile | null>(null);
  readonly team = signal<Pokemon[]>([]);
  readonly hasProfile = computed(() => this.profile() !== null);
  readonly hasCompleteTeam = computed(() => this.team().length === 3);

  saveProfile(profile: TrainerProfile): void { this.profile.set(profile); }
  togglePokemon(pokemon: Pokemon): void {
    this.team.update(team => team.some(entry => entry.id === pokemon.id)
      ? team.filter(entry => entry.id !== pokemon.id)
      : team.length < 3 ? [...team, pokemon] : team);
  }
}
