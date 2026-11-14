"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { Desk, ItemModel, Recruiter, Room, ShellModel, Shotgun } from "./assets";
import { Lights } from "./GameScene3D";

const FACES = [":)", "hi.", "HIRE?", "o_O", ";)", "..."];
const LOOK = new THREE.Vector3(0, 0.3, -0.7);

/** Slow drifting camera that leans toward the pointer. */
function Drift({ still }: { still: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useFrame((state, dt) => {
    const camera = state.camera;
    const t = still ? 0 : state.clock.elapsedTime;
    const x = Math.sin(t * 0.25) * 0.35 + pointer.current.x * 0.12;
    const y = 0.62 + Math.sin(t * 0.2) * 0.04 - pointer.current.y * 0.05;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 2, dt);
    camera.position.z = 1.55;
    camera.lookAt(LOOK);
  });
  return null;
}

function Teaser({ still }: { still: boolean }) {
  const [face, setFace] = useState(0);
  useEffect(() => {
    if (still) return;
    const id = window.setInterval(() => setFace((f) => (f + 1) % FACES.length), 2400);
    return () => window.clearInterval(id);
  }, [still]);
  return (
    <>
      <color attach="background" args={["#050607"]} />
      <fog attach="fog" args={["#050607", 3, 7]} />
      <Drift still={still} />
      <Lights />
      <Room />
      <Desk />
      <Recruiter face={FACES[face]} tone={FACES[face] === "HIRE?" ? "glee" : "ok"} thinking={FACES[face] === "..."} />
      <group position={[0.02, 0.035, 0.1]} rotation={[0, 0.18, 0]}>
        <Shotgun />
      </group>
      {[-0.08, -0.03, 0.02, 0.07].map((x, i) => (
        <group key={x} position={[x - 0.35, 0.003, 0.3]}>
          <ShellModel kind={i % 2 ? "blank" : "live"} />
        </group>
      ))}
      <group position={[0.42, 0.006, 0.36]} rotation={[0, -0.5, 0]}>
        <ItemModel id="coffee" />
      </group>
      <group position={[-0.25, 0, -0.3]}>
        <ItemModel id="debugger" />
      </group>
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.6} luminanceThreshold={0.75} mipmapBlur />
        <Vignette offset={0.3} darkness={0.7} />
      </EffectComposer>
    </>
  );
}

export default function HeroScene3D({ still = false }: { still?: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ fov: 42, near: 0.03, far: 20, position: [0, 0.62, 1.55] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <Teaser still={still} />
      </Suspense>
    </Canvas>
  );
}
