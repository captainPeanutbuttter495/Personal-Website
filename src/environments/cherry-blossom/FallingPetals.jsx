// src/environments/cherry-blossom/FallingPetals.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Particle system for falling cherry blossom petals
 * Features gentle falling motion with horizontal drift (sine wave)
 */
export default function FallingPetals({ count = 200, bounds = { x: 40, y: 30, z: 40 } }) {
  const meshRef = useRef();

  // Petal color palette
  const colors = useMemo(
    () => [
      new THREE.Color("#FFB7C5"),
      new THREE.Color("#FADADD"),
      new THREE.Color("#FFD1DC"),
      new THREE.Color("#FFC0CB"),
    ],
    []
  );

  // Initialize particle data
  const { positions, velocities, offsets, colorIndices } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const offsets = new Float32Array(count);
    const colorIndices = new Uint8Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random spawn position
      positions[i3] = (Math.random() - 0.5) * bounds.x;
      positions[i3 + 1] = Math.random() * bounds.y + 5; // Above ground
      positions[i3 + 2] = (Math.random() - 0.5) * bounds.z;

      // Falling velocity (downward with slight variation)
      velocities[i3] = (Math.random() - 0.5) * 0.01; // X drift
      velocities[i3 + 1] = -0.02 - Math.random() * 0.02; // Y fall speed
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01; // Z drift

      // Random phase offset for sine wave motion
      offsets[i] = Math.random() * Math.PI * 2;

      // Random color index
      colorIndices[i] = Math.floor(Math.random() * colors.length);
    }

    return { positions, velocities, offsets, colorIndices };
  }, [count, bounds, colors.length]);

  // Create geometry with colors
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Create color attribute
    const colorArray = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const color = colors[colorIndices[i]];
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    return geo;
  }, [positions, count, colors, colorIndices]);

  // Animation loop
  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const positionAttr = meshRef.current.geometry.attributes.position;
    const time = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update position with velocity
      positionAttr.array[i3] += velocities[i3];
      positionAttr.array[i3 + 1] += velocities[i3 + 1];
      positionAttr.array[i3 + 2] += velocities[i3 + 2];

      // Add horizontal sine wave drift for floating effect
      positionAttr.array[i3] += Math.sin(time * 0.5 + offsets[i]) * 0.02;
      positionAttr.array[i3 + 2] += Math.cos(time * 0.3 + offsets[i]) * 0.015;

      // Reset petal when it falls below ground
      if (positionAttr.array[i3 + 1] < -2) {
        positionAttr.array[i3] = (Math.random() - 0.5) * bounds.x;
        positionAttr.array[i3 + 1] = bounds.y + Math.random() * 5;
        positionAttr.array[i3 + 2] = (Math.random() - 0.5) * bounds.z;
      }
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.25}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
