/* eslint-disable react-hooks/purity */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import * as THREE from "three";

/* ============================================================
   🔧 GLOBAL TUNING CONTROLS (EDIT THESE)
   ============================================================ */

const RING_RADIUS = 200;
const SPHERE_RADIUS = 9.2;
const SPHERE_PARTICLES = 2600;
const LABEL_HEIGHT = 12.0;

const CENTER_RADIUS = 10.0;
const CENTER_PARTICLES = 3400;
const CENTER_LABEL_HEIGHT = 14.0;

const STAR_COUNT = 6000;

/* ============================================================
   🏷️ LABEL / TEXT BILLBOARD TUNING (EDIT THESE)
   ============================================================ */

const LABEL_FONT_SIZE = 1.25;
const CENTER_LABEL_FONT_SIZE = 0.95;
const LABEL_MAX_WIDTH = 28;

const LABEL_OUTLINE_WIDTH = 0.02;
const LABEL_OUTLINE_OPACITY = 0.75;

const BILLBOARD_LOCK_X = false;
const BILLBOARD_LOCK_Y = false;
const BILLBOARD_LOCK_Z = false;

/* ============================================================
   🌑 DIMMING / BRIGHTNESS CONTROLS (EDIT THESE)
   ============================================================ */

const BLOOM_INTENSITY = 0.4;
const BLOOM_THRESHOLD = 0.75;
const BLOOM_SMOOTHING = 0.1;
const PARTICLE_BRIGHTNESS = 0.8;

/* ============================================================
   🎥 CAMERA FOCUS CONTROLS (EDIT THESE)
   ============================================================ */

const FOCUS_DISTANCE = 55;
const FOCUS_LERP_SPEED = 0.08;
const TARGET_LERP_SPEED = 0.12;
const RETURN_LERP_SPEED = 0.08;

const DISABLE_AUTOROTATE_ON_FOCUS = true;

const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 0, 72);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

/* ============================================================
   STAR COLORS (background only)
   ============================================================ */

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

/* ============================================================
   STARFIELD BACKGROUND
   ============================================================ */

function BreathingStarfield({ count }) {
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
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    ref.current.rotation.y = clock.elapsedTime * 0.01;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}

/* ============================================================
   PARTICLE SPHERE (clickable)
   ============================================================ */

function ParticleSphere({
  position,
  label,
  color,
  radius,
  particleCount,
  labelHeight,
  labelFontSize,
  onSelect,
}) {
  const ref = useRef();
  const matRef = useRef();
  const tex = useMemo(() => createStarTexture(), []);

  const baseColor = useMemo(
    () => new THREE.Color(color).multiplyScalar(PARTICLE_BRIGHTNESS),
    [color],
  );

  const { geometry, material } = useMemo(() => {
    const p = new Float32Array(particleCount * 3);
    const c = new Float32Array(particleCount * 3);
    const s = new Float32Array(particleCount);
    const ph = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
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
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    ref.current.rotation.y = clock.elapsedTime * 0.09;
    ref.current.rotation.x = clock.elapsedTime * 0.03;
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
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      />
    </group>
  );
}

/* ============================================================
   CAMERA CONTROLLER (FIXED: doesn't fight OrbitControls on load)
   ============================================================ */

function CameraRig({ focusPoint, mode, setMode, controlsRef }) {
  const { camera } = useThree();

  const desiredTarget = useMemo(() => new THREE.Vector3(), []);
  const desiredCamPos = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  // ✅ Initialize once so first frame doesn't "snap back"
  useEffect(() => {
    camera.position.copy(DEFAULT_CAMERA_POS);
  }, [camera]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    // ------------------------------------------------------------
    // Focused: lock target to sphere; animate camera in if focusing
    // ------------------------------------------------------------
    if (focusPoint) {
      desiredTarget.set(focusPoint[0], focusPoint[1], focusPoint[2]);
      controls.target.lerp(desiredTarget, TARGET_LERP_SPEED);

      if (mode === "focusing") {
        dir.copy(camera.position).sub(controls.target).normalize();
        desiredCamPos
          .copy(controls.target)
          .add(dir.multiplyScalar(FOCUS_DISTANCE));

        camera.position.lerp(desiredCamPos, FOCUS_LERP_SPEED);

        if (camera.position.distanceTo(desiredCamPos) < 0.5) {
          setMode("locked");
        }
      }

      controls.update();
      return;
    }

    // ------------------------------------------------------------
    // Not focused:
    // ONLY return to default if user requested it (mode=returning)
    // ------------------------------------------------------------
    if (mode === "returning") {
      controls.target.lerp(DEFAULT_TARGET, RETURN_LERP_SPEED);
      camera.position.lerp(DEFAULT_CAMERA_POS, RETURN_LERP_SPEED);

      if (
        camera.position.distanceTo(DEFAULT_CAMERA_POS) < 0.5 &&
        controls.target.distanceTo(DEFAULT_TARGET) < 0.5
      ) {
        setMode("idle");
      }

      controls.update();
      return;
    }

    // mode === "idle" and no focusPoint:
    // ✅ Leave OrbitControls alone (free zoom/drag)
  });

  return null;
}

