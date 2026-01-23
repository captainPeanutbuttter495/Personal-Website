// src/Pages/COMP587.jsx
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  CherryBlossomModal,
  openCherryModal,
} from "../environments/cherry-blossom";
import CourseNavbar from "../components/CourseNavbar";
import {
  COMP587_CONTENT,
  COMP587_THEME,
  COMP587_NAV_ITEMS,
} from "../config/comp587-content";

export default function COMP587() {
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
        background: "#0a0a0f",
        overflow: "hidden",
      }}
    >
      {/* 3D Canvas - Add your own Three.js scene here */}
      <Canvas
        style={{ width: "100%", height: "100%", display: "block" }}
        camera={{ fov: 50, near: 0.1, far: 1000, position: [0, 0, 30] }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
      >
        {/* Add your Three.js components here */}
        <ambientLight intensity={0.5} />
      </Canvas>

      {/* Course Navbar */}
      <CourseNavbar
        items={COMP587_NAV_ITEMS}
        activeItem={activeNav}
        onItemSelect={handleNavSelect}
        onBack={handleBack}
        theme={COMP587_THEME}
      />

      {/* Modal for displaying course content */}
      <CherryBlossomModal content={COMP587_CONTENT} theme={COMP587_THEME} />
    </div>
  );
}
