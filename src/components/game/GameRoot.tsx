"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useGame } from "@/game/store";
import { AchievementToasts } from "./AchievementToasts";
import { Controls } from "./Controls";
import { Dossier } from "./Dossier";
import { Effects } from "./Effects";
import { Hud } from "./Hud";
import { Overlays } from "./Overlays";
import { QuizOverlay } from "./QuizOverlay";
import { RecruiterBubble } from "./RecruiterBubble";
import { Scene25D } from "./Scene25D";
import { Tutorial } from "./Tutorial";

const GameScene3D = dynamic(() => import("../three/GameScene3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-[#050607] text-xs uppercase tracking-[0.4em] text-stone-500">
      Setting up the office…
    </div>
  ),
});

/** Drives automatic steps: loading, reloading and the Recruiter's turn. */
function useDirector() {
  const phase = useGame((s) => s.game.phase);
  const turn = useGame((s) => s.game.turn);
  const busy = useGame((s) => s.busy);
  const eventId = useGame((s) => s.game.eventId);
  const tutorial = useGame((s) => s.tutorial);
  const quizOpen = useGame((s) => s.quiz !== null);
  useEffect(() => useGame.getState().scheduleNext(), [phase, turn, busy, eventId, tutorial, quizOpen]);
}

export default function GameRoot() {
  useDirector();
  const renderMode = useGame((s) => s.renderMode);
  const ready = useGame((s) => s.viewReady);

  // Read saved preferences once on the client: view, difficulty, achievements.
  useEffect(() => useGame.getState().initClient(), []);

  return (
    <main className="relative h-dvh w-full select-none overflow-clip bg-[#060708] text-stone-200">
      {ready && (renderMode === "3d" ? <GameScene3D /> : <Scene25D />)}
      <Hud />
      <RecruiterBubble />
      <Controls />
      <Effects />
      <Overlays />
      <QuizOverlay />
      <Tutorial />
      <Dossier />
      <AchievementToasts />
    </main>
  );
}
