import { expect, test } from '@playwright/test';

const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==', 'base64');
const names = ['bulbasaur', 'ivysaur', 'venusaur', 'charmander'];

test('builds and edits a trainer team through friendly URLs', async ({ page }) => {
  await page.route('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0', route => route.fulfill({ json: {
    results: Array.from({ length: 151 }, (_, index) => ({ name: names[index] ?? `pokemon-${index + 1}`, url: `https://pokeapi.co/api/v2/pokemon/${index + 1}/` })),
  } }));
  await page.route(/https:\/\/pokeapi\.co\/api\/v2\/pokemon\/[1234]$/, route => {
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
  for (const name of names.slice(0, 3)) await page.getByRole('button', { name: `Elegir a ${name}` }).click();
  await expect(page.getByText('3 de 3 Pokémon')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Elegir a charmander' })).toBeDisabled();
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
  await page.getByRole('link', { name: 'Editar Pokémon' }).click();
  await expect(page.getByText('3 de 3 Pokémon')).toBeVisible();
  await page.getByRole('button', { name: 'Quitar a venusaur' }).last().click();
  await expect(page.getByText('2 de 3 Pokémon')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ver mi perfil' })).toBeDisabled();
  await page.getByRole('button', { name: 'Elegir a charmander' }).click();
  await page.getByRole('button', { name: 'Ver mi perfil' }).click();
  await expect(page.getByRole('heading', { name: 'charmander' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'venusaur' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Editar perfil' }).click();
  await expect(page.getByRole('textbox', { name: 'Nombre completo *' })).toHaveValue('Misty');
  await page.getByRole('textbox', { name: 'Nombre completo *' }).fill('Discarded name');
  await page.getByRole('button', { name: 'Descartar cambios' }).click();
  await expect(page.getByRole('dialog', { name: '¿Descartar cambios?' })).toBeVisible();
  await page.getByRole('button', { name: 'Seguir editando' }).click();
  await expect(page.getByRole('textbox', { name: 'Nombre completo *' })).toHaveValue('Discarded name');
  await page.getByRole('button', { name: 'Descartar cambios' }).click();
  await page.getByRole('button', { name: 'Descartar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Misty' })).toBeVisible();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/mi-perfil$/);
  await expect(page.getByRole('heading', { name: 'Misty' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'charmander' })).toBeVisible();
});

test('minor can continue without an identification document', async ({ page }) => {
  await page.route('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0', route => route.fulfill({ json: { results: [] } }));
  await page.goto('/perfil-entrenador');
  await page.locator('#photo').setInputFiles({ name: 'avatar.png', mimeType: 'image/png', buffer: pixel });
  await page.getByRole('textbox', { name: 'Nombre completo *' }).fill('Young trainer');
  await page.getByLabel('Fecha de nacimiento *').fill('2015-05-22');
  await expect(page.getByRole('textbox', { name: 'Carnet de minoridad' })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar al equipo' }).click();
  await expect(page).toHaveURL(/\/seleccionar-equipo$/);
});

test('starts correctly while realtime is disabled', async ({ page }) => {
  await page.goto('/perfil-entrenador');
  await expect(page.getByRole('heading', { name: 'Comienza tu aventura' })).toBeVisible();
});
