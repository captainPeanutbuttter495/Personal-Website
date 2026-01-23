// src/environments/ocean/OceanSunset.jsx
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

// Global state for modal (simple pub/sub pattern)
let modalListeners = [];
let currentModal = null;

export function openModal(panelId) {
  currentModal = panelId;
  modalListeners.forEach((listener) => listener(panelId));
}

export function closeModal() {
  currentModal = null;
  modalListeners.forEach((listener) => listener(null));
}

function subscribeToModal(listener) {
  modalListeners.push(listener);
  // Return current state immediately
  listener(currentModal);
  return () => {
    modalListeners = modalListeners.filter((l) => l !== listener);
  };
}

// Interactive floating sphere component with label
function FloatingSphere({
  position,
  radius = 8,
  speed = 1,
  offset = 0,
  label,
  panelId,
  color = 0xffffff,
}) {
  const groupRef = useRef();
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [scale, setScale] = useState(1);

  // Smooth scale animation on hover
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime() * speed + offset;
      groupRef.current.position.y = position[1] + Math.sin(time) * 5;
    }
    if (meshRef.current) {
      const time = clock.getElapsedTime() * speed + offset;
      meshRef.current.rotation.x = time * 0.5;
      meshRef.current.rotation.z = time * 0.51;
    }
    // Smooth scale transition
    const targetScale = hovered ? 1.15 : 1;
    setScale((prev) => prev + (targetScale - prev) * 0.1);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Hint text (above label when hovered) */}
      {hovered && (
        <Text
          position={[0, radius + 16, 0]}
          fontSize={3}
          color="#ffcc00"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.2}
          outlineColor="#000000"
        >
          double-click to open
        </Text>
      )}

      {/* Floating label above sphere */}
      <Text
        position={[0, radius + 10, 0]}
        fontSize={6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.3}
        outlineColor="#000000"
        font={undefined}
      >
        {label}
      </Text>

      {/* The sphere */}
      <mesh
        ref={meshRef}
        scale={scale}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          openModal(panelId);
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          roughness={0.1}
          metalness={0.9}
          color={hovered ? 0xffd700 : color}
          emissive={hovered ? 0x332200 : 0x000000}
        />
      </mesh>

      {/* Glow ring when hovered */}
      {hovered && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.2, radius * 1.4, 32]} />
          <meshBasicMaterial
            color={0xffd700}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// ============ EXPORTED MODAL COMPONENT (render outside Canvas) ============
