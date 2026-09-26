import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_SETTINGS } from '../config/app-settings';
import { ExternalContractError } from '@domain/errors';
import { mapPokemon, Pokemon, PokemonDetailResponseSchema, PokemonListResponseSchema, PokemonSummary } from '../../domain/pokemon/pokemon.schema';

@Injectable({ providedIn: 'root' })
export class PokemonApiRepository {
  private readonly http = inject(HttpClient);
  private readonly settings = inject(APP_SETTINGS);

  listFirstGeneration(): Observable<PokemonSummary[]> {
    return this.http.get<unknown>('pokemon?limit=151&offset=0').pipe(map(response => {
      const parsed = PokemonListResponseSchema.safeParse(response);
      if (!parsed.success) throw new ExternalContractError('Pokémon list');
      return parsed.data.results.map(entry => {
        const match = /\/pokemon\/(\d+)\/?$/.exec(entry.url);
        if (!match) throw new ExternalContractError('Pokémon list ID');
        const id = Number(match[1]);
        return { id, name: entry.name, sprite: new URL(`${id}.png`, this.settings.pokemonSpritesBaseUrl).toString() };
      });
    }));
  }

  getPokemon(id: number): Observable<Pokemon> {
    return this.http.get<unknown>(`pokemon/${id}`).pipe(map(response => {
      const parsed = PokemonDetailResponseSchema.safeParse(response);
      if (!parsed.success || parsed.data.id !== id) throw new ExternalContractError(`Pokémon ${id}`);
      return mapPokemon(parsed.data);
    }));
  }
}
