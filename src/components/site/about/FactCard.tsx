import type { AboutFact } from "@/content/about";

/** One short fact: a small label and a single line. */
export function FactCard({ fact }: { fact: AboutFact }) {
  return (
    <div className="h-full rounded-lg border border-stone-800 bg-[#0d0e10] p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-300/90">{fact.label}</p>
      <p className="mt-2 text-base leading-relaxed text-stone-200">{fact.text}</p>
    </div>
  );
}