/* ============================================================
   SCENE
   ============================================================ */

function Scene() {
  const controlsRef = useRef();
  const [focusPoint, setFocusPoint] = useState(null);
  const [mode, setMode] = useState("idle");

  const items = [
    { label: "COMP 484: Web Engineering", color: "#22D3EE" },
    { label: "COMP 584: Advanced Web Engineering", color: "#A78BFA" },
    { label: "COMP 467: Multimedia System Design", color: "#F472B6" },
    {
      label: "COMP 582: Software Verification and Validation",
      color: "#34D399",
    },
    {
      label: "COMP 587: Software Requirements and Verification",
      color: "#FB7185",
    },
    { label: "Senior Design Project", color: "#FBBF24" },
  ];

  const onSelectSphere = useCallback((pos) => {
    setFocusPoint(pos);
    setMode("focusing");
  }, []);

  // ✅ When clearing selection, request a smooth return
  const onClearSelection = useCallback(() => {
    setFocusPoint(null);
    setMode("returning"); // <- important fix
    document.body.style.cursor = "default";
  }, []);

  return (
    <>
      <ambientLight intensity={0.08} />
      <BreathingStarfield count={STAR_COUNT} />

      {/* Click empty space to reset camera */}
      <mesh onPointerDown={onClearSelection} visible={false}>
        <boxGeometry args={[4000, 4000, 4000]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {items.map((item, i) => {
        const a = (i / items.length) * Math.PI * 2;
        return (
          <ParticleSphere
            key={item.label}
            position={[Math.cos(a) * RING_RADIUS, 0, Math.sin(a) * RING_RADIUS]}
            label={item.label}
            color={item.color}
            radius={SPHERE_RADIUS}
            particleCount={SPHERE_PARTICLES}
            labelHeight={LABEL_HEIGHT}
            labelFontSize={LABEL_FONT_SIZE}
            onSelect={onSelectSphere}
          />
        );
      })}

      <ParticleSphere
        position={[0, 0, 0]}
        label="About Me"
        color="#60A5FA"
        radius={CENTER_RADIUS}
        particleCount={CENTER_PARTICLES}
        labelHeight={CENTER_LABEL_HEIGHT}
        labelFontSize={CENTER_LABEL_FONT_SIZE}
        onSelect={onSelectSphere}
      />

      <OrbitControls
        ref={controlsRef}
        enableZoom
        enablePan={false}
        minDistance={24}
        maxDistance={260}
        autoRotate={DISABLE_AUTOROTATE_ON_FOCUS ? !focusPoint : true}
        autoRotateSpeed={0.2}
      />

      <CameraRig
        focusPoint={focusPoint}
        mode={mode}
        setMode={setMode}
        controlsRef={controlsRef}
      />
    </>
  );
}

/* ============================================================
   APP (full viewport)
   ============================================================ */

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100%", display: "block" }}
        camera={{ position: [0, 0, 72], fov: 60, near: 0.1, far: 3000 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Scene />

        <EffectComposer>
          <Bloom
            intensity={BLOOM_INTENSITY}
            luminanceThreshold={BLOOM_THRESHOLD}
            luminanceSmoothing={BLOOM_SMOOTHING}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
