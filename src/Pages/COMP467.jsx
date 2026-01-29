// src/Pages/COMP467.jsx
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  CherryBlossomModal,
  openCherryModal,
} from "../environments/cherry-blossom";
import CourseNavbar from "../components/CourseNavbar";
import FaceSphere from "../components/FaceSphere";
import MonjoriBackground from "../components/MonjoriBackground";
import {
  COMP467_CONTENT,
  COMP467_THEME,
  COMP467_NAV_ITEMS,
} from "../config/comp467-content";

export default function COMP467() {
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
        <MonjoriBackground />
        <ambientLight intensity={0.5} />
        <pointLight color="#ffffff" intensity={1.2} position={[5, 3, 8]} />
        <pointLight color="#F472B6" intensity={0.4} position={[-5, 0, 5]} />
        <FaceSphere
          position={[0, 0, 0]}
          radius={8}
          rotationSpeed={1.75}
          scale={[1, 1, 1]}
        />
      </Canvas>

      {/* Course Navbar */}
      <CourseNavbar
        items={COMP467_NAV_ITEMS}
        activeItem={activeNav}
        onItemSelect={handleNavSelect}
        onBack={handleBack}
        theme={COMP467_THEME}
      />

      {/* Modal for displaying course content */}
      <CherryBlossomModal content={COMP467_CONTENT} theme={COMP467_THEME} />
    </div>
  );
}
