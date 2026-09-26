import { SlugService } from './slug.service';

describe('SlugService', () => {
  it('normalizes accents, punctuation and repeated separators', () => {
    expect(new SlugService().create('  Pokémon: ¡Águila & Ñandú!  ')).toBe('pokemon-aguila-nandu');
  });
});
