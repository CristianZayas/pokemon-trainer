import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrainerSessionStore } from '../../core/state/trainer-session.store';
import { STAT_LABELS } from '../../domain/pokemon/pokemon.schema';
import { calculateAge } from '../../domain/trainer/trainer.schema';
import { SlugService } from '../../shared/slug.service';

@Component({ selector: 'app-trainer-summary', imports: [RouterLink], templateUrl: './trainer-summary.html', styleUrl: './trainer-summary.css' })
export class TrainerSummaryPage {
  readonly store = inject(TrainerSessionStore);
  readonly slugs = inject(SlugService);
  readonly statLabels = STAT_LABELS;
  age(): number | null { return calculateAge(this.store.profile()?.birthDate ?? ''); }
}
