import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { PokemonApiRepository } from '@core/api/pokemon-api.repository';
import { TrainerSessionStore } from '@core/state/trainer-session.store';
import { appUrl, APP_PATHS } from '@core/routing/app-paths';
import { PokemonSummary } from '@domain/pokemon/pokemon.schema';
import { POKEMON_TEAM_MESSAGES } from './messages';

@Component({ selector: 'app-pokemon-team', imports: [ScrollingModule, RouterLink], templateUrl: './pokemon-team.html', styleUrl: './pokemon-team.css' })
export class PokemonTeamPage implements OnInit {
  private readonly api = inject(PokemonApiRepository);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly store = inject(TrainerSessionStore);
  readonly pokemon = signal<PokemonSummary[]>([]);
  readonly query = signal('');
  readonly pendingId = signal<number | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly filtered = computed(() => {
    const query = this.query().trim().toLowerCase();
    return query ? this.pokemon().filter(entry => entry.name.includes(query) || String(entry.id) === query) : this.pokemon();
  });
  readonly trackById = (_: number, entry: PokemonSummary) => entry.id;

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.listFirstGeneration().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => { this.pokemon.set(data); this.loading.set(false); },
      error: () => { this.error.set(POKEMON_TEAM_MESSAGES.catalogLoadFailed); this.loading.set(false); },
    });
  }
  search(event: Event): void { this.query.set((event.target as HTMLInputElement).value); }
  isSelected(id: number): boolean { return this.store.team().some(entry => entry.id === id); }
  toggle(entry: PokemonSummary): void {
    if (this.isSelected(entry.id)) {
      this.store.removePokemon(entry.id);
      return;
    }
    if (this.store.team().length >= 3 || this.pendingId() !== null) return;
    this.pendingId.set(entry.id);
    this.error.set('');
    this.api.getPokemon(entry.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: pokemon => { this.store.togglePokemon(pokemon); this.clearPending(entry.id); },
      error: () => { this.error.set(POKEMON_TEAM_MESSAGES.pokemonLoadFailed(entry.name)); this.clearPending(entry.id); },
    });
  }
  continue(): void { if (this.store.hasCompleteTeam()) void this.router.navigateByUrl(appUrl(APP_PATHS.summary)); }
  private clearPending(id: number): void { this.pendingId.update(pendingId => pendingId === id ? null : pendingId); }
}
