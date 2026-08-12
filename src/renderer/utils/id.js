// =============================================================
// NOVA v2 — ID generator
// -------------------------------------------------------------
// Collision-resistant local ID generation.
// =============================================================

/**
 * Generate a local unique ID. We use Date.now() + a random
 * suffix to avoid collisions when adding many records in the
 * same millisecond.
 */
export const newId = () =>
  ${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)};
