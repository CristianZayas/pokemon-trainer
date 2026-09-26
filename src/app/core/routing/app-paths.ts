export const APP_PATHS = {
  profile: 'perfil-entrenador',
  team: 'seleccionar-equipo',
  summary: 'mi-perfil',
} as const;

export type AppPath = (typeof APP_PATHS)[keyof typeof APP_PATHS];

export const appUrl = (path: AppPath): `/${AppPath}` => `/${path}`;