export function OceanModal() {
  const [activePanel, setActivePanel] = useState(null);

  useEffect(() => {
    return subscribeToModal(setActivePanel);
  }, []);

  if (!activePanel) return null;

  const baseUrl = import.meta.env.BASE_URL || "/";
  const resumePath = `${baseUrl}Garcia_Matthew_Resume.pdf`;

  const panels = {
    resume: {
      title: "Resume",
      content: (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#ffc88a", marginBottom: "12px" }}>Education</h3>
            <p style={{ color: "#d0d8e0", marginBottom: "8px" }}>
              <strong>California State University Northridge</strong>
            </p>
            <p style={{ color: "#888", fontSize: "14px", marginBottom: "12px" }}>
              Bachelor of Science in Computer Science | Graduation: December 2026
            </p>
            <p style={{ color: "#d0d8e0", fontSize: "14px" }}>
              Relevant courses: OOP in Java/C++, Intro/Advanced DSA, OS, Intro to SWE, Web Engineering,
              Software Requirements Analysis, Verification/Validation, Advanced Web Eng, Multimedia System Design, Senior Design Project
            </p>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#ffc88a", marginBottom: "12px" }}>Projects</h3>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: "#d0d8e0", fontWeight: "500" }}>PokeShop</p>
                <a href="https://chrillspoketcg.click/" target="_blank" rel="noopener noreferrer" style={{ color: "#4a9eff", fontSize: "13px" }}>chrillspoketcg.click</a>
              </div>
              <p style={{ color: "#888", fontSize: "13px" }}>React, Node.js, Express, PostgreSQL, AWS, Auth0</p>
              <p style={{ color: "#d0d8e0", fontSize: "14px" }}>
                Full-stack Pokemon card marketplace on AWS with S3, CloudFront, Lambda, RDS PostgreSQL, and Auth0 authentication with RBAC.
              </p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "#d0d8e0", fontWeight: "500" }}>Minimalist C Compiler</p>
              <p style={{ color: "#888", fontSize: "13px" }}>Python, x86 Assembly</p>
              <p style={{ color: "#d0d8e0", fontSize: "14px" }}>
                Built a compiler from scratch translating C subset into x86 assembly with regex-based lexer and recursive descent parser covering 100% of test grammar cases.
              </p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "#d0d8e0", fontWeight: "500" }}>Full Stack Authentication App</p>
              <p style={{ color: "#888", fontSize: "13px" }}>AWS, Next.js, Node.js, Express, Tailwind</p>
              <p style={{ color: "#d0d8e0", fontSize: "14px" }}>
                Built full-stack auth system with secure REST APIs, bcrypt hashing with salting, and responsive React UI.
              </p>
            </div>
            <div>
              <p style={{ color: "#d0d8e0", fontWeight: "500" }}>Marks Automation Script</p>
              <p style={{ color: "#888", fontSize: "13px" }}>Python, MongoDB</p>
              <p style={{ color: "#d0d8e0", fontSize: "14px" }}>
                Automated 4 VFX pipeline tasks, reducing processing time from 30+ minutes to under 60 seconds.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href={resumePath}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "linear-gradient(90deg, #4a9eff, #6bb3ff)",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Preview
            </a>
            <a
              href={resumePath}
              download="Matthew_Garcia_Resume.pdf"
              style={{
                background: "linear-gradient(90deg, #34d399, #4ade80)",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Download
            </a>
            <a
              href="https://www.linkedin.com/in/matthew-garcia-b0301b217/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "linear-gradient(90deg, #0077b5, #00a0dc)",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/captainPeanutbuttter495"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "linear-gradient(90deg, #333, #555)",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              GitHub
            </a>
          </div>
        </>
      ),
    },
    experience: {
      title: "Work Experience",
      content: (
        <>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#ff6b6b", marginBottom: "8px" }}>
              Student Assistant - Library @ CSUN
            </h3>
            <p style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>
              Jan 2023 - Present | Northridge, CA
            </p>
            <ul style={{ color: "#d0d8e0", paddingLeft: "20px", margin: 0 }}>
              <li style={{ marginBottom: "6px" }}>Assisted an average of 5 patrons per day with research tools, catalog navigation, and library technology services</li>
              <li>Guided students and faculty in locating academic sources and using scholarly databases for coursework and research</li>
            </ul>
          </div>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#ff6b6b", marginBottom: "8px" }}>
              Research Associate - Full Stack Developer @ CSUN
            </h3>
            <p style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>
              Sep 2023 - May 2025 | React, Firebase, Vitest
            </p>
            <ul style={{ color: "#d0d8e0", paddingLeft: "20px", margin: 0 }}>
              <li style={{ marginBottom: "6px" }}>Collaborated with stakeholders to define requirements and produced interactive Figma prototypes for a Coaching Dashboard used by university soccer staff and athletes</li>
              <li style={{ marginBottom: "6px" }}>Integrated Firebase with React to fetch and visualize sprint performance data using Chart.js; enabled real-time health metric monitoring</li>
              <li>Implemented role-based access control using react-permissions, ensuring data privacy and permission enforcement across user types</li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: "#ff6b6b", marginBottom: "8px" }}>
              Student Mentor - Student Development and Transitional Program @ CSUN
            </h3>
            <p style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>
              May 2023 - Aug 2024 | Northridge, CA
            </p>
            <ul style={{ color: "#d0d8e0", paddingLeft: "20px", margin: 0 }}>
              <li style={{ marginBottom: "6px" }}>Mentored first-year students in goal setting, study planning, and time management to promote academic success</li>
              <li>Partnered with staff and faculty to connect students with campus resources, contributing to improved engagement and retention</li>
            </ul>
          </div>
        </>
      ),
    },
    about: {
      title: "About Me",
      content: (
        <>
          <p style={{ color: "#d0d8e0", marginBottom: "16px" }}>
            Hi! I'm Matthew Garcia, a Computer Science student at California State University Northridge
            graduating December 2026. I'm passionate about building full-stack applications and have
            experience in everything from low-level compiler development to modern cloud-deployed web
            applications with React, Node.js, and AWS.
          </p>
          <p style={{ color: "#d0d8e0", marginBottom: "20px" }}>
            Feel free to reach out at <a href="mailto:garciamatthew2024@gmail.com" style={{ color: "#4a9eff" }}>garciamatthew2024@gmail.com</a> or
            call me at <span style={{ color: "#4a9eff" }}>747-463-4068</span>.
          </p>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#6bcb77", marginBottom: "12px" }}>Languages</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["JavaScript", "Python", "Java", "C/C++", "SQL", "HTML/CSS"].map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "rgba(107, 203, 119, 0.2)",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    color: "#6bcb77",
                    border: "1px solid rgba(107, 203, 119, 0.3)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#4a9eff", marginBottom: "12px" }}>Frameworks</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["React", "Node.js", "Express", "TailwindCSS", "Prisma ORM", "Vitest"].map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "rgba(74, 158, 255, 0.2)",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    color: "#4a9eff",
                    border: "1px solid rgba(74, 158, 255, 0.3)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#f97316", marginBottom: "12px" }}>Cloud & DevOps</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["AWS Lambda", "S3", "CloudFront", "RDS", "Route 53", "API Gateway", "Serverless Framework", "Firebase"].map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "rgba(249, 115, 22, 0.2)",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    color: "#f97316",
                    border: "1px solid rgba(249, 115, 22, 0.3)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ color: "#ffd93d", marginBottom: "12px" }}>Tools</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["Git", "PostgreSQL", "MongoDB", "Auth0/JWT", "REST APIs", "Figma", "VS Code", "Jira"].map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "rgba(255, 217, 61, 0.2)",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    color: "#ffd93d",
                    border: "1px solid rgba(255, 217, 61, 0.3)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </>
      ),
    },
    interests: {
      title: "Interests & Hobbies",
      content: (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
          }}
        >
          {[
            { icon: "🎮", name: "Gaming" },
            { icon: "📚", name: "Reading" },
            { icon: "🎵", name: "Music" },
            { icon: "✈️", name: "Travel" },
            { icon: "📷", name: "Photography" },
            { icon: "🏃", name: "Fitness" },
          ].map((interest) => (
            <div
              key={interest.name}
              style={{
                background: "rgba(255, 217, 61, 0.1)",
                padding: "16px",
                borderRadius: "12px",
                textAlign: "center",
                border: "1px solid rgba(255, 217, 61, 0.2)",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                {interest.icon}
              </div>
              <p style={{ color: "#ffd93d", margin: 0, fontWeight: "500" }}>
                {interest.name}
              </p>
            </div>
          ))}
        </div>
      ),
    },
  };

  const panel = panels[activePanel];
  if (!panel) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)",
        zIndex: 99999,
      }}
      onClick={closeModal}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          borderRadius: "20px",
          padding: "40px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 200, 100, 0.15)",
          border: "1px solid rgba(255, 200, 100, 0.2)",
          color: "#ffffff",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            borderBottom: "1px solid rgba(255, 200, 100, 0.3)",
            paddingBottom: "16px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "600",
              background: "linear-gradient(90deg, #ffc88a, #ffdd99)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {panel.title}
          </h2>
          <button
            type="button"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "#ffffff",
              fontSize: "24px",
              cursor: "pointer",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 100, 100, 0.3)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
          >
            ×
          </button>
        </div>
        <div style={{ lineHeight: "1.7", fontSize: "16px" }}>{panel.content}</div>
      </div>
    </div>
  );
}

