import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createStarTexture } from "./StarTexture";
import {
  GALAXY_ARMS,
  GALAXY_BRIGHTNESS,
  GALAXY_CORE_COLOR,
  GALAXY_COUNT,
  GALAXY_DUST_COLOR,
  GALAXY_ARM_COLOR,
  GALAXY_RADIUS,
  GALAXY_RANDOMNESS,
  GALAXY_SPIN,
  GALAXY_THICKNESS,
  GALAXY_Y,
} from "../config/tuning";

export default function SpiralGalaxy() {
  const ref = useRef();
  const matRef = useRef();
  const tex = useMemo(() => createStarTexture(), []);

  const core = useMemo(() => new THREE.Color(GALAXY_CORE_COLOR), []);
  const arm = useMemo(() => new THREE.Color(GALAXY_ARM_COLOR), []);
  const dust = useMemo(() => new THREE.Color(GALAXY_DUST_COLOR), []);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(GALAXY_COUNT * 3);
    const colors = new Float32Array(GALAXY_COUNT * 3);
    const sizes = new Float32Array(GALAXY_COUNT);
    const phases = new Float32Array(GALAXY_COUNT);

    for (let i = 0; i < GALAXY_COUNT; i++) {
      const r = Math.pow(Math.random(), 1.9) * GALAXY_RADIUS;

      const armIndex = i % GALAXY_ARMS;
      const armAngle = (armIndex / GALAXY_ARMS) * Math.PI * 2;
      const angle = armAngle + (r / GALAXY_RADIUS) * Math.PI * 2 * GALAXY_SPIN;

      const rand = (Math.random() - 0.5) * 2;
      const randomRadius =
        rand * GALAXY_RANDOMNESS * (GALAXY_RADIUS - r) * 0.15;
      const randomAngle = rand * GALAXY_RANDOMNESS * 0.35;

      const finalR = r + randomRadius;
      const finalA = angle + randomAngle;

      const x = Math.cos(finalA) * finalR;
      const z = Math.sin(finalA) * finalR;

      const thickness = GALAXY_THICKNESS * (1.0 - r / GALAXY_RADIUS);
      const y = (Math.random() - 0.5) * thickness;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const t = 1.0 - r / GALAXY_RADIUS;
      const dustMix = Math.random() * 0.25;
      const col = new THREE.Color().copy(arm).lerp(core, t).lerp(dust, dustMix);

      colors[i * 3] = col.r * GALAXY_BRIGHTNESS;
      colors[i * 3 + 1] = col.g * GALAXY_BRIGHTNESS;
      colors[i * 3 + 2] = col.b * GALAXY_BRIGHTNESS;

      const sizeBase = 1.0 + 2.2 * t;
      sizes[i] = sizeBase * (0.6 + Math.random() * 1.2);

      phases[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uTexture: { value: tex } },
      vertexShader: `
        attribute float aSize, aPhase;
        attribute vec3 aColor;
        uniform float uTime;
        varying vec3 vColor;
        void main() {
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float shimmer = sin(uTime * 0.5 + aPhase * 6.283) * 0.12 + 1.0;
          gl_PointSize = aSize * shimmer * (250.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        void main() {
          vec4 t = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor * t.rgb, t.a);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    matRef.current = mat;
    return { geometry: geo, material: mat };
  }, [tex, core, arm, dust]);

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    ref.current.rotation.y = clock.elapsedTime * 0.03;
  });

  return (
    <group position={[0, GALAXY_Y, 0]}>
      <points ref={ref} geometry={geometry} material={material} />
    </group>
  );
}
