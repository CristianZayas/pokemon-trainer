# Architecture

The application is a standalone Angular application organized around a small set of explicit boundaries:

- `domain` owns validation schemas, types, and pure transformations. It has no Angular or infrastructure dependencies.
- `features` contain route-level UI and coordinate domain rules with core services.
- `core` contains application infrastructure, guards, HTTP concerns, and adapters.

## Ports and adapters

`TrainerRealtimePort` isolates optional SockJS delivery. `SockJsTrainerRealtimeGateway` is the production adapter and `NoopTrainerRealtimeGateway` is selected when realtime is disabled.

`SessionRepository` isolates browser persistence. `LocalStorageSessionRepository` validates restored data with Zod before returning it to `TrainerSessionStore`; `MemorySessionRepository` is available for isolated tests. The store exposes signals and persists every profile or team change.

`LoggingService` isolates error reporting. The default `ConsoleLoggingService` receives normalized HTTP failures through `errorReportingInterceptor`. A remote adapter can replace this provider without touching call sites.

## UI conventions

Routes are declared with `APP_PATHS`, preventing route-name drift between configuration and navigation. User-facing runtime messages are colocated in feature `messages.ts` files. Pokémon type colors are domain-level tokens in `pokemon-types.ts`, keeping the full type palette out of component CSS.
