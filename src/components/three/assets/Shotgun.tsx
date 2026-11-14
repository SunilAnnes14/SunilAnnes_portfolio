"use client";

import { useEffect, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { canvasTexture, woodTexture } from "./canvas";

/** Local position of the muzzle tip. The gun lies along +x. */
export const SHOTGUN_MUZZLE: [number, number, number] = [0.5, 0.035, 0];

const BLUED = { color: "#2a2f35", metalness: 0.85, roughness: 0.32 } as const;

/** Pump-action shotgun, ~0.95 long, origin at the balance point, lowest point at y≈-0.03. */
export function Shotgun({ sticker = false }: { sticker?: boolean }) {
  const wood = useMemo(() => {
    const t = woodTexture("#6a4022");
    t.repeat.set(3, 3);
    return t;
  }, []);
  const label = useMemo(
    () =>
      canvasTexture(256, 96, (ctx, w, h) => {
        ctx.fillStyle = "#e3b62a";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#1a1a1a";
        ctx.font = "bold 58px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("x2 DMG", w / 2, h / 2 + 3);
      }),
    [],
  );
  useEffect(
    () => () => {
      wood.dispose();
      label.dispose();
    },
    [wood, label],
  );

  const stock = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.45, -0.03);
    s.lineTo(-0.45, 0.048);
    s.quadraticCurveTo(-0.3, 0.046, -0.15, 0.04);
    s.lineTo(-0.12, 0.04);
    s.lineTo(-0.12, 0.002);
    s.quadraticCurveTo(-0.15, -0.002, -0.17, -0.03);
    s.quadraticCurveTo(-0.19, -0.045, -0.205, -0.03);
    s.quadraticCurveTo(-0.3, -0.012, -0.45, -0.03);
    return new THREE.ExtrudeGeometry(s, { depth: 0.034, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 2, curveSegments: 10 });
  }, []);
  useEffect(() => () => stock.dispose(), [stock]);

  return (
    <group>
      {/* stock */}
      <mesh geometry={stock} position={[0, 0, -0.017]} castShadow receiveShadow>
        <meshStandardMaterial map={wood} color="#a0704a" roughness={0.45} />
      </mesh>
      {/* butt pad */}
      <mesh position={[-0.453, 0.009, 0]} castShadow>
        <boxGeometry args={[0.012, 0.08, 0.038]} />
        <meshStandardMaterial color="#141414" roughness={0.9} />
      </mesh>
      {/* receiver */}
      <RoundedBox args={[0.16, 0.052, 0.036]} radius={0.008} smoothness={3} position={[-0.045, 0.024, 0]} castShadow>
        <meshStandardMaterial {...BLUED} />
      </RoundedBox>
      <mesh position={[-0.04, 0.036, 0.0185]}>
        <boxGeometry args={[0.06, 0.012, 0.002]} />
        <meshStandardMaterial color="#0b0c0e" />
      </mesh>
      {/* trigger guard + trigger */}
      <mesh position={[-0.075, -0.004, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.02, 0.0032, 8, 20, Math.PI]} />
        <meshStandardMaterial {...BLUED} />
      </mesh>
      <mesh position={[-0.072, 0.0, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.004, 0.02, 0.004]} />
        <meshStandardMaterial {...BLUED} />
      </mesh>
      {/* barrel */}
      <mesh position={[0.22, 0.036, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.011, 0.011, 0.56, 20]} />
        <meshStandardMaterial {...BLUED} />
      </mesh>
      <mesh position={[0.5, 0.036, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.0075, 0.0075, 0.002, 16]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
      {/* magazine tube */}
      <mesh position={[0.17, 0.012, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.0095, 0.0095, 0.42, 16]} />
        <meshStandardMaterial {...BLUED} color="#23272c" />
      </mesh>
      {/* pump */}
      <mesh position={[0.13, 0.014, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.0175, 0.0175, 0.16, 20]} />
        <meshStandardMaterial map={wood} color="#a0704a" roughness={0.5} />
      </mesh>
      {[0.07, 0.09, 0.11, 0.13, 0.15, 0.17, 0.19].map((x) => (
        <mesh key={x} position={[x, 0.014, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.0176, 0.0016, 6, 20]} />
          <meshStandardMaterial color="#3e2412" roughness={0.8} />
        </mesh>
      ))}
      {/* barrel band + bead sight */}
      <mesh position={[0.46, 0.026, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.014, 0.014, 0.012, 16]} />
        <meshStandardMaterial {...BLUED} />
      </mesh>
      <mesh position={[0.494, 0.049, 0]}>
        <sphereGeometry args={[0.003, 10, 8]} />
        <meshStandardMaterial color="#e6dfc8" metalness={0.6} roughness={0.3} />
      </mesh>
      {sticker && (
        <mesh position={[0.33, 0.0475, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.07, 0.024]} />
          <meshStandardMaterial map={label} roughness={0.6} polygonOffset polygonOffsetFactor={-1} />
        </mesh>
      )}
    </group>
  );
}
