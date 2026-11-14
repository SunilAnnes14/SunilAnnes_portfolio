"use client";

const HULL = { live: "#b3261e", blank: "#4a6a94", unknown: "#2f3136" } as const;

/** Upright shotgun shell: 0.07 tall, radius 0.011, base at y=0. */
export function ShellModel({ kind }: { kind: "live" | "blank" | "unknown" }) {
  return (
    <group>
      <mesh position={[0, 0.0015, 0]} castShadow>
        <cylinderGeometry args={[0.0125, 0.0125, 0.003, 20]} />
        <meshStandardMaterial color="#b88a30" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.0105, 0]} castShadow>
        <cylinderGeometry args={[0.0115, 0.0115, 0.015, 20]} />
        <meshStandardMaterial color="#d4a845" metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.0435, 0]} castShadow>
        <cylinderGeometry args={[0.011, 0.011, 0.051, 20]} />
        <meshPhysicalMaterial color={HULL[kind]} roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      {/* crimped top */}
      <mesh position={[0, 0.0695, 0]}>
        <cylinderGeometry args={[0.008, 0.0108, 0.002, 12]} />
        <meshStandardMaterial color={HULL[kind]} roughness={0.6} />
      </mesh>
    </group>
  );
}
