import { OrbitControls } from "@react-three/drei";
import { useCallback, useRef, useState } from "react";
import Starfield from "../components/Starfield";
import ShootingStars from "../components/ShootingStars";
import ParticleSphere from "../components/ParticleSphere";
import SpiralGalaxy from "../components/SpiralGalaxy";
import CameraRig from "./CameraRig";
import {
  ABOUT_ME,
  CENTER_LABEL_FONT_SIZE,
  CENTER_LABEL_HEIGHT,
  CENTER_PARTICLES,
  CENTER_RADIUS,
  CLASS_SPHERES,
  DISABLE_AUTOROTATE_ON_FOCUS,
  LABEL_FONT_SIZE,
  LABEL_HEIGHT,
  RING_RADIUS,
  SPHERE_PARTICLES,
  SPHERE_RADIUS,
  STAR_COUNT,
} from "../config/tuning";

export default function Scene() {
  const controlsRef = useRef();
  const [focusPoint, setFocusPoint] = useState(null);
  const [mode, setMode] = useState("idle");

  const onSelectSphere = useCallback((pos) => {
    setFocusPoint(pos);
    setMode("focusing");
  }, []);

  const onClearSelection = useCallback(() => {
    setFocusPoint(null);
    setMode("returning");
    document.body.style.cursor = "default";
  }, []);

  return (
    <>
      <ambientLight intensity={0.08} />

      <Starfield count={STAR_COUNT} />
      <ShootingStars />
      <SpiralGalaxy />

      <mesh onPointerDown={onClearSelection} visible={false}>
        <boxGeometry args={[4000, 4000, 4000]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {CLASS_SPHERES.map((item, i) => {
        const a = (i / CLASS_SPHERES.length) * Math.PI * 2;
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
        label={ABOUT_ME.label}
        color={ABOUT_ME.color}
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
