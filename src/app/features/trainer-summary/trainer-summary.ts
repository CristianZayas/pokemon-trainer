import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrainerSessionStore } from '@core/state/trainer-session.store';
import { DEFAULT_POKEMON_TYPE_STYLE, POKEMON_TYPE_STYLES, PokemonTypeStyle } from '@domain/pokemon/pokemon-types';
import { calculateAge } from '@domain/trainer/trainer.schema';
import { SlugService } from '@shared/slug.service';
import { TRAINER_SUMMARY_MESSAGES } from './messages';

@Component({ selector: 'app-trainer-summary', imports: [RouterLink], templateUrl: './trainer-summary.html', styleUrl: './trainer-summary.css' })
export class TrainerSummaryPage {
  readonly store = inject(TrainerSessionStore);
  readonly slugs = inject(SlugService);
  readonly statLabels = TRAINER_SUMMARY_MESSAGES.statLabels;
  age(): number | null { return calculateAge(this.store.profile()?.birthDate ?? ''); }
  typeStyle(type: string): PokemonTypeStyle { return POKEMON_TYPE_STYLES[type] ?? DEFAULT_POKEMON_TYPE_STYLE; }

  statBarColor(types: readonly string[]): string {
    const [primary, secondary] = types.map(type => this.typeStyle(type));
    if (!secondary) return primary?.foreground ?? DEFAULT_POKEMON_TYPE_STYLE.foreground;

    return `linear-gradient(90deg, ${primary.foreground}, ${secondary.foreground})`;
  }

  statTrackColor(types: readonly string[]): string {
    return this.typeStyle(types[0] ?? '').background;
  }
}
