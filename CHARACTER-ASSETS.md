# Independent character attention

The existing assets are flat WebP illustrations, not Three.js or WebGL models. Their eye whites and pupils are baked into the image. The seated and standing compositions now stay anchored; the head-only hero has a maximum 4-degree horizontal and 3-degree vertical head tilt, with a neutral return outside its area.

`components/AttentionLayers.tsx` provides independent head and pupil motion. Activate each pose in `data/avatarLayers.ts` when matching transparent layers are available. No substituted character artwork is used.

For each pose (hero, seated work, standing security), provide these four aligned transparent PNG or WebP files:

- `body`: body and equipment without the head; for the hero, an empty transparent canvas. Fill any areas revealed behind the head.
- `head`: same face/hair/ears, with eye whites and eyelids intact, but both pupils/irises removed and the exposed whites filled.
- `leftPupil`: only the left iris/pupil and its highlights.
- `rightPupil`: only the right iris/pupil and its highlights.

All four files must share the same dimensions, transparent padding, alignment and scale as the original pose. Supply `headOrigin` as percentage coordinates at the neck pivot (e.g. `50% 45%`, adjusted per artwork). Leave enough white around the neutral pupils for up to 3 CSS pixels horizontally and 2 vertically; if that does not fit, reduce those limits in AttentionLayers. The chart background remains separate and static.

The controller uses Motion springs without per-pointer React state, coalesces pointer input to one animation frame, and resets on pointer leave, blur, idle or reduced motion. It does not animate a camera. A true 3D gaze across large viewing angles would need a rigged model, which these assets do not provide.

# Rendering efficiency

Technology canvas is capped at 1.5 DPR and 30 rendered frames per second while active. Its animation scheduling stops when idle, hidden, unfocused or outside the viewport; input/selection redraws on demand. Character floats pause on those same conditions. Stars retain their appearance but no longer animate 100 separate elements. One shared activity listener set uses a five-second inactivity timeout. Small static shadows remain; there are no lights, bloom, particles, reflection passes or high-poly geometry.
