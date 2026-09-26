export type PokemonTypeStyle = Readonly<{ background: string; foreground: string }>;

export const POKEMON_TYPE_STYLES: Readonly<Record<string, PokemonTypeStyle>> = {
  normal: { background: '#ecebe3', foreground: '#5f5d50' },
  fire: { background: '#ffe0d1', foreground: '#a74723' },
  water: { background: '#dceeff', foreground: '#2866a4' },
  electric: { background: '#fff0b5', foreground: '#896600' },
  grass: { background: '#def3d3', foreground: '#427d3d' },
  ice: { background: '#d9f5f5', foreground: '#267a7a' },
  fighting: { background: '#f8d8d3', foreground: '#9b3026' },
  poison: { background: '#eddcf5', foreground: '#793b95' },
  ground: { background: '#f5e4c8', foreground: '#8a5b22' },
  flying: { background: '#e7e4ff', foreground: '#5a55a8' },
  psychic: { background: '#ffdbe8', foreground: '#aa3d68' },
  bug: { background: '#eaf1c8', foreground: '#607a21' },
  rock: { background: '#e8e2d1', foreground: '#71613b' },
  ghost: { background: '#e3def1', foreground: '#5c4b8a' },
  dragon: { background: '#e3dcff', foreground: '#5336b5' },
  dark: { background: '#e2dcda', foreground: '#4e3d38' },
  steel: { background: '#e4e9ee', foreground: '#586b7b' },
  fairy: { background: '#fbe0ee', foreground: '#9d4673' },
};

export const DEFAULT_POKEMON_TYPE_STYLE: PokemonTypeStyle = { background: '#eaf1f8', foreground: '#253b54' };
