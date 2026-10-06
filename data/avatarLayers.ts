export type AvatarPose = "hero" | "work" | "security";
export type AvatarLayers = {
  enabled: boolean;
  head: string;
  leftPupil: string;
  rightPupil: string;
  body?: string;
  pupilOffsets?: { left: [number, number]; right: [number, number] }; // Source-canvas pixels.
  maskOffsets?: { left: [number, number]; right: [number, number] };
  // Optional alpha mask: opaque inside BOTH eye openings, transparent elsewhere.
  // This clips only the pupils; it is not an image painted over the face.
  eyeMask?: string;
  canvas: { width: number; height: number };
  headOrigin: string;
  pupilLimit: { x: number; y: number }; // CSS pixels at the displayed size.
  headLimit: { pitch: number; yaw: number }; // Degrees; head only, never a camera.
  spring: { stiffness: number; damping: number; mass: number };
};
export const avatarLayers: Record<AvatarPose, AvatarLayers | null> = {
  hero: {
    // Hero uses the original flat artwork; keep custom eye layers disabled.
    // Loading or dimension failures preserve the existing flat-image fallback.
    enabled: false,
    head: "/images/nishant-head-base.png",
    leftPupil: "/images/nishant-left-pupil.png",
    rightPupil: "/images/nishant-right-pupil.png",
    // Set to "/images/nishant-eye-mask.png" if the eye-opening mask is supplied.
    eyeMask: "/images/nishant-eye-mask.png",
    pupilOffsets: { left: [-21, 82], right: [264, -39] },
    maskOffsets: { left: [-9, -15], right: [-20, -30] },
    canvas: { width: 1254, height: 1254 }, // Match original nishant-head.png.
    headOrigin: "50% 75%", // Starting pivot near the lower head; tune to artwork.
    pupilLimit: { x: 0.5, y: 0.35 }, // Symmetric +/- offsets from artwork's neutral gaze.
    headLimit: { pitch: 0, yaw: 0 },
    spring: { stiffness: 110, damping: 24, mass: 1 },
    // Neutral: normalized cursor (0,0), pupil offset (0px,0px), head (0deg,0deg).
  },
  work: null,
  security: null,
};
