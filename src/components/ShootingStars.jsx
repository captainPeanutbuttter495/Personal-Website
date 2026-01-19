import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createStarTexture } from "./StarTexture";

/* ============================================================
   ☄️ SHOOTING STARS TUNING (EDIT THESE)
   ============================================================ */

// How many shooting stars can exist at once (pool size)
const SHOOTING_STAR_POOL = 10;

// Chance per second to spawn a star (higher = more frequent)
const SHOOTING_STAR_SPAWN_RATE = 0.45;

// Speed range (world units per second)
const SHOOTING_STAR_SPEED_MIN = 240;
const SHOOTING_STAR_SPEED_MAX = 420;

// Trail length (world units)
const SHOOTING_STAR_TRAIL_LENGTH = 90;

// Lifetime (seconds) before recycling
const SHOOTING_STAR_LIFETIME = 1.1;

// Spawn volume (a box)
const SPAWN_BOX = { x: 900, y: 420, z: 900 };

// Base direction (normalized). Adjust to change meteor direction.
const BASE_DIR = new THREE.Vector3(1, -0.35, 0.2).normalize();

// Color / head size
const STAR_COLOR = "#FFFFFF";
const HEAD_SIZE = 12;

export default function ShootingStars() {
  const tex = useMemo(() => createStarTexture(), []);
  const color = useMemo(() => new THREE.Color(STAR_COLOR), []);

  // Mutable star pool (allowed to mutate safely)
  const poolRef = useRef(null);

  // Refs to the rendered objects so we can update without re-rendering
  const lineRefs = useRef([]);
  const headRefs = useRef([]);

  // Initialize the pool once
  if (!poolRef.current) {
    poolRef.current = Array.from({ length: SHOOTING_STAR_POOL }, () => ({
      active: false,
      age: 0,
      speed: 0,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
    }));
  }

  // Pre-create geometries for each line (two points: tail -> head)
  const lineGeometries = useMemo(() => {
    return Array.from({ length: SHOOTING_STAR_POOL }, () => {
      const positions = new Float32Array(6);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      return { geo, positions };
    });
  }, []);

  const spawn = () => {
    const pool = poolRef.current;
    const star = pool.find((s) => !s.active);
    if (!star) return;

    star.active = true;
    star.age = 0;
    star.speed =
      SHOOTING_STAR_SPEED_MIN +
      Math.random() * (SHOOTING_STAR_SPEED_MAX - SHOOTING_STAR_SPEED_MIN);

    // spawn near/above camera area
    star.pos.set(
      (Math.random() - 0.5) * SPAWN_BOX.x,
      (Math.random() - 0.5) * SPAWN_BOX.y + 220,
      (Math.random() - 0.5) * SPAWN_BOX.z,
    );

    const jitter = new THREE.Vector3(
      (Math.random() - 0.5) * 0.25,
      (Math.random() - 0.5) * 0.18,
      (Math.random() - 0.5) * 0.25,
    );

    star.vel.copy(BASE_DIR).add(jitter).normalize().multiplyScalar(star.speed);
  };

  useFrame((state, delta) => {
    const pool = poolRef.current;
    if (!pool) return;

    // probabilistic spawn
    const chance = SHOOTING_STAR_SPAWN_RATE * delta;
    if (Math.random() < chance) spawn();

    for (let i = 0; i < pool.length; i++) {
      const s = pool[i];
      const line = lineRefs.current[i];
      const head = headRefs.current[i];
      const { positions, geo } = lineGeometries[i];

      if (!line || !head) continue;

      if (!s.active) {
        line.visible = false;
        head.visible = false;
        continue;
      }

      s.age += delta;
      s.pos.addScaledVector(s.vel, delta);

      // Tail behind head along velocity direction
      const tail = new THREE.Vector3()
        .copy(s.pos)
        .addScaledVector(s.vel, -(SHOOTING_STAR_TRAIL_LENGTH / s.speed));

      // Update line geometry positions (tail -> head)
      positions[0] = tail.x;
      positions[1] = tail.y;
      positions[2] = tail.z;

      positions[3] = s.pos.x;
      positions[4] = s.pos.y;
      positions[5] = s.pos.z;

      geo.attributes.position.needsUpdate = true;

      // Update head position
      head.position.copy(s.pos);

      line.visible = true;
      head.visible = true;

      // recycle
      if (s.age > SHOOTING_STAR_LIFETIME) {
        s.active = false;
      }
    }
  });

  return (
    <group>
      {lineGeometries.map(({ geo }, i) => (
        <group key={i}>
          {/* Trail */}
          <line
            ref={(el) => (lineRefs.current[i] = el)}
            geometry={geo}
            visible={false}
          >
            <lineBasicMaterial
              color={color}
              transparent
              opacity={0.75}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </line>

          {/* Head */}
          <points ref={(el) => (headRefs.current[i] = el)} visible={false}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={new Float32Array([0, 0, 0])}
                count={1}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              map={tex}
              color={color}
              size={HEAD_SIZE}
              sizeAttenuation
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>
        </group>
      ))}
    </group>
  );
}
