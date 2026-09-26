export const POKEMON_TEAM_MESSAGES = {
  catalogLoadFailed: 'No se pudo cargar el catálogo. Revisa tu conexión e inténtalo de nuevo.',
  pokemonLoadFailed: (name: string) => `No se pudo cargar a ${name}. Inténtalo de nuevo.`,
} as const;
