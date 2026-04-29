"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import {
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Hero3D — multi-orbital atomic scene, scoped to the hero section.
 *
 * Composition (six things happening simultaneously):
 *
 *   1. Central glowing core    — small ultra-bright sphere. Bloom
 *                                 amplifies it into a sun-like halo.
 *                                 Pulses gently.
 *   2. Distorted halo sphere    — translucent blue sphere wrapping
 *                                 the core, distorts via simplex
 *                                 noise (drei MeshDistortMaterial).
 *                                 Acts as the "atmosphere."
 *   3. Three orbital particle rings — each on a different plane (XY,
 *                                 XZ, YZ tilted), rotating at
 *                                 different speeds. Atomic-structure
 *                                 visual identity. Particles render
 *                                 as soft circles via custom canvas
 *                                 texture (no more blocky squares).
 *   4. Background star particles — diffuse cloud filling the
 *                                 viewport for "deep space" context.
 *   5. Mouse reactivity         — when cursor is near the form, the
 *                                 distortion intensifies and the
 *                                 rings spin faster.
 *   6. Post-processing          — Bloom, Vignette, Chromatic
 *                                 Aberration. Film-graded finish.
 *
 * Camera: slow orbital drift + mouse parallax + scroll-driven
 * dolly. The form scales with scroll so it shrinks toward the
 * top as the user scrolls past the hero.
 *
 * Scoped to its parent (absolute, not fixed), so the whole scene
 * lives only in the hero — once you scroll past, it's gone, and
 * the rest of the page is back to clean typography.
 */
export function Hero3D() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 0, 3]} intensity={3} color="#0a84ff" />
        <pointLight position={[5, -3, 2]} intensity={1} color="#409cff" />

        <Scene scrollYProgress={scrollYProgress} />

        {/* Film-grade post-processing pipeline.
            - Bloom: makes the core + bright particles bleed light.
              `mipmapBlur` gives the smoothest large halo.
            - Vignette: darkens the corners to frame the scene.
            - ChromaticAberration: subtle RGB split — premium lens. */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={2.2}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.85}
          />
          <Vignette
            offset={0.4}
            darkness={0.6}
            blendFunction={BlendFunction.NORMAL}
          />
          <ChromaticAberration
            offset={[0.0008, 0.0008]}
            radialModulation={false}
            modulationOffset={0}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Scene — root group with everything inside it. Handles camera
   animation in one useFrame (orbit + parallax + scroll dolly).
   ───────────────────────────────────────────────────────────────── */

function Scene({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const { camera } = useThree();

  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.4,
  });

  // Mouse parallax + reactivity
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Hover proximity — when mouse is near center, intensity spikes.
  // Distance from center = sqrt(mx^2 + my^2), max ~0.7. Inverted
  // so center → 1 (max intensity), edges → 0.
  const mouseIntensity = useMotionValue(0);

  const cameraZ = useTransform(progress, [0, 1], [6, 9]);
  const sceneScale = useTransform(progress, [0, 0.5, 1], [1, 0.85, 0.65]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mouseX.set(nx);
      mouseY.set(ny);
      // distance from center (0..0.7-ish), invert + clamp
      const dist = Math.sqrt(nx * nx + ny * ny);
      mouseIntensity.set(Math.max(0, 1 - dist * 1.6));
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, mouseIntensity]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const orbitX = Math.sin(t * 0.05) * 0.5;
    const orbitY = Math.cos(t * 0.04) * 0.25;
    camera.position.x = orbitX + smoothMouseX.get() * 0.7;
    camera.position.y = orbitY - smoothMouseY.get() * 0.4;
    camera.position.z = cameraZ.get();
    camera.lookAt(0, 0, 0);
  });

  return (
    <group scale={sceneScale.get()}>
      <Starfield />
      <Core />
      <DistortedHalo mouseIntensity={mouseIntensity} />
      <OrbitalRing
        radius={2.4}
        count={400}
        plane="xy"
        speed={0.4}
        color="#0a84ff"
        mouseIntensity={mouseIntensity}
      />
      <OrbitalRing
        radius={3}
        count={500}
        plane="xz"
        speed={-0.3}
        color="#5ac8fa"
        mouseIntensity={mouseIntensity}
      />
      <OrbitalRing
        radius={3.6}
        count={600}
        plane="tilted"
        speed={0.25}
        color="#409cff"
        mouseIntensity={mouseIntensity}
      />
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Circular point texture — runtime-generated soft glowing dot
   sprite. Replaces PointsMaterial's default square pixel.
   ───────────────────────────────────────────────────────────────── */

function makeCircleTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }
  // Radial gradient — bright center, fully transparent edge
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.4, "rgba(255, 255, 255, 0.6)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ─────────────────────────────────────────────────────────────────
   Core — small ultra-bright sphere at scene origin. Bloom turns
   it into a sun-like halo. Pulses gently.
   ───────────────────────────────────────────────────────────────── */