// ============ MAIN 3D COMPONENT ============
export default function OceanSunset({
  azimuth = 180,
  exposure = 0.9,
  cycleSpeed = 0.1,
}) {
  const { gl, scene, camera } = useThree();
  const sun = useMemo(() => new THREE.Vector3(), []);
  const pmremGenerator = useMemo(() => new THREE.PMREMGenerator(gl), [gl]);
  const envScene = useMemo(() => new THREE.Scene(), []);
  const sunMeshRef = useRef();

  const [waterNormals, setWaterNormals] = useState(null);

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

  /* ---------------- Camera baseline ---------------- */
  useEffect(() => {
    camera.fov = 55;
    camera.near = 1;
    camera.far = 20000;
    // Centered (x=0) and zoomed out to max distance (220)
    // Position at max distance with a nice viewing angle looking slightly down at the water
    camera.position.set(0, 45, 215);
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

  /* ---------------- sun position + environment (initial) ---------------- */
  useEffect(() => {
    if (!water) return;
    const phi = THREE.MathUtils.degToRad(90 - 7);
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
  }, [water, azimuth, sun, sky, pmremGenerator, envScene, scene]);

  /* ---------------- animate water + sunrise/sunset cycle ---------------- */
  useFrame(({ clock }) => {
    if (!water) return;
    water.material.uniforms.time.value += 1 / 60;

    const time = clock.getElapsedTime() * cycleSpeed;
    const elevation = Math.sin(time) * 8.5 + 6.5;

    const phi = THREE.MathUtils.degToRad(90 - elevation);
    const theta = THREE.MathUtils.degToRad(azimuth);
    sun.setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms.sunPosition.value.copy(sun);
    water.material.uniforms.sunDirection.value.copy(sun).normalize();

    const t = Math.max(0, Math.min(1, (elevation + 2) / 17));

    sky.material.uniforms.turbidity.value = 20 - t * 10;
    sky.material.uniforms.rayleigh.value = 0.5 + t * 2.5;
    sky.material.uniforms.mieCoefficient.value = 0.02 - t * 0.015;
    sky.material.uniforms.mieDirectionalG.value = 0.95 - t * 0.1;

    if (sunMeshRef.current) {
      sunMeshRef.current.position.copy(sun.clone().multiplyScalar(4000));

      const sunColor = new THREE.Color();
      if (t < 0.3) {
        sunColor.setHSL(0.02 + t * 0.1, 1.0, 0.5 + t * 0.3);
      } else if (t < 0.6) {
        sunColor.setHSL(0.08 + (t - 0.3) * 0.05, 0.95, 0.6 + t * 0.2);
      } else {
        sunColor.setHSL(0.12, 0.8 - (t - 0.6) * 0.5, 0.7 + t * 0.15);
      }
      sunMeshRef.current.material.color.copy(sunColor);
    }

    const waterSunColor = new THREE.Color();
    if (t < 0.3) {
      waterSunColor.setHSL(0.05, 0.9, 0.5 + t * 0.3);
    } else {
      waterSunColor.setHSL(0.1, 0.7, 0.6 + t * 0.2);
    }
    water.material.uniforms.sunColor.value.copy(waterSunColor);

    const waterBaseColor = new THREE.Color();
    waterBaseColor.setHSL(0.55, 0.6 + t * 0.2, 0.08 + t * 0.1);
    water.material.uniforms.waterColor.value.copy(waterBaseColor);

    gl.toneMappingExposure = 0.3 + t * 0.7;

    const bgColor = new THREE.Color();
    if (t < 0.2) {
      bgColor.setHSL(0.7, 0.4, 0.05 + t * 0.1);
    } else if (t < 0.5) {
      bgColor.setHSL(0.6 - (t - 0.2) * 0.3, 0.5, 0.1 + t * 0.15);
    } else {
      bgColor.setHSL(0.55, 0.4, 0.15 + t * 0.1);
    }
    scene.background = bgColor;
  });

  /* ---------------- compute polar limits ---------------- */
  useEffect(() => {
    const target = new THREE.Vector3(0, 6, 0);
    const v = camera.position.clone().sub(target);
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(v);

    const initialPolar = spherical.phi;
    const allowedUpRange = Math.PI * 0.12;

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

  return (
    <>
      <OrbitControls
        target={[0, 6, 0]}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.06}
        minAzimuthAngle={-Math.PI / 5}
        maxAzimuthAngle={Math.PI / 5}
        minPolarAngle={polarLimits.minPolarAngle}
        maxPolarAngle={polarLimits.maxPolarAngle}
      />

      <mesh ref={sunMeshRef}>
        <sphereGeometry args={[65, 24, 18]} />
        <meshBasicMaterial color={0xffc88a} toneMapped={false} />
      </mesh>

      {/* 4 Interactive Floating Spheres */}
      <FloatingSphere
        position={[-100, 15, 60]}
        radius={12}
        speed={0.8}
        offset={0}
        label="Resume"
        color={0x4a9eff}
        panelId="resume"
      />
      <FloatingSphere
        position={[100, 18, 55]}
        radius={14}
        speed={0.9}
        offset={1.5}
        label="Work Experience"
        color={0xff6b6b}
        panelId="experience"
      />
      <FloatingSphere
        position={[-85, 12, -50]}
        radius={11}
        speed={0.7}
        offset={3.0}
        label="About Me"
        color={0x6bcb77}
        panelId="about"
      />
      <FloatingSphere
        position={[90, 16, -45]}
        radius={13}
        speed={0.85}
        offset={4.5}
        label="Interests"
        color={0xffd93d}
        panelId="interests"
      />
    </>
  );
}
