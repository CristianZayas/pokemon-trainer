# Pokémon Trainer

Angular 22 standalone application for creating a trainer profile and selecting three first-generation Pokémon from [PokéAPI](https://pokeapi.co/).

## Requirements

- Node.js 22 or newer and npm
- Docker for container deployment

## Run locally

```sh
npm ci
npm start
```

Open `http://localhost:4200`. The app needs internet access to load PokéAPI and Pokémon sprites. Profile data, uploaded photo, and identification are saved in the browser's local storage, so the in-progress profile survives a refresh on the same device.

## Checks

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The E2E test mocks PokéAPI to keep the flow deterministic. Unit tests cover validation, stat mapping, slug generation, and HTTP contracts.

## Production image

```sh
docker build -t pokemon-trainer .
docker run --rm -p 8080:8080 pokemon-trainer
```

Open `http://localhost:8080`. The container serves the compiled SPA with an unprivileged Nginx process, a `/healthz` endpoint, a fallback for client routes, and security headers. Deploy it behind a TLS-terminating reverse proxy so users access it via HTTPS; verify the proxy preserves the security headers. The HSTS header applies to HTTPS responses seen by the browser.

## Structure and decisions

- `core`: configuration, HTTP interceptors, PokéAPI repository, session store, guards, logging, and realtime adapters.
- `domain`: Zod schemas and inferred types, mapping and business rules.
- `features`: trainer form, Pokémon team selection, trainer summary. Routes are lazy loaded.
- `shared`: reusable pure slug service.

PokéAPI and the Pokémon sprite CDN URLs live in `src/environments/environment.ts`; `environment.development.ts` supplies their development values through Angular file replacement. The SockJS gateway is disabled by default through `APP_SETTINGS` because there is no realtime server in this exercise. To activate it, provide a compatible HTTPS SockJS endpoint and enable the flag; then extend Nginx CSP `connect-src` for that endpoint. The gateway transmits raw events and does not assume an undocumented STOMP protocol.

The request security interceptor limits API calls to the configured HTTPS origin. Zod validates external response bodies before domain mapping. TLS and browser certificate checks provide transport security; a frontend interceptor alone cannot prevent a man-in-the-middle attack.

The console logger records failed HTTP requests with their method and URL. Its `LoggingService` port can be replaced with a remote reporter such as Sentry without changing features or interceptors.

## Git Flow

Use `main` for releases, `develop` for integration, and `feature/*` for work branches. This exercise is implemented on `feature/pokemon-trainer` with one commit per phase. Open a pull request to `develop`, verify CI, then merge a tested release into `main`.

## Design reference

The supplied Figma file established the screen flow. Its connector did not grant node inspection or asset export, so exact Figma tokens and illustration assets could not be verified. The implementation uses a coherent yellow/blue trainer layout and can be calibrated to Figma once inspection access is available.
