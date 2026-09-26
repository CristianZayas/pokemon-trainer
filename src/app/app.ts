import { Component, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TrainerSessionStore } from './core/state/trainer-session.store';

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly title = inject(Title);
  private readonly store = inject(TrainerSessionStore);

  constructor() {
    effect(() => {
      const name = this.store.profile()?.name;
      this.title.setTitle(name ? `${name} · Pokémon Trainer` : 'Pokémon Trainer · Tu aventura comienza aquí');
    });
  }
}
