import { computed, inject, Injectable, signal } from '@angular/core';
import { Pokemon } from '@domain/pokemon/pokemon.schema';
import { TrainerProfile } from '@domain/trainer/trainer.schema';
import { SessionRepository } from '@core/session/session-repository.port';

@Injectable({ providedIn: 'root' })
export class TrainerSessionStore {
  private readonly repository = inject(SessionRepository);
  private readonly session = this.repository.load();
  readonly profile = signal<TrainerProfile | null>(this.session.profile);
  readonly team = signal<Pokemon[]>(this.session.team);
  readonly hasProfile = computed(() => this.profile() !== null);
  readonly hasCompleteTeam = computed(() => this.team().length === 3);

  saveProfile(profile: TrainerProfile): void { this.profile.set(profile); this.persist(); }
  togglePokemon(pokemon: Pokemon): void {
    this.team.update(team => team.some(entry => entry.id === pokemon.id)
      ? team.filter(entry => entry.id !== pokemon.id)
      : team.length < 3 ? [...team, pokemon] : team);
    this.persist();
  }
  removePokemon(id: number): void { this.team.update(team => team.filter(entry => entry.id !== id)); this.persist(); }
  clear(): void { this.profile.set(null); this.team.set([]); this.repository.clear(); }

  private persist(): void { this.repository.save({ profile: this.profile(), team: this.team() }); }
}
