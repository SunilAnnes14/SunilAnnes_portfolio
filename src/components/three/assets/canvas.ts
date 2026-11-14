"use client";

import * as THREE from "three";

/** Draws into an offscreen canvas and wraps it as an sRGB texture. */
export function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Redraw an existing canvas texture in place. */
export function redraw(tex: THREE.CanvasTexture, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const canvas = tex.image as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(ctx, canvas.width, canvas.height);
  tex.needsUpdate = true;
}

/** Font families registered by next/font in the root layout (fall back to generic families). */
export function fontFamily(variable: "--font-vt" | "--font-display-face" | "--font-mono-ui", fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

/** Cheap wood grain for desk surfaces. */
export function woodTexture(base = "#4a2d18") {
  const tex = canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 140; i++) {
      const y = rnd() * h;
      ctx.strokeStyle = rnd() > 0.5 ? "rgba(0,0,0,0.18)" : "rgba(255,210,160,0.06)";
      ctx.lineWidth = 1 + rnd() * 3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 32) ctx.lineTo(x, y + Math.sin(x / 70 + i) * 4 + (rnd() - 0.5) * 3);
      ctx.stroke();
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
