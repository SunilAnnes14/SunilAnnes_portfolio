import type { ItemId, Shell } from "@/game/types";

const HULL: Record<Shell | "unknown", string> = {
  live: "#b3261e",
  blank: "#4a6a94",
  unknown: "#2f3136",
};

/** Upright shotgun shell. */
export function ShellGlyph({
  kind,
  className,
  dim = false,
}: {
  kind: Shell | "unknown";
  className?: string;
  dim?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 56"
      className={className}
      aria-hidden
      style={{ opacity: dim ? 0.35 : 1 }}
    >
      <defs>
        <linearGradient id="brass" x1="0" x2="1">
          <stop offset="0" stopColor="#7a5a1e" />
          <stop offset="0.45" stopColor="#e9c46a" />
          <stop offset="1" stopColor="#8a6424" />
        </linearGradient>
        <linearGradient id={`hull-${kind}`} x1="0" x2="1">
          <stop offset="0" stopColor={HULL[kind]} stopOpacity="0.7" />
          <stop offset="0.4" stopColor={HULL[kind]} />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect x="3" y="1" width="18" height="40" rx="3" fill={`url(#hull-${kind})`} />
      <rect x="3" y="1" width="18" height="40" rx="3" fill="none" stroke="#000" strokeOpacity="0.4" />
      <rect x="2" y="38" width="20" height="16" rx="1.5" fill="url(#brass)" />
      <rect x="1" y="51" width="22" height="4" rx="1" fill="#a07a2c" />
      {kind === "unknown" && (
        <text x="12" y="27" textAnchor="middle" fontSize="16" fill="#8b8f98" fontFamily="monospace">
          ?
        </text>
      )}
    </svg>
  );
}

const ICON_PATHS: Record<ItemId, React.ReactNode> = {
  debugger: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path d="M14.5 14.5 21 21" />
      <path d="M10 7v6M7 10h6" />
    </>
  ),
  stackTrace: (
    <>
      <path d="M4 5h16" />
      <path d="M7 10h13" />
      <path d="M10 15h10" />
      <path d="M13 20h7" />
    </>
  ),
  hotfix: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)" />
      <path d="M10 12h4M12 10v4" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" />
      <path d="M16 11h2a2.5 2.5 0 0 1 0 5h-2" />
      <path d="M8 3c0 2 2 2 2 4M12 3c0 2 2 2 2 4" />
    </>
  ),
  mergeConflict: (
    <>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="9" r="2" />
      <path d="M6 7v10M18 11c0 4-6 3-11 7" />
      <path d="m14 17 5 4M19 17l-5 4" />
    </>
  ),
  refactor: (
    <>
      <path d="M20 8a8 8 0 0 0-14-2L4 8" />
      <path d="M4 3v5h5" />
      <path d="M4 16a8 8 0 0 0 14 2l2-2" />
      <path d="M20 21v-5h-5" />
    </>
  ),
  prodDeploy: (
    <>
      <path d="M13 2 5 13h6l-1 9 8-11h-6Z" />
    </>
  ),
};

export function ItemIcon({ id, className }: { id: ItemId; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICON_PATHS[id]}
    </svg>
  );
}
