import { expect, test } from '@playwright/test';

const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==', 'base64');
const names = ['bulbasaur', 'ivysaur', 'venusaur'];

test('builds and edits a trainer team through friendly URLs', async ({ page }) => {
  await page.route('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0', route => route.fulfill({ json: {
    results: Array.from({ length: 151 }, (_, index) => ({ name: names[index] ?? `pokemon-${index + 1}`, url: `https://pokeapi.co/api/v2/pokemon/${index + 1}/` })),
  } }));
  await page.route(/https:\/\/pokeapi\.co\/api\/v2\/pokemon\/[123]$/, route => {
    const id = Number(route.request().url().split('/').pop());
    return route.fulfill({ json: {
      id, name: names[id - 1], sprites: { other: { home: { front_default: `https://example.com/${id}.png` } } },
      types: [{ type: { name: 'grass' } }],
      stats: [{ base_stat: 50, stat: { name: 'hp' } }, { base_stat: 60, stat: { name: 'attack' } }],
    } });
  });
  await page.goto('/mi-perfil');
  await expect(page).toHaveURL(/\/perfil-entrenador$/);
  await page.locator('#photo').setInputFiles({ name: 'avatar.png', mimeType: 'image/png', buffer: pixel });
  await page.getByRole('textbox', { name: 'Nombre completo *' }).fill('Ash Ketchum');
  await page.getByLabel('Fecha de nacimiento *').fill('2000-05-22');
  await page.getByRole('button', { name: 'Continuar al equipo' }).click();
  await expect(page.getByRole('alert')).toContainText('DUI válido');
  await page.getByLabel('DUI *').fill('123456789');
  await page.getByRole('button', { name: 'Continuar al equipo' }).click();
  await expect(page).toHaveURL(/\/seleccionar-equipo$/);
  await page.getByRole('searchbox', { name: 'Buscar por nombre o ID' }).fill('25');
  await expect(page.getByRole('button', { name: 'Elegir a pokemon-25' })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Buscar por nombre o ID' }).fill('');
  for (const name of names) await page.getByRole('button', { name: `Elegir a ${name}` }).click();
  await expect(page.getByText('3 de 3 Pokémon')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Elegir a pokemon-4' })).toBeDisabled();
  await page.getByRole('button', { name: 'Ver mi perfil' }).click();
  await expect(page).toHaveURL(/\/mi-perfil$/);
  await expect(page.getByRole('heading', { name: 'Ash Ketchum' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'bulbasaur' })).toBeVisible();
  await page.getByRole('link', { name: 'Editar perfil' }).click();
  await expect(page.getByRole('textbox', { name: 'Nombre completo *' })).toHaveValue('Ash Ketchum');
  await page.getByRole('textbox', { name: 'Nombre completo *' }).fill('Misty');
  await expect(page.getByRole('textbox', { name: 'Nombre completo *' })).toHaveValue('Misty');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page).toHaveURL(/\/mi-perfil$/);
  await expect(page.getByRole('heading', { name: 'Misty' })).toBeVisible();
});

test('loads the optional SockJS browser client without breaking app startup', async ({ page }) => {
  await page.goto('/perfil-entrenador');
  await expect(page.getByRole('heading', { name: 'Comienza tu aventura' })).toBeVisible();
  await page.addScriptTag({ url: '/vendor/sockjs.min.js' });
  expect(await page.evaluate(() => typeof (window as Window & { SockJS?: unknown }).SockJS)).toBe('function');
});
