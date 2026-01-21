// src/Pages/AboutMe.jsx
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OceanSunset } from "../environments/ocean";

export default function AboutMe() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "black",
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100%", display: "block" }}
        camera={{ fov: 55, near: 1, far: 20000, position: [30, 18, 120] }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
      >
        <OceanSunset elevation={7} azimuth={180} exposure={0.85} />
      </Canvas>

      <button
        type="button"
        onClick={() => window.history.back()}
        style={{
          position: "fixed",
          left: 16,
          top: 16,
          zIndex: 10,
          padding: "10px 14px",
          borderRadius: 14,
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white",
          backdropFilter: "blur(8px)",
          cursor: "pointer",
        }}
      >
        Back
      </button>
    </div>
  );
}
