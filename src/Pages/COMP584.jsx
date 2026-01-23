// src/Pages/COMP584.jsx
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  CherryBlossomModal,
  openCherryModal,
} from "../environments/cherry-blossom";
import { SaturnScene } from "../environments/saturn";
import CourseNavbar from "../components/CourseNavbar";
import {
  COMP584_CONTENT,
  COMP584_THEME,
  COMP584_NAV_ITEMS,
} from "../config/comp584-content";

export default function COMP584() {
  const [activeNav, setActiveNav] = useState(null);

  const handleNavSelect = (itemId) => {
    setActiveNav(itemId);
    openCherryModal(itemId);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* Saturn 3D Scene */}
      <Canvas
        style={{ width: "100%", height: "100%", display: "block" }}
        camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 1, 5] }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
      >
        <SaturnScene />
      </Canvas>

      {/* Course Navbar */}
      <CourseNavbar
        items={COMP584_NAV_ITEMS}
        activeItem={activeNav}
        onItemSelect={handleNavSelect}
        onBack={handleBack}
        theme={COMP584_THEME}
      />

      {/* Modal for displaying course content */}
      <CherryBlossomModal content={COMP584_CONTENT} theme={COMP584_THEME} />
    </div>
  );
}
