// src/environments/ocean/OceanSunset.jsx
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

export default function OceanSunset({
  elevation = 7,
  azimuth = 180,
  exposure = 0.9, // slightly brighter for more glow
}) {
  const { gl, scene, camera } = useThree();
  const sun = useMemo(() => new THREE.Vector3(), []);
  const pmremGenerator = useMemo(() => new THREE.PMREMGenerator(gl), [gl]);
  const envScene = useMemo(() => new THREE.Scene(), []);
  const sunMeshRef = useRef();

  const [waterNormals, setWaterNormals] = useState(null);

  // Renderer baseline
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;

    if (gl.outputColorSpace !== undefined) {
      gl.outputColorSpace = THREE.SRGBColorSpace;
    }
  }, [gl, exposure]);

  // Camera baseline
  useEffect(() => {
    camera.fov = 55;
    camera.near = 1;
    camera.far = 20000;
    camera.position.set(30, 18, 120);
    camera.updateProjectionMatrix();
  }, [camera]);

  // Explicit texture load
  useEffect(() => {
    const base = import.meta.env.BASE_URL || "/";
    const url = `${base}textures/waternormals.jpg`;

    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        if ("colorSpace" in tex) tex.colorSpace = THREE.NoColorSpace;
        setWaterNormals(tex);
        console.log("[OceanSunset] Loaded water normals:", url);
      },
      undefined,
      (err) => {
        console.error("[OceanSunset] FAILED to load water normals:", url, err);
        setWaterNormals(null);
      },
    );
  }, []);

  // Sky tuned for sunset
  const sky = useMemo(() => {
    const s = new Sky();
    s.scale.setScalar(10000);

    const u = s.material.uniforms;
    u.turbidity.value = 18;
    u.rayleigh.value = 1.0;
    u.mieCoefficient.value = 0.012;
    u.mieDirectionalG.value = 0.9;

    return s;
  }, []);

  // Water
  const water = useMemo(() => {
    if (!waterNormals) return null;

    const geometry = new THREE.PlaneGeometry(10000, 10000);

    const w = new Water(geometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffc88a,
      waterColor: 0x06293d, // slightly lighter teal
      distortionScale: 3.4,
      fog: false,
    });

    w.rotation.x = -Math.PI / 2;

    if (w.material?.uniforms?.size) {
      w.material.uniforms.size.value = 1.1;
    }

    return w;
  }, [waterNormals]);

  // Mount sky + water + background/fog
  useEffect(() => {
    scene.add(sky);
    if (water) scene.add(water);

    const bg = new THREE.Color("#101a33"); // lighter navy
    scene.background = bg;
    scene.fog = new THREE.FogExp2(bg, 0.000035); // softer than before

    return () => {
      scene.remove(sky);
      if (water) {
        scene.remove(water);
        water.geometry?.dispose?.();
        water.material?.dispose?.();
      }
      scene.background = null;
      scene.fog = null;
      pmremGenerator.dispose();
      scene.environment = null;
    };
  }, [scene, sky, water, pmremGenerator]);

  // Sun + env
  useEffect(() => {
    if (!water) return;

    const phi = THREE.MathUtils.degToRad(90 - elevation);
    const theta = THREE.MathUtils.degToRad(azimuth);
    sun.setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms.sunPosition.value.copy(sun);
    water.material.uniforms.sunDirection.value.copy(sun).normalize();

    envScene.add(sky);
    const rt = pmremGenerator.fromScene(envScene);
    envScene.remove(sky);
    scene.environment = rt.texture;

    if (sunMeshRef.current) {
      sunMeshRef.current.position.copy(sun.clone().multiplyScalar(4000));
    }

    return () => rt.dispose();
  }, [water, elevation, azimuth, sun, sky, pmremGenerator, envScene, scene]);

  useFrame(() => {
    if (!water) return;
    water.material.uniforms.time.value += 1.0 / 60.0;
  });

  return (
    <>
      <OrbitControls
        maxPolarAngle={Math.PI * 0.495}
        target={[0, 6, 0]}
        minDistance={40}
        maxDistance={400}
        enablePan={false}
      />

      {/* Warm sun disc */}
      <mesh ref={sunMeshRef}>
        <sphereGeometry args={[65, 24, 18]} />
        <meshBasicMaterial color={0xffc88a} toneMapped={false} />
      </mesh>
    </>
  );
}
