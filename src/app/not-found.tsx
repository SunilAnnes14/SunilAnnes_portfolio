import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#08090a] px-4 text-center text-stone-200">
      <div>
        <p className="font-display text-7xl text-amber-200/90">404</p>
        <h1 className="mt-4 font-display text-3xl text-stone-50">This position has been filled.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-400">
          The page you&apos;re looking for doesn&apos;t exist. The Recruiter is still taking interviews, though.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-md border border-stone-600 px-5 py-2.5 text-sm uppercase tracking-[0.2em] text-stone-200 transition hover:bg-white/5"
          >
            Portfolio
          </Link>
          <Link
            href="/interview"
            className="rounded-md border border-red-400/40 bg-gradient-to-b from-[#5a1a16] to-[#2a0b09] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-red-100 transition hover:brightness-125"
          >
            Play the interview
          </Link>
        </div>
      </div>
    </main>
  );
}
