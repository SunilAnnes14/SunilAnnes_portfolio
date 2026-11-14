"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { canvasTexture, fontFamily, redraw } from "./canvas";

export type FaceTone = "ok" | "hurt" | "glee";

const TONE_COLOR: Record<FaceTone, string> = { ok: "#7dffb0", hurt: "#ff6b5e", glee: "#ffd166" };
const SUIT = "#1c1f24";
const SKIN = "#c4a689";

const TORSO_Z = -0.95;

/** Cylinder spanning two points (arms). */
function Limb({ from, to, radius, color }: { from: [number, number, number]; to: [number, number, number]; radius: number; color: string }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { position: a.clone().add(b).multiplyScalar(0.5), quaternion: q, length: len };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <capsuleGeometry args={[radius, length, 6, 12]} />
      <meshStandardMaterial color={color} roughness={0.75} />
    </mesh>
  );
}

function drawFace(ctx: CanvasRenderingContext2D, w: number, h: number, face: string, tone: FaceTone) {
  const g = ctx.createRadialGradient(w / 2, h * 0.45, 10, w / 2, h / 2, w * 0.65);
  g.addColorStop(0, "#173826");
  g.addColorStop(1, "#030805");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const color = TONE_COLOR[tone];
  const size = face.length > 4 ? 120 : 190;
  ctx.font = `${size}px ${fontFamily("--font-vt", "monospace")}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = color;
  ctx.shadowBlur = 28;
  ctx.fillStyle = color;
  ctx.fillText(face, w / 2, h / 2 + 6);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 2);
  // vignette toward the curved glass edges
  const v = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, w * 0.62);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.75)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
}

function MonitorHead({ face, tone, thinking }: { face: string; tone: FaceTone; thinking: boolean }) {
  const head = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshStandardMaterial>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);
  const hurtUntil = useRef(0);
  const tex = useMemo(() => canvasTexture(512, 384, (ctx, w, h) => drawFace(ctx, w, h, ":|", "ok")), []);
  useEffect(() => () => tex.dispose(), [tex]);

  useEffect(() => {
    const paint = () => redraw(tex, (ctx, w, h) => drawFace(ctx, w, h, face, tone));
    paint();
    // Repaint once the pixel font has loaded.
    document.fonts?.ready.then(paint).catch(() => {});
    if (tone === "hurt") hurtUntil.current = performance.now() + 650;
  }, [face, tone, tex]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (head.current) {
      const target = thinking ? Math.sin(t * 1.8) * 0.07 : 0;
      head.current.rotation.z = THREE.MathUtils.damp(head.current.rotation.z, target, 4, dt);
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, thinking ? -0.05 : 0, 4, dt);
    }
    const hurt = performance.now() < hurtUntil.current;
    const map = screenMat.current?.map;
    if (map) map.offset.set(hurt ? (Math.random() - 0.5) * 0.04 : 0, hurt ? (Math.random() - 0.5) * 0.02 : 0);
    if (screenMat.current) screenMat.current.emissiveIntensity = hurt ? 0.6 + Math.random() * 1.6 : 1.35 + Math.sin(t * 9) * 0.04;
    if (led.current) led.current.emissiveIntensity = thinking ? 2 + Math.sin(t * 8) * 1.5 : 1.2;
  });

  return (
    <group ref={head} position={[0, 0.66, TORSO_Z]}>
      {/* bezel */}
      <RoundedBox args={[0.42, 0.36, 0.2]} radius={0.03} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#bdb59f" roughness={0.55} />
      </RoundedBox>
      {/* tapered back */}
      <RoundedBox args={[0.32, 0.27, 0.2]} radius={0.04} smoothness={3} position={[0, 0.005, -0.16]} castShadow>
        <meshStandardMaterial color="#a39b86" roughness={0.6} />
      </RoundedBox>
      {/* vents */}
      {[-0.08, -0.04, 0, 0.04, 0.08].map((x) => (
        <mesh key={x} position={[x, 0.142, -0.16]}>
          <boxGeometry args={[0.02, 0.003, 0.14]} />
          <meshStandardMaterial color="#5f594d" />
        </mesh>
      ))}
      {/* screen recess */}
      <mesh position={[0, 0.02, 0.1]}>
        <boxGeometry args={[0.35, 0.27, 0.01]} />
        <meshStandardMaterial color="#1a1a17" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.02, 0.107]}>
        <planeGeometry args={[0.33, 0.25]} />
        <meshStandardMaterial ref={screenMat} map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={1.35} roughness={0.15} metalness={0} toneMapped={false} />
      </mesh>
      {/* glass sheen */}
      <mesh position={[0, 0.02, 0.109]}>
        <planeGeometry args={[0.33, 0.25]} />
        <meshPhysicalMaterial transparent opacity={0.08} roughness={0.05} clearcoat={1} color="#ffffff" />
      </mesh>
      {/* control strip */}
      <mesh position={[-0.09, -0.155, 0.101]}>
        <boxGeometry args={[0.12, 0.012, 0.004]} />
        <meshStandardMaterial color="#6d675a" />
      </mesh>
      <mesh position={[0.165, -0.155, 0.102]}>
        <sphereGeometry args={[0.008, 12, 8]} />
        <meshStandardMaterial ref={led} color="#7dffb0" emissive="#7dffb0" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <mesh position={[0.135, -0.155, 0.101]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.008, 12]} />
        <meshStandardMaterial color="#5f594d" />
      </mesh>
    </group>
  );
}

/**
 * The Recruiter, seated behind the desk. Torso at z≈-0.95, hands resting on the desk top,
 * CRT monitor head with its screen centered at y≈0.66.
 */
export function Recruiter({ face, tone, thinking }: { face: string; tone: FaceTone; thinking: boolean }) {
  const lapel = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.09, 0);
    s.lineTo(0.02, -0.3);
    s.lineTo(-0.01, -0.2);
    s.closePath();
    return s;
  }, []);
  const tie = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.018, 0);
    s.lineTo(0.018, 0);
    s.lineTo(0.012, -0.03);
    s.lineTo(0.03, -0.26);
    s.lineTo(0, -0.3);
    s.lineTo(-0.03, -0.26);
    s.lineTo(-0.012, -0.03);
    s.closePath();
    return s;
  }, []);
  const shirt = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.1, 0);
    s.lineTo(0.1, 0);
    s.lineTo(0, -0.34);
    s.closePath();
    return s;
  }, []);

  const front = TORSO_Z + 0.152;

  return (
    <group>
      {/* torso */}
      <RoundedBox args={[0.52, 0.75, 0.3]} radius={0.09} smoothness={4} position={[0, 0.05, TORSO_Z]} castShadow receiveShadow>
        <meshStandardMaterial color={SUIT} roughness={0.8} />
      </RoundedBox>
      {/* shoulders */}
      <mesh position={[0, 0.36, TORSO_Z]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.1, 0.4, 6, 16]} />
        <meshStandardMaterial color={SUIT} roughness={0.8} />
      </mesh>
      {/* shirt, tie, lapels */}
      <mesh position={[0, 0.425, front]}>
        <shapeGeometry args={[shirt]} />
        <meshStandardMaterial color="#d8d3c8" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.41, front + 0.004]}>
        <extrudeGeometry args={[tie, { depth: 0.006, bevelEnabled: false }]} />
        <meshStandardMaterial color="#7a1a1a" roughness={0.55} />
      </mesh>
      <mesh position={[0.1, 0.425, front + 0.002]} rotation={[0, 0, 0]}>
        <extrudeGeometry args={[lapel, { depth: 0.008, bevelEnabled: false }]} />
        <meshStandardMaterial color="#15171b" roughness={0.75} />
      </mesh>
      <mesh position={[-0.1, 0.425, front + 0.002]} scale={[-1, 1, 1]}>
        <extrudeGeometry args={[lapel, { depth: 0.008, bevelEnabled: false }]} />
        <meshStandardMaterial color="#15171b" roughness={0.75} side={THREE.DoubleSide} />
      </mesh>
      {/* lanyard badge */}
      <group position={[0.16, 0.12, front + 0.01]} rotation={[0, 0, 0.06]}>
        <mesh>
          <boxGeometry args={[0.055, 0.075, 0.004]} />
          <meshStandardMaterial color="#e9e4d6" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.022, 0.003]}>
          <boxGeometry args={[0.04, 0.012, 0.002]} />
          <meshStandardMaterial color="#7a1a1a" />
        </mesh>
        <mesh position={[0, -0.01, 0.003]}>
          <boxGeometry args={[0.04, 0.005, 0.002]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      </group>
      {/* neck stand */}
      <mesh position={[0, 0.47, TORSO_Z]} castShadow>
        <cylinderGeometry args={[0.045, 0.07, 0.1, 20]} />
        <meshStandardMaterial color="#7b7466" roughness={0.6} />
      </mesh>

      {/* arms: shoulder -> elbow -> hand on desk */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <Limb from={[side * 0.3, 0.33, TORSO_Z]} to={[side * 0.34, 0.07, -0.72]} radius={0.055} color={SUIT} />
          <Limb from={[side * 0.34, 0.07, -0.72]} to={[side * 0.28, 0.035, -0.5]} radius={0.048} color={SUIT} />
          <mesh position={[side * 0.28, 0.033, -0.475]} rotation={[Math.PI / 2 - 0.15, 0, 0]}>
            <cylinderGeometry args={[0.043, 0.043, 0.018, 16]} />
            <meshStandardMaterial color="#8f897d" roughness={0.85} />
          </mesh>
          <RoundedBox args={[0.085, 0.035, 0.11]} radius={0.016} smoothness={3} position={[side * 0.27, 0.02, -0.41]} castShadow>
            <meshStandardMaterial color={SKIN} roughness={0.65} />
          </RoundedBox>
        </group>
      ))}

      <MonitorHead face={face} tone={tone} thinking={thinking} />
    </group>
  );
}
