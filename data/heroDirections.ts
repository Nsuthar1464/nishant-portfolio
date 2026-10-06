export const heroDirections = ["center", "left", "right", "up", "down", "up-left", "up-right", "down-left", "down-right"] as const;
export type HeroDirection = typeof heroDirections[number];
// DirectionalHead uses a cover-first crossfade (the incoming pose fades in over
// a fully-opaque outgoing one), so the fade no longer darkens mid-swap and can
// be long enough to read as a smooth morph between adjacent poses rather than a
// photo cut. Kept moderate so two poses don't visibly co-exist for too long.
export const heroSpriteSettings = { enter: 0.30, exit: 0.20, reverse: 0.42, dwellMs: 65, crossfadeMs: 150 };
export const heroSpritePath = (direction: HeroDirection) => `/images/hero-directions/nishant-${direction}.webp`;

// Hysteresis uses smoothed spring values, not raw pointer events.
export function selectHeroDirection(x: number, y: number, previous: HeroDirection): HeroDirection {
  const axis = (value: number, negative: string, positive: string) => {
    const held = previous.includes(value < 0 ? negative : positive);
    const opposite = previous.includes(value < 0 ? positive : negative);
    return Math.abs(value) >= (held ? heroSpriteSettings.exit : opposite ? heroSpriteSettings.reverse : heroSpriteSettings.enter)
      ? value < 0 ? negative : positive : "";
  };
  const horizontal = axis(x, "left", "right");
  const vertical = axis(y, "up", "down");
  return (vertical && horizontal ? `${vertical}-${horizontal}` : vertical || horizontal || "center") as HeroDirection;
}

const coordinates = (d: HeroDirection): [number, number] => [d.includes("left") ? -1 : d.includes("right") ? 1 : 0, d.includes("up") ? -1 : d.includes("down") ? 1 : 0];
const fromCoordinates = (a: number, b: number): HeroDirection => {
  const horizontal = a < 0 ? "left" : a > 0 ? "right" : "";
  const vertical = b < 0 ? "up" : b > 0 ? "down" : "";
  return (vertical && horizontal ? `${vertical}-${horizontal}` : vertical || horizontal || "center") as HeroDirection;
};

// Change one axis per fade: diagonals pass through a neighboring cardinal pose;
// opposite poses pass through neutral instead of crossfading directly across the face.
export function neighboringHeroDirection(current: HeroDirection, target: HeroDirection, x: number, y: number): HeroDirection {
  const [a, b] = coordinates(current), [c, d] = coordinates(target);
  if (a === c && b === d) return current;
  const horizontal = a !== c && (b === d || Math.abs(x) >= Math.abs(y));
  return horizontal ? fromCoordinates(a + Math.sign(c - a), b) : fromCoordinates(a, b + Math.sign(d - b));
}
