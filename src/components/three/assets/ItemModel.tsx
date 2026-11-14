"use client";

import { useEffect, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { ItemId } from "@/game/types";
import { canvasTexture } from "./canvas";

export const ITEM_COLORS: Record<ItemId, string> = {
  debugger: "#7dffb0",
  stackTrace: "#e9e4d6",
  hotfix: "#e0614f",
  coffee: "#c98a4b",
  mergeConflict: "#a78bfa",
  refactor: "#5ec8e5",
  prodDeploy: "#e3b62a",
};

function Debugger() {
  return (
    <group>
      {/* the bug */}
      <mesh position={[0.02, 0.012, 0.02]} scale={[1, 0.55, 1.25]} castShadow>
        <sphereGeometry args={[0.022, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2f8f55" roughness={0.35} />
      </mesh>
      <mesh position={[0.02, 0.006, -0.008]} castShadow>
        <sphereGeometry args={[0.009, 12, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* magnifier */}
      <group position={[-0.008, 0.01, -0.005]} rotation={[0, 0.6, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.03, 0.005, 10, 32]} />
          <meshStandardMaterial color="#c9c2ae" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.029, 0.029, 0.002, 32]} />
          <meshPhysicalMaterial color="#cfe9ff" transparent opacity={0.3} roughness={0} transmission={0.6} />
        </mesh>
        <mesh position={[-0.055, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.006, 0.007, 0.05, 12]} />
          <meshStandardMaterial color="#1b1d20" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function StackTrace() {
  const tex = useMemo(
    () =>
      canvasTexture(128, 160, (ctx, w, h) => {
        ctx.fillStyle = "#ece7da";
        ctx.fillRect(0, 0, w, h);
        for (let y = 0; y < h; y += 20) {
          ctx.fillStyle = "rgba(120,180,140,0.25)";
          ctx.fillRect(0, y, w, 10);
        }
        ctx.fillStyle = "#555";
        for (let y = 8; y < h - 6; y += 9) ctx.fillRect(12 + ((y * 7) % 20), y, 40 + ((y * 13) % 60), 3);
        ctx.fillStyle = "#b3261e";
        ctx.fillRect(12, 64, 90, 4);
      }),
    [],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <group rotation={[0, 0.2, 0]}>
      <mesh position={[0, 0.006, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.085, 0.012, 0.105]} />
        <meshStandardMaterial color="#ddd8ca" roughness={0.9} />
      </mesh>
      <mesh position={[0.004, 0.0125, 0.002]} rotation={[-Math.PI / 2, 0, 0.06]}>
        <planeGeometry args={[0.085, 0.105]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
      <mesh position={[0.01, 0.022, -0.04]} rotation={[-Math.PI / 2 + 0.5, 0, 0.06]} castShadow>
        <planeGeometry args={[0.085, 0.04]} />
        <meshStandardMaterial map={tex} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Hotfix() {
  return (
    <group>
      <RoundedBox args={[0.095, 0.022, 0.065]} radius={0.006} smoothness={2} position={[0, 0.011, 0]} castShadow>
        <meshStandardMaterial color="#d8d3c8" metalness={0.5} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.0225, 0]}>
        <boxGeometry args={[0.03, 0.001, 0.008]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
      <mesh position={[0, 0.0225, 0]}>
        <boxGeometry args={[0.008, 0.001, 0.03]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
      <group position={[0.005, 0.026, 0.004]} rotation={[0, -0.5, 0]}>
        <RoundedBox args={[0.085, 0.003, 0.024]} radius={0.0015} smoothness={2} castShadow>
          <meshStandardMaterial color="#d9a77a" roughness={0.8} />
        </RoundedBox>
        <mesh position={[0, 0.002, 0]}>
          <boxGeometry args={[0.026, 0.002, 0.018]} />
          <meshStandardMaterial color="#f2ece0" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

function Coffee() {
  return (
    <group>
      <mesh position={[0, 0.032, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.027, 0.064, 28, 1, true]} />
        <meshStandardMaterial color="#e9e4d6" roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.002, 0]}>
        <cylinderGeometry args={[0.027, 0.027, 0.004, 28]} />
        <meshStandardMaterial color="#e9e4d6" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.054, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.002, 28]} />
        <meshStandardMaterial color="#2a160a" roughness={0.15} />
      </mesh>
      <mesh position={[0.033, 0.034, 0]} castShadow>
        <torusGeometry args={[0.014, 0.004, 8, 20, Math.PI * 1.3]} />
        <meshStandardMaterial color="#e9e4d6" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.03, 0.0285]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.03, 0.012, 0.001]} />
        <meshStandardMaterial color="#7a1a1a" />
      </mesh>
    </group>
  );
}

function MergeConflict() {
  const tex = useMemo(
    () =>
      canvasTexture(256, 160, (ctx, w, h) => {
        ctx.fillStyle = "#1d1830";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#a78bfa";
        ctx.lineWidth = 10;
        ctx.strokeRect(6, 6, w - 12, h - 12);
        ctx.fillStyle = "#e7ddff";
        ctx.font = "bold 46px monospace";
        ctx.textAlign = "center";
        ctx.fillText("<<<<<<<", w / 2, 66);
        ctx.fillStyle = "#ff8a7a";
        ctx.fillText(">>>>>>>", w / 2, 122);
      }),
    [],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <group>
      <mesh position={[0, 0.004, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, 0.008, 24]} />
        <meshStandardMaterial color="#1b1d20" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.035, 0]} castShadow>
        <cylinderGeometry args={[0.003, 0.003, 0.06, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
      </mesh>
      <group position={[0, 0.075, 0]} rotation={[-0.25, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.062, 0.005]} />
          <meshStandardMaterial color="#1d1830" />
        </mesh>
        <mesh position={[0, 0, 0.0027]}>
          <planeGeometry args={[0.098, 0.06]} />
          <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0.25} />
        </mesh>
      </group>
    </group>
  );
}

function Refactor() {
  return (
    <group>
      <mesh position={[-0.014, 0.022, 0]} rotation={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.026, 0.044, 0.044]} />
        <meshStandardMaterial color="#b3261e" roughness={0.4} />
      </mesh>
      <mesh position={[0.016, 0.022, 0.004]} rotation={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.026, 0.044, 0.044]} />
        <meshStandardMaterial color="#4a6a94" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.022, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.046, 0.003, 8, 40, Math.PI * 1.6]} />
        <meshStandardMaterial color="#5ec8e5" emissive="#5ec8e5" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.046, 0.022, -0.012]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.008, 0.016, 10]} />
        <meshStandardMaterial color="#5ec8e5" emissive="#5ec8e5" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function ProdDeploy() {
  return (
    <group>
      <RoundedBox args={[0.085, 0.024, 0.085]} radius={0.006} smoothness={2} position={[0, 0.012, 0]} castShadow>
        <meshStandardMaterial color="#e3b62a" roughness={0.45} />
      </RoundedBox>
      {/* hazard stripes */}
      {[-0.03, -0.01, 0.01, 0.03].map((x) => (
        <mesh key={x} position={[x, 0.012, 0.0428]} rotation={[0, 0, 0.6]}>
          <planeGeometry args={[0.008, 0.03]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      <mesh position={[0, 0.026, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.006, 28]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
      <mesh position={[0, 0.036, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.024, 0.016, 28]} />
        <meshPhysicalMaterial color="#d0201a" roughness={0.25} clearcoat={1} emissive="#5a0805" />
      </mesh>
    </group>
  );
}

const MODELS: Record<ItemId, () => React.ReactElement> = {
  debugger: Debugger,
  stackTrace: StackTrace,
  hotfix: Hotfix,
  coffee: Coffee,
  mergeConflict: MergeConflict,
  refactor: Refactor,
  prodDeploy: ProdDeploy,
};

/** Small desk prop for an item: footprint ~0.11 square, base at y=0. */
export function ItemModel({ id }: { id: ItemId }) {
  const Model = MODELS[id];
  return <Model />;
}
