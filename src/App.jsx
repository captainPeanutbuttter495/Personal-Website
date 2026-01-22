// src/App.jsx
import { useEffect, useState } from "react";
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

/**
 * GitHub Pages / base-path safe route extraction:
 * We ONLY care about the last segment (e.g. AboutMe, COMP484).
 * Everything else becomes "home" (galaxy landing page).
 */
function getRouteKey() {
  const pathname = window.location.pathname || "/";
  const parts = pathname.split("/").filter(Boolean); // removes empty segments
  const last = parts.length ? parts[parts.length - 1] : "";

  // Only treat known pages as routes; otherwise home
  if (last === "AboutMe") return "AboutMe";
  if (last === "COMP484") return "COMP484";
  return ""; // home / landing
}

export default function App() {
  const [routeKey, setRouteKey] = useState(() => getRouteKey());

  useEffect(() => {
    const sync = () => setRouteKey(getRouteKey());

    window.addEventListener("popstate", sync);
    window.addEventListener("app:navigate", sync);

    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("app:navigate", sync);
    };
  }, []);

  // Pages
  if (routeKey === "COMP484") return <COMP484 />;
  if (routeKey === "AboutMe") return <AboutMe />;

  // Home (your original galaxy landing page)
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
