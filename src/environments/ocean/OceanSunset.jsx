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
  exposure = 0.9,
}) {
  const { gl, scene, camera } = useThree();
  const sun = useMemo(() => new THREE.Vector3(), []);
  const pmremGenerator = useMemo(() => new THREE.PMREMGenerator(gl), [gl]);
  const envScene = useMemo(() => new THREE.Scene(), []);
  const sunMeshRef = useRef();

  const [waterNormals, setWaterNormals] = useState(null);

  // computed control limits anchored to initial camera polar
  const [polarLimits, setPolarLimits] = useState({
    minPolarAngle: Math.PI * 0.46,
    maxPolarAngle: Math.PI * 0.58,
  });

  /* ---------------- Renderer baseline ---------------- */
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
    if (gl.outputColorSpace !== undefined) {
      gl.outputColorSpace = THREE.SRGBColorSpace;
    }
  }, [gl, exposure]);

  /* ---------------- Camera baseline (wide shot) ---------------- */
  useEffect(() => {
    camera.fov = 55;
    camera.near = 1;
    camera.far = 20000;

    // Starting camera (matches your "good" composition)
    camera.position.set(30, 18, 120);
    camera.updateProjectionMatrix();
  }, [camera]);

  /* ---------------- load water normals ---------------- */
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

  /* ---------------- Sky ---------------- */
  const sky = useMemo(() => {
    const s = new Sky();
    s.scale.setScalar(10000);
    const u = s.material.uniforms;
    // tuned for warm sunset band
    u.turbidity.value = 18;
    u.rayleigh.value = 1.0;
    u.mieCoefficient.value = 0.012;
    u.mieDirectionalG.value = 0.9;
    return s;
  }, []);

  /* ---------------- Water ---------------- */
  const water = useMemo(() => {
    if (!waterNormals) return null;
    const geometry = new THREE.PlaneGeometry(10000, 10000);
    const w = new Water(geometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffc88a,
      waterColor: 0x06293d,
      distortionScale: 3.4,
      fog: false,
    });
    w.rotation.x = -Math.PI / 2;
    if (w.material?.uniforms?.size) w.material.uniforms.size.value = 1.1;
    return w;
  }, [waterNormals]);

  /* ---------------- mount scene ---------------- */
  useEffect(() => {
    scene.add(sky);
    if (water) scene.add(water);

    const bg = new THREE.Color("#101a33");
    scene.background = bg;
    scene.fog = new THREE.FogExp2(bg, 0.000035);

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

  /* ---------------- sun position + environment ---------------- */
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

  /* ---------------- animate water ---------------- */
  useFrame(() => {
    if (!water) return;
    water.material.uniforms.time.value += 1 / 60;
  });

  /* ---------------- compute initial polar & set asymmetric limits ----------------
     Behavior:
       - maxPolarAngle = initial polar (so user cannot look more DOWN than starting POV)
       - minPolarAngle = initial polar - allowedUpRange (lets user look UP some amount)
  -------------------------------------------------------------------------------*/
  useEffect(() => {
    // target used by OrbitControls in this file:
    const target = new THREE.Vector3(0, 6, 0);

    // vector from target -> camera
    const v = camera.position.clone().sub(target);
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(v);

    const initialPolar = spherical.phi; // radians; 0 = +Y (top), π = -Y (down)

    // how many radians we allow the user to look UP from start (tweakable)
    const allowedUpRange = Math.PI * 0.12; // ~21.6°

    // clamp sanity checks
    const minPolar = Math.max(0.001, initialPolar - allowedUpRange);
    const maxPolar = Math.min(Math.PI - 0.001, initialPolar);

    setPolarLimits({
      minPolarAngle: minPolar,
      maxPolarAngle: maxPolar,
    });

    console.log(
      "[OceanSunset] polarAnchors:",
      "initialPolar(deg)=",
      (initialPolar * 180) / Math.PI,
      "min(deg)=",
      (minPolar * 180) / Math.PI,
      "max(deg)=",
      (maxPolar * 180) / Math.PI,
    );
  }, [camera]);

  /* ---------------- Render controls + sun ---------------- */
  return (
    <>
      <OrbitControls
        target={[0, 6, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={70}
        maxDistance={220}
        // keep the sun roughly forward horizontally
        minAzimuthAngle={-Math.PI / 5}
        maxAzimuthAngle={Math.PI / 5}
        // asymmetric vertical clamp computed above
        minPolarAngle={polarLimits.minPolarAngle}
        maxPolarAngle={polarLimits.maxPolarAngle}
      />

      <mesh ref={sunMeshRef}>
        <sphereGeometry args={[65, 24, 18]} />
        <meshBasicMaterial color={0xffc88a} toneMapped={false} />
      </mesh>
    </>
  );
}
