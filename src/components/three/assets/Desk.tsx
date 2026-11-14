"use client";

import { useEffect, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { canvasTexture, fontFamily, woodTexture } from "./canvas";

/** Office desk. Top surface at y=0, spans x -1.2..1.2 and z -0.65..0.65. */
export function Desk() {
  const wood = useMemo(() => {
    const t = woodTexture();
    t.repeat.set(2, 1);
    return t;
  }, []);
  const plate = useMemo(
    () =>
      canvasTexture(512, 128, (ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#e2bd62");
        g.addColorStop(0.5, "#b88a30");
        g.addColorStop(1, "#7d5e22");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#5a4214";
        ctx.lineWidth = 6;
        ctx.strokeRect(6, 6, w - 12, h - 12);
        ctx.fillStyle = "#2a1e08";
        ctx.textAlign = "center";
        ctx.font = `bold 46px ${fontFamily("--font-display-face", "serif")}`;
        ctx.fillText("THE RECRUITER", w / 2, 66);
        ctx.font = `26px ${fontFamily("--font-display-face", "serif")}`;
        ctx.fillText("Talent Acquisition", w / 2, 104);
      }),
    [],
  );
  useEffect(
    () => () => {
      wood.dispose();
      plate.dispose();
    },
    [wood, plate],
  );

  return (
    <group>
      {/* top */}
      <RoundedBox args={[2.4, 0.05, 1.3]} radius={0.018} smoothness={3} position={[0, -0.025, 0]} castShadow receiveShadow>
        <meshStandardMaterial map={wood} color="#8a6448" roughness={0.5} metalness={0.05} />
      </RoundedBox>
      {/* side panels and modesty panel down to the floor */}
      {[-1.12, 1.12].map((x) => (
        <mesh key={x} position={[x, -0.405, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.71, 1.2]} />
          <meshStandardMaterial map={wood} color="#5a3d28" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, -0.36, -0.55]} receiveShadow>
        <boxGeometry args={[2.2, 0.6, 0.03]} />
        <meshStandardMaterial map={wood} color="#4e3423" roughness={0.65} />
      </mesh>
      {/* front lip */}
      <mesh position={[0, -0.075, 0.63]} castShadow>
        <boxGeometry args={[2.3, 0.05, 0.03]} />
        <meshStandardMaterial map={wood} color="#5e3f29" roughness={0.6} />
      </mesh>

      {/* leather desk mat */}
      <RoundedBox args={[1.3, 0.006, 0.7]} radius={0.003} smoothness={2} position={[0, 0.003, 0.05]} receiveShadow>
        <meshStandardMaterial color="#1d3a2b" roughness={0.85} />
      </RoundedBox>
      <mesh position={[0, 0.0062, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.26, 0.66]} />
        <meshStandardMaterial color="#17301f" roughness={0.95} transparent opacity={0.5} />
      </mesh>

      {/* nameplate, facing the visitor */}
      <group position={[-0.75, 0, -0.5]} rotation={[0, 0.12, 0]}>
        <mesh position={[0, 0.012, 0]} castShadow>
          <boxGeometry args={[0.3, 0.024, 0.07]} />
          <meshStandardMaterial color="#1a120b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.045, 0.006]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.28, 0.06, 0.006]} />
          <meshStandardMaterial color="#b88a30" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.045, 0.0095]} rotation={[-0.35, 0, 0]}>
          <planeGeometry args={[0.275, 0.058]} />
          <meshStandardMaterial map={plate} metalness={0.6} roughness={0.35} />
        </mesh>
      </group>

      {/* coffee ring */}
      <mesh position={[-0.88, 0.0012, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.032, 0.038, 40]} />
        <meshBasicMaterial color="#1c1009" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}
