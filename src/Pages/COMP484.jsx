// src/Pages/COMP484.jsx
import { useState } from "react";
import {
  ParticleSpiral,
  CherryBlossomModal,
  openCherryModal,
} from "../environments/cherry-blossom";
import CourseNavbar from "../components/CourseNavbar";
import {
  COMP484_CONTENT,
  COMP484_THEME,
  COMP484_NAV_ITEMS,
} from "../config/comp484-content";

export default function COMP484() {
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
      {/* WebGPU Particle Spiral Scene */}
      <ParticleSpiral />

      {/* Course Navbar */}
      <CourseNavbar
        items={COMP484_NAV_ITEMS}
        activeItem={activeNav}
        onItemSelect={handleNavSelect}
        onBack={handleBack}
        theme={COMP484_THEME}
      />

      {/* Modal for displaying course content */}
      <CherryBlossomModal content={COMP484_CONTENT} theme={COMP484_THEME} />
    </div>
  );
}
