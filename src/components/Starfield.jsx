import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createStarTexture } from "./StarTexture";

const STAR_COLORS = {
  dark: { r: 0.0, g: 0.0, b: 0.0 },
  mid1: { r: 0.0, g: 0.9, b: 1.0 },
  mid2: { r: 0.62, g: 0.0, b: 1.0 },
  accent: { r: 1.0, g: 0.24, b: 0.51 },
  bright: { r: 1.0, g: 1.0, b: 1.0 },
};

function getRandomStarColor() {
  const r = Math.random();
  if (r > 0.65) return STAR_COLORS.bright;
  if (r > 0.45) return STAR_COLORS.accent;
  if (r > 0.3) return STAR_COLORS.mid2;
  if (r > 0.15) return STAR_COLORS.mid1;
  return STAR_COLORS.dark;
}

export default function Starfield({ count = 6000 }) {
  const ref = useRef();
  const matRef = useRef();
  const tex = useMemo(() => createStarTexture(), []);

  const { geometry, material } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const ph = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = 100 + Math.random() * 300;
      const t = Math.random() * Math.PI * 2;
      const u = Math.acos(Math.random() * 2 - 1);

      p[i * 3] = r * Math.sin(u) * Math.cos(t);
      p[i * 3 + 1] = r * Math.sin(u) * Math.sin(t);
      p[i * 3 + 2] = r * Math.cos(u);

      const col = getRandomStarColor();
      c[i * 3] = col.r * 0.7;
      c[i * 3 + 1] = col.g * 0.7;
      c[i * 3 + 2] = col.b * 0.7;

      s[i] = 1.2 + Math.random() * 2.0;
      ph[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(c, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(s, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(ph, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uTexture: { value: tex } },
      vertexShader: `
        attribute float aSize, aPhase;
        attribute vec3 aColor;
        uniform float uTime;
        varying vec3 vColor;
        void main(){
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          float b = sin(uTime + aPhase*6.283) * 0.35 + 1.0;
          gl_PointSize = aSize * b * (260.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        void main(){
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
  }, [count, tex]);

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    ref.current.rotation.y = clock.elapsedTime * 0.01;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}
