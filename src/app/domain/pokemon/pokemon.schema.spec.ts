import { mapPokemon, PokemonDetailResponseSchema, PokemonListResponseSchema } from './pokemon.schema';

describe('Pokémon API contracts', () => {
  it('rejects malformed responses before mapping', () => {
    expect(PokemonListResponseSchema.safeParse({ results: [{ name: 'pikachu', url: 'bad' }] }).success).toBe(false);
    expect(PokemonDetailResponseSchema.safeParse({ id: 25, name: 'pikachu' }).success).toBe(false);
  });
  it('maps the home sprite and caps stat bars at 100%', () => {
    const response = PokemonDetailResponseSchema.parse({
      id: 25, name: 'pikachu', sprites: { other: { home: { front_default: 'https://example.com/p.png' } } },
      types: [{ type: { name: 'electric' } }],
      stats: [{ base_stat: 300, stat: { name: 'hp' } }, { base_stat: 55, stat: { name: 'attack' } }],
    });
    const mapped = mapPokemon(response);
    expect(mapped.sprite).toBe('https://example.com/p.png');
    expect(mapped.types).toEqual(['electric']);
    expect(mapped.stats[0].percent).toBe(100);
    expect(mapped.stats[1].percent).toBe(29);
  });
});
