"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { canUseItem } from "@/game/engine";
import { faceFor } from "@/game/face";
import { TIMING, useGame } from "@/game/store";
import type { ItemId, Side } from "@/game/types";
import { Desk, ItemModel, LAMP_BULB_POSITION, Recruiter, Room, SHOTGUN_MUZZLE, ShellModel, Shotgun, WINDOW_POSITION } from "./assets";

const CAMERA_TARGET = new THREE.Vector3(0, 0.2, -0.55);
const HEAD = new THREE.Vector3(0, 0.66, -0.95);
const X_AXIS = new THREE.Vector3(1, 0, 0);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Seconds since the current game event started (or Infinity if none). */
function useEventClock() {
  const eventId = useGame((s) => s.game.eventId);
  const start = useRef(-Infinity);
  useEffect(() => {
    start.current = performance.now();
  }, [eventId]);
  return () => (performance.now() - start.current) / 1000;
}

function cameraBase(aspect: number) {
  return aspect < 0.8
    ? { pos: new THREE.Vector3(0, 0.95, 2.35), fov: 64 }
    : aspect < 1.25
      ? { pos: new THREE.Vector3(0, 0.78, 1.9), fov: 56 }
      : { pos: new THREE.Vector3(0, 0.7, 1.6), fov: 48 };
}

/** Responsive camera with pointer parallax and recoil shake. */
function CameraRig() {
  const pointer = useRef({ x: 0, y: 0 });
  const elapsed = useEventClock();
  const event = useGame((s) => s.game.event);
  const tmpRef = useRef(new THREE.Vector3());

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, dt) => {
    const tmp = tmpRef.current;
    const base = cameraBase(state.size.width / state.size.height);
    const cam = state.camera as THREE.PerspectiveCamera;
    if (Math.abs(cam.fov - base.fov) > 0.01) {
      cam.fov = THREE.MathUtils.damp(cam.fov, base.fov, 6, dt);
      cam.updateProjectionMatrix();
    }
    tmp.copy(base.pos);
    tmp.x += pointer.current.x * 0.07;
    tmp.y -= pointer.current.y * 0.035;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, tmp.x, 3, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, tmp.y, 3, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, tmp.z, 3, dt);

    // Shake after a live shot, harder when you're the one hit.
    if (event?.kind === "shot" && event.shell === "live") {
      const t = elapsed() - TIMING.fireAt / 1000;
      if (t > 0 && t < 0.6) {
        const amp = (event.target === "player" ? 0.03 : 0.012) * (1 - t / 0.6);
        cam.position.x += (Math.random() - 0.5) * amp;
        cam.position.y += (Math.random() - 0.5) * amp;
      }
    }
    cam.lookAt(CAMERA_TARGET);
  });
  return null;
}

export function Lights() {
  const spot = useRef<THREE.SpotLight>(null);
  const bulb = useRef<THREE.PointLight>(null);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, 0, 0.05);
    return o;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Mostly steady with an occasional brown-out flicker.
    const flick = (t % 7.3 > 7.0 ? 0.55 + Math.random() * 0.4 : 1) * (1 + Math.sin(t * 50) * 0.01);
    if (spot.current) spot.current.intensity = 9 * flick;
    if (bulb.current) bulb.current.intensity = 1.6 * flick;
  });

  return (
    <>
      <ambientLight intensity={0.22} color="#8aa0b8" />
      <hemisphereLight args={["#2a3440", "#0b0806", 0.4]} />
      <primitive object={target} />
      <spotLight
        ref={spot}
        position={LAMP_BULB_POSITION}
        target={target}
        angle={0.95}
        penumbra={0.65}
        decay={1.1}
        distance={6}
        color="#ffd9a0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <pointLight ref={bulb} position={[LAMP_BULB_POSITION[0], LAMP_BULB_POSITION[1] + 0.06, LAMP_BULB_POSITION[2]]} color="#ffcf8a" distance={5} decay={1.4} />
      <directionalLight position={[WINDOW_POSITION[0], WINDOW_POSITION[1] + 0.4, WINDOW_POSITION[2] + 0.4]} intensity={0.35} color="#6f9bd1" />
      <pointLight position={[0, 1.0, -1.7]} intensity={0.9} distance={2.2} color="#4a6a94" />
    </>
  );
}

function RecruiterRig() {
  const game = useGame((s) => s.game);
  const busy = useGame((s) => s.busy);
  const group = useRef<THREE.Group>(null);
  const elapsed = useEventClock();
  const face = faceFor(game, busy);
  const thinking = game.phase === "turn" && game.turn === "recruiter" && !busy;
  const event = game.event;

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    let z = 0;
    let rx = 0;
    if (event?.kind === "shot" && event.shell === "live" && event.target === "recruiter") {
      const t = elapsed() - TIMING.fireAt / 1000;
      if (t > 0 && t < 1.2) {
        const k = Math.exp(-t * 5) * Math.sin(Math.min(t * 14, Math.PI));
        z = -0.12 * k - 0.03 * Math.exp(-t * 3);
        rx = -0.2 * k;
      }
    }
    // Idle breathing.
    const breathe = Math.sin(state.clock.elapsedTime * 1.4) * 0.004;
    g.position.set(0, breathe, z);
    g.rotation.x = rx;
  });

  return (
    <group ref={group}>
      <Recruiter face={face.text} tone={face.tone} thinking={thinking} />
    </group>
  );
}

