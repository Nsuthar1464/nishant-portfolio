// Single source of truth for the hero 3D model.
// Set this to the model path once the .glb is in public/models/ (e.g.
// "/models/nishant-head.glb"). While it is null, Character renders the
// flicker-free directional-sprite head instead, and the heavy three.js bundle
// is never loaded. Flipping this on is the only change needed to go live in 3D.
export const HERO_MODEL_URL: string | null = null;
