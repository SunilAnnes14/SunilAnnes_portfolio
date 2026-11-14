import type { Metadata } from "next";
import Link from "next/link";
import GameRoot from "@/components/game/GameRoot";
import { profile } from "@/content/portfolio";

export const metadata: Metadata = {
  title: `The Interview · ${profile.name}`,
  description: "A portfolio you have to survive: a turn-based game of nerve against a hostile recruiter.",
};

export default function InterviewPage() {
  return (
    <>
      <GameRoot />
      <div className="sr-only">
        <h1>The Interview, a game by {profile.name}</h1>
        <Link href="/">Back to the portfolio</Link>
      </div>
    </>
  );
}