function Core() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const s = 1 + Math.sin(t * 1.5) * 0.12;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshBasicMaterial color="#dceeff" />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DistortedHalo — translucent sphere wrapping the core, distorts
   via simplex noise. The "atmosphere" of the form. Reacts to
   mouse intensity (more distort when cursor is near).
   ───────────────────────────────────────────────────────────────── */

function DistortedHalo({
  mouseIntensity,
}: {
  mouseIntensity: ReturnType<typeof useMotionValue>;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.1;
    ref.current.rotation.x += delta * 0.05;

    const mat = ref.current.material as THREE.Material & {
      distort?: number;
      speed?: number;
    };
    if (mat) {
      const intensity = mouseIntensity.get();
      // Base distort 0.35, +0.25 when cursor is centered.
      if ("distort" in mat) mat.distort = 0.35 + intensity * 0.25;
      if ("speed" in mat) mat.speed = 1.5 + intensity * 2;
    }
    void state;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2, 96, 96]} />
      <MeshDistortMaterial
        color="#0a84ff"
        emissive="#0a84ff"
        emissiveIntensity={0.4}
        distort={0.35}
        speed={1.5}
        roughness={0.3}
        metalness={0.2}
        transparent
        opacity={0.65}
        clearcoat={1}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OrbitalRing — particles orbiting in a specific plane at a given
   radius. Three of these stacked at different planes + speeds give
   the atomic-structure feel.
   ───────────────────────────────────────────────────────────────── */

function OrbitalRing({
  radius,
  count,
  plane,
  speed,
  color,
  mouseIntensity,
}: {
  radius: number;
  count: number;
  plane: "xy" | "xz" | "yz" | "tilted";
  speed: number;
  color: string;
  mouseIntensity: ReturnType<typeof useMotionValue>;
}) {
  const ref = useRef<THREE.Points>(null);
  const circleTexture = useMemo(() => makeCircleTexture(), []);

  // Generate ring positions — particles distributed around a circle
  // of given radius, with small Z-axis jitter so the ring has volume
  // rather than being a perfect 2D plane.
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.1;
      const r = radius + (Math.random() - 0.5) * 0.3;
      const jitter = (Math.random() - 0.5) * 0.15;

      let x = Math.cos(angle) * r;
      let y = Math.sin(angle) * r;
      let z = jitter;

      // Rotate the ring into its plane
      if (plane === "xz") {
        [y, z] = [z, y];
      } else if (plane === "yz") {
        [x, z] = [z, x];
      } else if (plane === "tilted") {
        // 45° tilt — rotate around X then Z
        const tilt = Math.PI / 4;
        const ny = y * Math.cos(tilt) - z * Math.sin(tilt);
        const nz = y * Math.sin(tilt) + z * Math.cos(tilt);
        y = ny;
        z = nz;
      }

      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [radius, count, plane]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    // Base rotation speed scaled by mouse intensity (faster when
    // cursor is near). Each ring rotates around its plane's normal.
    const intensityBoost = 1 + mouseIntensity.get() * 1.5;
    const omega = speed * intensityBoost * delta;

    if (plane === "xy") {
      ref.current.rotation.z += omega;
    } else if (plane === "xz") {
      ref.current.rotation.y += omega;
    } else if (plane === "yz") {
      ref.current.rotation.x += omega;
    } else {
      // tilted — rotate around the vertical axis
      ref.current.rotation.y += omega * 0.7;
      ref.current.rotation.x += omega * 0.3;
    }
    void state;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color={color}
        map={circleTexture}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Starfield — diffuse cloud filling the viewport for "deep space"
   context. Static, no rotation.
   ───────────────────────────────────────────────────────────────── */

function Starfield() {
  const positions = useMemo(() => {
    const count = 800;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}
