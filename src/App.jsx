// src/App.jsx
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

import Scene from "./scene/Scene";
import COMP484 from "./Pages/COMP484";
import AboutMe from "./Pages/AboutMe";

import {
  BLOOM_INTENSITY,
  BLOOM_THRESHOLD,
  BLOOM_SMOOTHING,
} from "./config/tuning";

export default function App() {
  const base = import.meta.env.BASE_URL || "/";
  const path = window.location.pathname.replace(base, "").replace(/^\/+/, "");

  // Simple "routing" without React Router (GitHub Pages friendly)
  if (path === "COMP484") return <COMP484 />;
  if (path === "AboutMe") return <AboutMe />;

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