const REST_POS = new THREE.Vector3(0.02, 0.035, 0.1);
const REST_QUAT = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.18, 0));

function aimFor(shooter: Side, target: Side, camPos: THREE.Vector3) {
  const pos =
    shooter === "player"
      ? target === "recruiter"
        ? new THREE.Vector3(0.06, 0.24, 0.5)
        : new THREE.Vector3(0.02, 0.34, 0.6)
      : target === "player"
        ? new THREE.Vector3(-0.04, 0.3, -0.42)
        : new THREE.Vector3(0.26, 0.6, -0.35);
  const at = target === "recruiter" ? HEAD : camPos;
  const dir = at.clone().sub(pos).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(X_AXIS, dir);
  return { pos, quat, dir };
}

function GunRig() {
  const event = useGame((s) => s.game.event);
  const doubleDamage = useGame((s) => s.game.doubleDamage);
  const group = useRef<THREE.Group>(null);
  const flash = useRef<THREE.Mesh>(null);
  const flashLight = useRef<THREE.PointLight>(null);
  const elapsed = useEventClock();
  const { camera } = useThree();
  const aim = useRef<ReturnType<typeof aimFor> | null>(null);
  const scratch = useRef({ pos: new THREE.Vector3(), quat: new THREE.Quaternion() });

  useEffect(() => {
    aim.current = event?.kind === "shot" ? aimFor(event.shooter, event.target, camera.position.clone()) : null;
  }, [event, camera]);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const { pos: tmpPos, quat: tmpQuat } = scratch.current;
    const a = aim.current;
    const s = elapsed();
    const T = TIMING.shot / 1000;
    const fire = TIMING.fireAt / 1000;
    let k = 0;
    if (a && s < T) {
      if (s < 0.45) k = ease(clamp01(s / 0.45));
      else if (s < T - 0.4) k = 1;
      else k = 1 - ease(clamp01((s - (T - 0.4)) / 0.4));
    }
    tmpPos.copy(REST_POS);
    tmpQuat.copy(REST_QUAT);
    if (a && k > 0) {
      tmpPos.lerp(a.pos, k);
      tmpQuat.slerp(a.quat, k);
      const r = s - fire;
      if (r > 0 && event?.kind === "shot") {
        const kick = (event.shell === "live" ? 0.08 : 0.015) * Math.exp(-r * 10) * clamp01(r * 40);
        tmpPos.addScaledVector(a.dir, -kick);
        tmpPos.y += kick * 0.6;
      }
    }
    g.position.copy(tmpPos);
    g.quaternion.copy(tmpQuat);

    const live = event?.kind === "shot" && event.shell === "live";
    const on = live && s > fire && s < fire + 0.09;
    if (flash.current) {
      flash.current.visible = on;
      flash.current.scale.setScalar(on ? 0.8 + Math.random() * 0.6 : 0.001);
    }
    if (flashLight.current) flashLight.current.intensity = on ? 30 : 0;
  });

  return (
    <group ref={group}>
      <Shotgun sticker={doubleDamage} />
      <group position={SHOTGUN_MUZZLE}>
        <mesh ref={flash} visible={false} position={[0.05, 0, 0]}>
          <sphereGeometry args={[0.06, 12, 8]} />
          <meshBasicMaterial color="#ffd27a" toneMapped={false} transparent opacity={0.9} />
        </mesh>
        <pointLight ref={flashLight} color="#ffb060" distance={3} decay={1.5} intensity={0} />
      </group>
    </group>
  );
}

/** Shells shown on the mat at load time, then swept into the gun. */
function LoadReveal() {
  const phase = useGame((s) => s.game.phase);
  const busy = useGame((s) => s.busy);
  const info = useGame((s) => s.game.loadInfo);
  const eventId = useGame((s) => s.game.eventId);
  const elapsed = useEventClock();
  const refs = useRef<(THREE.Group | null)[]>([]);
  const kinds = useMemo(
    () => [...Array<"live">(info.live).fill("live"), ...Array<"blank">(info.blank).fill("blank")],
    [info.live, info.blank],
  );
  const show = phase === "loading" && busy;

  useFrame(() => {
    const s = elapsed();
    refs.current.forEach((g, i) => {
      if (!g) return;
      const n = kinds.length;
      const x = (i - (n - 1) / 2) * 0.055;
      const appear = clamp01((s - i * 0.12) / 0.35);
      const leave = clamp01((s - 2.1 - i * 0.05) / 0.6);
      g.position.set(THREE.MathUtils.lerp(x, 0.0, ease(leave)), 0.003 + (1 - ease(appear)) * 0.25 + ease(leave) * 0.04, THREE.MathUtils.lerp(0.3, 0.1, ease(leave)));
      g.scale.setScalar(Math.max(0.001, appear * (1 - leave)));
      g.rotation.y = (1 - appear) * 2;
    });
  });

  if (!show) return null;
  return (
    <group key={eventId}>
      {kinds.map((k, i) => (
        <group key={i} ref={(el) => void (refs.current[i] = el)} scale={0.001}>
          <ShellModel kind={k} />
        </group>
      ))}
    </group>
  );
}

