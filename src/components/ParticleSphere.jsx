// src/components/ParticleSphere.jsx
import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import {
  BILLBOARD_LOCK_X,
  BILLBOARD_LOCK_Y,
  BILLBOARD_LOCK_Z,
  LABEL_MAX_WIDTH,
  LABEL_OUTLINE_OPACITY,
  LABEL_OUTLINE_WIDTH,
  PARTICLE_BRIGHTNESS,
} from "../config/tuning";

function createStarTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d");

  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

export default function ParticleSphere({
  position,
  label,
  color,
  radius,
  particleCount,
  labelHeight,
  labelFontSize,
  onSelect,
  url, // ✅ optional (Pokemon uses this)
}) {
  const ref = useRef();
  const matRef = useRef();
  const tex = useMemo(() => createStarTexture(), []);

  const baseColor = useMemo(() => {
    // Important: ensure valid hex strings like "#22D3EE"
    return new THREE.Color(color).multiplyScalar(PARTICLE_BRIGHTNESS);
  }, [color]);

  const { geometry, material } = useMemo(() => {
    const p = new Float32Array(particleCount * 3);
    const c = new Float32Array(particleCount * 3);
    const s = new Float32Array(particleCount);
    const ph = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // fibonacci sphere distribution
      const y = 1 - (i / (particleCount - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = i * 2.39996323;

      p[i * 3] = Math.cos(t) * r * radius;
      p[i * 3 + 1] = y * radius;
      p[i * 3 + 2] = Math.sin(t) * r * radius;

      c[i * 3] = baseColor.r;
      c[i * 3 + 1] = baseColor.g;
      c[i * 3 + 2] = baseColor.b;

      s[i] = 2.6 + Math.random() * 2.0;
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
          float b = sin(uTime*1.1 + aPhase*6.283) * 0.3 + 1.0;
          gl_PointSize = aSize * b * (220.0 / -mv.z);
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
  }, [particleCount, radius, tex, baseColor]);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.09;
      ref.current.rotation.x = clock.elapsedTime * 0.03;
    }
  });

  return (
    <group position={position}>
      <Billboard
        follow
        lockX={BILLBOARD_LOCK_X}
        lockY={BILLBOARD_LOCK_Y}
        lockZ={BILLBOARD_LOCK_Z}
        position={[0, labelHeight, 0]}
      >
        <Text
          fontSize={labelFontSize}
          color={color}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
          maxWidth={LABEL_MAX_WIDTH}
          outlineWidth={LABEL_OUTLINE_WIDTH}
          outlineOpacity={LABEL_OUTLINE_OPACITY}
          outlineColor="black"
        >
          {label}
        </Text>
      </Billboard>

      <points
        ref={ref}
        geometry={geometry}
        material={material}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(position);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (url) window.open(url, "_blank", "noopener,noreferrer");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = url ? "pointer" : "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      />
    </group>
  );
}
