// src/Pages/AboutMe.jsx
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OceanSunset, OceanModal } from "../environments/ocean";

export default function AboutMe() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "black",
        overflow: "hidden",
      }}
    >
      {/* 3D ocean */}
      <Canvas
        style={{ width: "100%", height: "100%", display: "block" }}
        camera={{ fov: 55, near: 1, far: 20000, position: [0, 45, 215] }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
      >
        <OceanSunset elevation={7} azimuth={180} exposure={0.9} />
      </Canvas>

      {/* 2D sky gradient overlay to mimic the example's pastel sky */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background:
            "linear-gradient(to bottom, #cfd9e8 0%, #f5d69a 40%, rgba(0,0,0,0) 70%)",
          opacity: 0.75,
          mixBlendMode: "screen",
        }}
      />

      {/* Back button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        style={{
          position: "fixed",
          left: 16,
          top: 16,
          zIndex: 2,
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

      {/* Modal for sphere info panels (rendered outside Canvas) */}
      <OceanModal />
    </div>
  );
}