function SpentShells() {
  const spent = useGame((s) => s.game.spent);
  return (
    <group position={[0.78, 0.011, -0.05]}>
      {spent.map((k, i) => (
        <group key={i} position={[(i % 4) * 0.04, 0, Math.floor(i / 4) * 0.06 + (i % 2) * 0.01]} rotation={[0, 0.4 + ((i * 53) % 90) / 60, Math.PI / 2]}>
          <group position={[0, -0.035, 0]}>
            <ShellModel kind={k} />
          </group>
        </group>
      ))}
    </group>
  );
}

function DeskItem({ id, position, onUse, usable }: { id: ItemId; position: [number, number, number]; onUse?: () => void; usable?: boolean }) {
  const g = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  useFrame((state, dt) => {
    if (!g.current) return;
    const lift = hover && usable ? 0.03 + Math.sin(state.clock.elapsedTime * 5) * 0.004 : 0;
    g.current.position.y = THREE.MathUtils.damp(g.current.position.y, position[1] + lift, 10, dt);
    const sc = hover && usable ? 1.18 : 1;
    g.current.scale.setScalar(THREE.MathUtils.damp(g.current.scale.x, sc, 10, dt));
  });
  useEffect(() => {
    if (!onUse) return;
    document.body.style.cursor = hover && usable ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover, usable, onUse]);
  return (
    <group
      ref={g}
      position={position}
      onPointerOver={onUse ? (e) => (e.stopPropagation(), setHover(true)) : undefined}
      onPointerOut={onUse ? () => setHover(false) : undefined}
      onClick={onUse ? (e) => (e.stopPropagation(), usable && onUse()) : undefined}
    >
      <ItemModel id={id} />
    </group>
  );
}

function DeskItems() {
  const game = useGame((s) => s.game);
  const busy = useGame((s) => s.busy);
  const tutorial = useGame((s) => s.tutorial);
  const dispatch = useGame((s) => s.dispatch);
  const myTurn = game.phase === "turn" && game.turn === "player" && !busy && tutorial === null;
  const row = (n: number, i: number) => (i - (n - 1) / 2) * 0.14;
  return (
    <>
      {game.items.recruiter.map((id, i) => (
        <DeskItem key={`r-${id}-${i}`} id={id} position={[row(game.items.recruiter.length, i), 0, -0.3]} />
      ))}
      {game.items.player.map((id, i) => (
        <DeskItem
          key={`p-${id}-${i}`}
          id={id}
          position={[row(game.items.player.length, i), 0.006, 0.42]}
          usable={myTurn && canUseItem(game, "player", i)}
          onUse={() => dispatch({ type: "useItem", side: "player", slot: i })}
        />
      ))}
    </>
  );
}

/** The item being used floats up from its owner's side and fades out. */
function ItemUseFx() {
  const event = useGame((s) => s.game.event);
  const eventId = useGame((s) => s.game.eventId);
  const elapsed = useEventClock();
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current || event?.kind !== "item") return;
    const t = clamp01(elapsed() / (TIMING.item / 1000));
    const z0 = event.side === "player" ? 0.42 : -0.3;
    g.current.position.set(0, 0.02 + ease(t) * 0.28, THREE.MathUtils.lerp(z0, 0.05, ease(t)));
    g.current.rotation.y = t * Math.PI * 1.5;
    g.current.scale.setScalar(t < 0.75 ? 1 + t * 0.8 : Math.max(0.001, (1 - t) * 4 * 1.6));
  });
  if (event?.kind !== "item") return null;
  return (
    <group key={eventId} ref={g}>
      <ItemModel id={event.item} />
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050607"]} />
      <fog attach="fog" args={["#050607", 3.2, 7.5]} />
      <CameraRig />
      <Lights />
      <Room />
      <Desk />
      <RecruiterRig />
      <GunRig />
      <LoadReveal />
      <SpentShells />
      <DeskItems />
      <ItemUseFx />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.7} luminanceThreshold={0.75} luminanceSmoothing={0.2} mipmapBlur />
        <Noise opacity={0.035} />
        <Vignette offset={0.28} darkness={0.75} />
      </EffectComposer>
    </>
  );
}

export default function GameScene3D() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 48, near: 0.03, far: 20, position: [0, 0.7, 1.6] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
