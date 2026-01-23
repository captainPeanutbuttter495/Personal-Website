// src/App.jsx
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

import Scene from "./scene/Scene";
import COMP484 from "./Pages/COMP484";
import COMP584 from "./Pages/COMP584";
import COMP467 from "./Pages/COMP467";
import COMP582 from "./Pages/COMP582";
import COMP587 from "./Pages/COMP587";
import SeniorDesign from "./Pages/SeniorDesign";
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
  if (last === "COMP584") return "COMP584";
  if (last === "COMP467") return "COMP467";
  if (last === "COMP582") return "COMP582";
  if (last === "COMP587") return "COMP587";
  if (last === "SeniorDesign") return "SeniorDesign";
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
  if (routeKey === "COMP584") return <COMP584 />;
  if (routeKey === "COMP467") return <COMP467 />;
  if (routeKey === "COMP582") return <COMP582 />;
  if (routeKey === "COMP587") return <COMP587 />;
  if (routeKey === "SeniorDesign") return <SeniorDesign />;
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
