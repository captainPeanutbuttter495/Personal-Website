// src/environments/cherry-blossom/ParticleSpiral.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * WebGPU Particle Spiral with Afterimage effect
 * Based on three.js webgpu afterimage example
 */
export default function ParticleSpiral() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let camera, scene, renderer, particles;
    let postProcessing, afterImagePass, scenePass;

    const init = async () => {
      // Dynamic imports for WebGPU modules
      const THREE_WEBGPU = await import("three/webgpu");
      const TSL = await import("three/tsl");
      const { afterImage } = await import(
        "three/addons/tsl/display/AfterImageNode.js"
      );

      const {
        instancedBufferAttribute,
        uniform,
        mod,
        pass,
        texture,
        float,
        time,
        vec2,
        vec3,
        vec4,
        sin,
        cos,
      } = TSL;

      const params = {
        damp: uniform(0.8, "float"),
        enabled: true,
      };

      // Renderer
      renderer = new THREE_WEBGPU.WebGPURenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Camera
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.z = 1000;

      // Scene
      scene = new THREE.Scene();

      // Create circle texture programmatically
      const createCircleTexture = () => {
        const size = 64;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Draw soft circle gradient
        const gradient = ctx.createRadialGradient(
          size / 2, size / 2, 0,
          size / 2, size / 2, size / 2
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.3)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
      };

      const sprite = createCircleTexture();

      // Geometry setup
      const radius = 600;
      const count = 50000;

      const vertex = new THREE.Vector3();
      const color = new THREE.Color();

      const colors = [];
      const vertices = [];
      const timeOffsets = [];

      const getRandomPointOnSphere = (r, v) => {
        const angle = Math.random() * Math.PI * 2;
        const u = Math.random() * 2 - 1;
        v.set(
          Math.cos(angle) * Math.sqrt(1 - Math.pow(u, 2)) * r,
          Math.sin(angle) * Math.sqrt(1 - Math.pow(u, 2)) * r,
          u * r
        );
        return v;
      };

      for (let i = 0; i < count; i++) {
        getRandomPointOnSphere(radius, vertex);
        vertices.push(vertex.x, vertex.y, vertex.z);

        // Rainbow color palette - full spectrum
        const hue = i / count; // 0 to 1 = full rainbow
        color.setHSL(hue, 0.7, 0.7, THREE.SRGBColorSpace);
        colors.push(color.r, color.g, color.b);

        timeOffsets.push(i / count);
      }

      const positionAttribute = new THREE.InstancedBufferAttribute(
        new Float32Array(vertices),
        3
      );
      const colorAttribute = new THREE.InstancedBufferAttribute(
        new Float32Array(colors),
        3
      );
      const timeAttribute = new THREE.InstancedBufferAttribute(
        new Float32Array(timeOffsets),
        1
      );

      // Material with TSL
      const material = new THREE_WEBGPU.SpriteNodeMaterial({
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const localTime = instancedBufferAttribute(timeAttribute).add(
        time.mul(0.1)
      );
      const modTime = mod(localTime, 1.0);
      const accTime = modTime.mul(modTime);

      const angle = accTime.mul(40.0);
      const pulse = vec2(sin(angle).mul(20.0), cos(angle).mul(20.0));
      const pos = instancedBufferAttribute(positionAttribute);

      const animated = vec3(
        pos.x.mul(accTime).add(pulse.x),
        pos.y.mul(accTime).add(pulse.y),
        pos.z.mul(accTime).mul(1.75)
      );
      const fAlpha = modTime.oneMinus().mul(2.0);

      material.colorNode = texture(sprite).mul(
        vec4(instancedBufferAttribute(colorAttribute), fAlpha)
      );
      material.positionNode = animated;
      material.scaleNode = float(2);

      particles = new THREE_WEBGPU.Sprite(material);
      particles.count = count;
      scene.add(particles);

      // Postprocessing
      postProcessing = new THREE_WEBGPU.PostProcessing(renderer);
      scenePass = pass(scene, camera);
      afterImagePass = afterImage(scenePass, params.damp);
      postProcessing.outputNode = afterImagePass;

      // Handle resize
      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", onWindowResize);

      // Animation loop
      const animate = (time) => {
        particles.rotation.z = time * 0.001;
        postProcessing.render();
        animationIdRef.current = requestAnimationFrame(animate);
      };

      // Start animation after renderer is ready
      await renderer.init();
      animate(0);
    };

    init().catch((err) => {
      console.error("WebGPU initialization failed:", err);
      // Fallback message if WebGPU not supported
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #FFB7C5;
            font-family: system-ui;
            text-align: center;
            padding: 20px;
          ">
            <p>WebGPU is not supported in your browser.<br/>Please use Chrome 113+ or Edge 113+</p>
          </div>
        `;
      }
    });

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
      }}
    />
  );
}
