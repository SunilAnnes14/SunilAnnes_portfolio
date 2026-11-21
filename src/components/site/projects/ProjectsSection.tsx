"use client";

import { useState } from "react";
import { LayoutGroup, MotionConfig } from "motion/react";
import type { ProjectHighlight } from "@/content/projectHighlights";
import { ProjectCard } from "./ProjectCard";
import { ReaderToggle } from "./ReaderToggle";
import { useReader } from "./readerPreference";

/** Project highlights: reader toggle, interactive cards (one open at a time), link to the rest. */
export function ProjectsSection({ projects, moreUrl }: { projects: ProjectHighlight[]; moreUrl: string }) {
  const [reader, setReader] = useReader();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    // "user": visitors who prefer reduced motion get fades only, with no movement or layout animation.
    <MotionConfig reducedMotion="user">
      <ReaderToggle value={reader} onChange={setReader} />
      <LayoutGroup>
        {/* items-start: opening one card doesn't stretch its neighbour */}
        <ul className="mt-6 grid items-start gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              reader={reader}
              open={openId === p.id}
              onToggle={() => setOpenId((cur) => (cur === p.id ? null : p.id))}
            />
          ))}
        </ul>
      </LayoutGroup>
      <a
        href={moreUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-block text-sm text-stone-400 underline-offset-4 hover:text-stone-100 hover:underline"
      >
        More projects on GitHub →
      </a>
    </MotionConfig>
  );
}
