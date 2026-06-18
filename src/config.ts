// ─────────────────────────────────────────────────────────────────────────────
// App configuration.
//
// USE_MOCK_API toggles the data source for links (and keeps auth on the mock).
// No backend is running yet, so this defaults to `true` (localStorage mock).
// To use the real API, run the backend and set VITE_USE_MOCK_API=false in .env.
// ─────────────────────────────────────────────────────────────────────────────

export const USE_MOCK_API =
    (import.meta.env.VITE_USE_MOCK_API ?? "true") !== "false";
