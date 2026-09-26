import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PokemonApiRepository } from './pokemon-api.repository';
import { apiBaseUrlInterceptor } from '../http/api-base-url.interceptor';
import { requestSecurityInterceptor } from '../http/request-security.interceptor';
import { ExternalContractError } from '../../domain/errors';

describe('PokemonApiRepository', () => {
  let repository: PokemonApiRepository;
  let controller: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([apiBaseUrlInterceptor, requestSecurityInterceptor])), provideHttpClientTesting()] });
    repository = TestBed.inject(PokemonApiRepository);
    controller = TestBed.inject(HttpTestingController);
  });
  afterEach(() => controller.verify());
  it('completes the PokeAPI URL and derives generation-one IDs', () => {
    let result = 0;
    repository.listFirstGeneration().subscribe(value => result = value[0].id);
    controller.expectOne('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0')
      .flush({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }] });
    expect(result).toBe(1);
  });
  it('rejects an invalid external contract', () => {
    let actual: unknown;
    repository.getPokemon(1).subscribe({ error: error => actual = error });
    controller.expectOne('https://pokeapi.co/api/v2/pokemon/1').flush({ id: 1 });
    expect(actual).toBeInstanceOf(ExternalContractError);
  });
});
