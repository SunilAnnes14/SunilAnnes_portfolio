"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { canvasTexture, fontFamily } from "./canvas";

export const LAMP_BULB_POSITION: [number, number, number] = [0, 1.14, -0.2];
export const WINDOW_POSITION: [number, number, number] = [-1.6, 1.0, -2.15];

const FLOOR_Y = -0.76;
const WALL_Z = -2.2;

function Window() {
  const city = useMemo(
    () =>
      canvasTexture(512, 420, (ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#0b1422");
        g.addColorStop(0.6, "#1b2c44");
        g.addColorStop(1, "#3a3550");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        let seed = 11;
        const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
        // skyline
        for (let i = 0; i < 16; i++) {
          const bw = 20 + rnd() * 50;
          const bx = rnd() * w;
          const bh = 80 + rnd() * 220;
          ctx.fillStyle = "#070b12";
          ctx.fillRect(bx, h - bh, bw, bh);
          for (let y = h - bh + 8; y < h - 6; y += 12) {
            for (let x = bx + 4; x < bx + bw - 4; x += 9) {
              if (rnd() > 0.72) {
                ctx.fillStyle = rnd() > 0.3 ? "rgba(255,210,130,0.9)" : "rgba(150,210,255,0.8)";
                ctx.fillRect(x, y, 4, 5);
              }
            }
          }
        }
      }),
    [],
  );
  useEffect(() => () => city.dispose(), [city]);

  const slats = Array.from({ length: 15 }, (_, i) => i);
  return (
    <group position={[WINDOW_POSITION[0], WINDOW_POSITION[1], WALL_Z]}>
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[1.1, 0.9]} />
        <meshBasicMaterial map={city} toneMapped={false} />
      </mesh>
      {/* frame */}
      {[
        [0, 0.47, 1.2, 0.05],
        [0, -0.47, 1.2, 0.05],
        [-0.575, 0, 0.05, 0.99],
        [0.575, 0, 0.05, 0.99],
        [0, 0, 0.025, 0.9],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.03]} castShadow>
          <boxGeometry args={[w, h, 0.05]} />
          <meshStandardMaterial color="#1d2125" roughness={0.7} />
        </mesh>
      ))}
      {/* blinds */}
      {slats.map((i) => (
        <mesh key={i} position={[0, 0.42 - i * 0.058, 0.07]} rotation={[0.9, 0, 0]} castShadow>
          <boxGeometry args={[1.1, 0.045, 0.004]} />
          <meshStandardMaterial color="#3a4048" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
      {/* blind cords */}
      <mesh position={[0.5, -0.1, 0.08]}>
        <cylinderGeometry args={[0.002, 0.002, 0.9]} />
        <meshStandardMaterial color="#c9c2ae" />
      </mesh>
    </group>
  );
}

function Poster() {
  const tex = useMemo(
    () =>
      canvasTexture(320, 440, (ctx, w, h) => {
        ctx.fillStyle = "#0b0c0e";
        ctx.fillRect(0, 0, w, h);
        const g = ctx.createLinearGradient(0, 30, w, 320);
        g.addColorStop(0, "#2b3a2f");
        g.addColorStop(1, "#0f1512");
        ctx.fillStyle = g;
        ctx.fillRect(24, 24, w - 48, 300);
        ctx.fillStyle = "#101814";
        ctx.beginPath();
        ctx.ellipse(w / 2, 324, 110, 140, 0, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = "rgba(201,162,39,0.75)";
        ctx.beginPath();
        ctx.arc(110, 110, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#d6d0c4";
        ctx.textAlign = "center";
        ctx.font = `44px ${fontFamily("--font-display-face", "serif")}`;
        ctx.fillText("S Y N E R G Y", w / 2, 380);
        ctx.fillStyle = "#857f73";
        ctx.font = `15px ${fontFamily("--font-mono-ui", "monospace")}`;
        ctx.fillText("WE'RE A FAMILY HERE", w / 2, 414);
      }),
    [],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <group position={[1.55, 1.1, WALL_Z]}>
      <mesh position={[0, 0, 0.015]} castShadow>
        <boxGeometry args={[0.62, 0.84, 0.03]} />
        <meshStandardMaterial color="#24282c" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[0.56, 0.77]} />
        <meshStandardMaterial map={tex} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Clock() {
  const hour = useRef<THREE.Group>(null);
  const minute = useRef<THREE.Group>(null);
  const second = useRef<THREE.Group>(null);
  const face = useMemo(
    () =>
      canvasTexture(256, 256, (ctx, w) => {
        ctx.fillStyle = "#d9d4c5";
        ctx.beginPath();
        ctx.arc(w / 2, w / 2, w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1a1a1a";
        for (let i = 0; i < 60; i++) {
          const a = (i / 60) * Math.PI * 2;
          const len = i % 5 === 0 ? 18 : 7;
          const r = w / 2 - 12;
          ctx.save();
          ctx.translate(w / 2 + Math.sin(a) * r, w / 2 - Math.cos(a) * r);
          ctx.rotate(a);
          ctx.fillRect(-(i % 5 === 0 ? 3 : 1), 0, i % 5 === 0 ? 6 : 2, len);
          ctx.restore();
        }
      }),
    [],
  );
  useEffect(() => () => face.dispose(), [face]);
  useFrame(() => {
    const d = new Date();
    const s = d.getSeconds();
    const m = d.getMinutes() + s / 60;
    const h = (d.getHours() % 12) + m / 60;
    if (second.current) second.current.rotation.z = -(s / 60) * Math.PI * 2;
    if (minute.current) minute.current.rotation.z = -(m / 60) * Math.PI * 2;
    if (hour.current) hour.current.rotation.z = -(h / 12) * Math.PI * 2;
  });
  return (
    <group position={[0.72, 1.62, WALL_Z + 0.03]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.04, 40]} />
        <meshStandardMaterial color="#2a2e33" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.021]}>
        <circleGeometry args={[0.15, 40]} />
        <meshStandardMaterial map={face} roughness={0.6} />
      </mesh>
      <group ref={hour} position={[0, 0, 0.024]}>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.012, 0.08, 0.003]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
      <group ref={minute} position={[0, 0, 0.027]}>
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.008, 0.12, 0.003]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
      <group ref={second} position={[0, 0, 0.03]}>
        <mesh position={[0, 0.055, 0]}>
          <boxGeometry args={[0.003, 0.13, 0.002]} />
          <meshStandardMaterial color="#8b1e1e" />
        </mesh>
      </group>
    </group>
  );
}

