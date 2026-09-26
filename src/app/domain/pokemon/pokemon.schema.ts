import { z } from 'zod';

export const PokemonListResponseSchema = z.object({
  results: z.array(z.object({ name: z.string().min(1), url: z.url() })),
});

export const PokemonDetailResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  sprites: z.object({ other: z.object({ home: z.object({ front_default: z.string().nullable() }) }) }),
  types: z.array(z.object({ type: z.object({ name: z.string() }) })),
  stats: z.array(z.object({ base_stat: z.number().nonnegative(), stat: z.object({ name: z.string() }) })),
});

export type PokemonListResponse = z.infer<typeof PokemonListResponseSchema>;
export type PokemonDetailResponse = z.infer<typeof PokemonDetailResponseSchema>;

export const STAT_MAXIMUMS = {
  hp: 255,
  attack: 190,
  defense: 230,
  'special-attack': 194,
  'special-defense': 230,
  speed: 180,
} as const;

export type PokemonSummary = Readonly<{ id: number; name: string; sprite: string }>;
export type Pokemon = Readonly<{ id: number; name: string; sprite: string; types: string[]; stats: { name: keyof typeof STAT_MAXIMUMS; value: number; percent: number }[] }>;

export const PokemonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  sprite: z.string(),
  types: z.array(z.string()),
  stats: z.array(z.object({
    name: z.enum(['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']),
    value: z.number().nonnegative(),
    percent: z.number().min(0).max(100),
  })),
});

export function mapPokemon(value: PokemonDetailResponse): Pokemon {
  return {
    id: value.id,
    name: value.name,
    sprite: value.sprites.other.home.front_default ?? '',
    types: value.types.map(entry => entry.type.name),
    stats: value.stats.filter(entry => entry.stat.name in STAT_MAXIMUMS).map(entry => {
      const name = entry.stat.name as keyof typeof STAT_MAXIMUMS;
      return { name, value: entry.base_stat, percent: Math.min(100, Math.round(entry.base_stat / STAT_MAXIMUMS[name] * 100)) };
    }),
  };
}
