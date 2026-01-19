import * as THREE from "three";

/* ============================================================
   🔧 GLOBAL TUNING CONTROLS (EDIT THESE)
   ============================================================ */

export const RING_RADIUS = 200;
export const SPHERE_RADIUS = 9.2;
export const SPHERE_PARTICLES = 2600;
export const LABEL_HEIGHT = 12.0;

export const CENTER_RADIUS = 10.0;
export const CENTER_PARTICLES = 3400;
export const CENTER_LABEL_HEIGHT = 14.0;

export const STAR_COUNT = 6000;

/* ============================================================
   🏷️ LABEL / TEXT BILLBOARD TUNING (EDIT THESE)
   ============================================================ */

export const LABEL_FONT_SIZE = 1.25;
export const CENTER_LABEL_FONT_SIZE = 0.95;
export const LABEL_MAX_WIDTH = 28;

export const LABEL_OUTLINE_WIDTH = 0.02; // 0 disables outline
export const LABEL_OUTLINE_OPACITY = 0.75;

export const BILLBOARD_LOCK_X = false;
export const BILLBOARD_LOCK_Y = false;
export const BILLBOARD_LOCK_Z = false;

/* ============================================================
   🌑 DIMMING / BRIGHTNESS CONTROLS (EDIT THESE)
   ============================================================ */

export const BLOOM_INTENSITY = 0.4;
export const BLOOM_THRESHOLD = 0.75;
export const BLOOM_SMOOTHING = 0.1;

export const PARTICLE_BRIGHTNESS = 0.8;

/* ============================================================
   🎥 CAMERA FOCUS CONTROLS (EDIT THESE)
   ============================================================ */

export const FOCUS_DISTANCE = 55;
export const FOCUS_LERP_SPEED = 0.08;
export const TARGET_LERP_SPEED = 0.12;
export const RETURN_LERP_SPEED = 0.08;

export const DISABLE_AUTOROTATE_ON_FOCUS = true;

export const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 0, 72);
export const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

/* ============================================================
   🌌 SPIRAL GALAXY (EDIT THESE)
   ============================================================ */

export const GALAXY_Y = -90;
export const GALAXY_RADIUS = 220;
export const GALAXY_COUNT = 14000;
export const GALAXY_ARMS = 4;
export const GALAXY_SPIN = 2.4;
export const GALAXY_RANDOMNESS = 0.42;
export const GALAXY_THICKNESS = 10;
export const GALAXY_BRIGHTNESS = 0.55;

export const GALAXY_CORE_COLOR = "#FFFFFF";
export const GALAXY_ARM_COLOR = "#A78BFA";
export const GALAXY_DUST_COLOR = "#22D3EE";

/* ============================================================
   ⚡ PULSAR / JET (EDIT THESE)
   ============================================================ */

export const PULSAR_BASE_Y = GALAXY_Y;

export const PULSAR_BEAM_HEIGHT_UP = 900;
export const PULSAR_BEAM_RADIUS = 0.9;

export const PULSAR_BEAM_COLOR = "#B388FF";
export const PULSAR_BEAM_INTENSITY = 1.2;

export const PULSAR_PULSE_AMOUNT = 0.55;
export const PULSAR_PULSE_SPEED = 2.2;
export const PULSAR_STREAK_DENSITY = 10.0;

export const PULSAR_DISK_RADIUS = 32;
export const PULSAR_DISK_THICKNESS = 2.0;
export const PULSAR_DISK_COLOR = "#FFB46A";
export const PULSAR_DISK_INTENSITY = 0.8;
export const PULSAR_DISK_SPIN = 0.25;

/* ============================================================
   🧾 SCENE ITEMS
   ============================================================ */

export const CLASS_SPHERES = [
  { label: "COMP 484: Web Engineering", color: "#22D3EE" },
  { label: "COMP 584: Advanced Web Engineering", color: "#A78BFA" },
  { label: "COMP 467: Multimedia System Design", color: "#F472B6" },
  { label: "COMP 582: Software Verification and Validation", color: "#34D399" },
  { label: "COMP 587: Software Requirements and Verification", color: "#FB7185" },
  { label: "Senior Design Project", color: "#FBBF24" },
];

export const ABOUT_ME = {
  label: "About Me",
  color: "#60A5FA",
};