function FilingCabinet() {
  return (
    <group position={[2.35, FLOOR_Y, -1.85]} rotation={[0, -0.25, 0]}>
      <RoundedBox args={[0.5, 1.3, 0.6]} radius={0.015} position={[0, 0.65, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#3b4045" roughness={0.45} metalness={0.55} />
      </RoundedBox>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[0, 0.17 + i * 0.31, 0.301]}>
          <mesh>
            <boxGeometry args={[0.46, 0.28, 0.005]} />
            <meshStandardMaterial color="#454b51" roughness={0.4} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.06, 0.012]}>
            <boxGeometry args={[0.12, 0.018, 0.02]} />
            <meshStandardMaterial color="#9aa0a6" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.1, 0.004]}>
            <planeGeometry args={[0.08, 0.035]} />
            <meshStandardMaterial color="#d9d4c5" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Plant() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => {
        const a = (i / 11) * Math.PI * 2;
        const tilt = 0.35 + (i % 3) * 0.18;
        return { a, tilt, len: 0.4 + (i % 4) * 0.08 };
      }),
    [],
  );
  return (
    <group position={[-2.35, FLOOR_Y, -1.75]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.13, 0.4, 24]} />
        <meshStandardMaterial color="#2c2622" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.39, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 24]} />
        <meshStandardMaterial color="#1a120c" roughness={1} />
      </mesh>
      {leaves.map(({ a, tilt, len }, i) => (
        <group key={i} position={[0, 0.4, 0]} rotation={[0, a, 0]}>
          <mesh position={[0, len / 2, 0]} rotation={[tilt, 0, 0]} castShadow>
            <coneGeometry args={[0.045, len, 4]} />
            <meshStandardMaterial color={i % 2 ? "#1f3b22" : "#2a4d2c"} roughness={0.7} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Lamp() {
  const [x, y, z] = LAMP_BULB_POSITION;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, (2.2 + y + 0.15) / 2, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 2.2 - y - 0.15]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, y + 0.165, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.05, 16]} />
        <meshStandardMaterial color="#1c1f23" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* shade: open cone, bottom rim at y=0.95 */}
      <mesh position={[0, y + 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.22, 0.18, 40, 1, true]} />
        <meshStandardMaterial color="#2f343a" metalness={0.65} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, y - 0.03, 0]}>
        <torusGeometry args={[0.22, 0.006, 8, 48]} />
        <meshStandardMaterial color="#1c1f23" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, y, 0]}>
        <sphereGeometry args={[0.045, 24, 16]} />
        <meshStandardMaterial color="#ffe7b0" emissive="#ffd28a" emissiveIntensity={6} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** The office around the desk: floor, walls, window, poster, clock, cabinet, plant, lamp. No lights. */
export function Room() {
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, -0.5]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#17130f" roughness={1} />
      </mesh>
      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.2, -0.5]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#0c0d0f" roughness={1} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, (FLOOR_Y + 2.2) / 2, WALL_Z]} receiveShadow>
        <planeGeometry args={[6.2, 2.96]} />
        <meshStandardMaterial color="#1c2228" roughness={0.9} />
      </mesh>
      {/* side walls */}
      {[-3, 3].map((x) => (
        <mesh key={x} position={[x, (FLOOR_Y + 2.2) / 2, 0.3]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[5, 2.96]} />
          <meshStandardMaterial color="#181d22" roughness={0.9} />
        </mesh>
      ))}
      {/* wainscoting */}
      <mesh position={[0, FLOOR_Y + 0.45, WALL_Z + 0.015]} receiveShadow>
        <boxGeometry args={[6.2, 0.9, 0.03]} />
        <meshStandardMaterial color="#121518" roughness={0.8} />
      </mesh>
      <mesh position={[0, FLOOR_Y + 0.91, WALL_Z + 0.03]}>
        <boxGeometry args={[6.2, 0.03, 0.04]} />
        <meshStandardMaterial color="#262b30" roughness={0.6} />
      </mesh>
      {Array.from({ length: 13 }, (_, i) => (
        <mesh key={i} position={[-3 + i * 0.5, FLOOR_Y + 0.45, WALL_Z + 0.032]}>
          <boxGeometry args={[0.012, 0.86, 0.006]} />
          <meshStandardMaterial color="#0b0d0f" />
        </mesh>
      ))}

      <Window />
      <Poster />
      <Clock />
      <FilingCabinet />
      <Plant />
      <Lamp />
    </group>
  );
}
