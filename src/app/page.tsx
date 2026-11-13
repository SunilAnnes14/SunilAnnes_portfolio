import GameRoot from "@/components/game/GameRoot";
import { profile } from "@/content/portfolio";

export default function Home() {
  return (
    <>
      <GameRoot />
      {/* Plain-text summary for crawlers and screen readers; the full version lives at /resume. */}
      <div className="sr-only">
        <h1>
          {profile.name}, {profile.role}
        </h1>
        <p>{profile.summary}</p>
        <a href="/resume">Read the full portfolio without playing</a>
      </div>
    </>
  );
}
