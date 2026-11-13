/** The office behind the Recruiter: wall, blinds, poster, clock and the hanging lamp. */
export function Backdrop() {
  return (
    <div className="absolute inset-0" aria-hidden>
      {/* wall */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #121519 0%, #171b1f 45%, #0d0f11 62%, #060708 100%)",
        }}
      />
      {/* wainscoting */}
      <div
        className="absolute inset-x-0 top-[46%] h-[16%] opacity-60"
        style={{
          background:
            "repeating-linear-gradient(90deg, #15181b 0 118px, #0c0e10 118px 122px), linear-gradient(#1a1d20, #0b0c0e)",
          backgroundBlendMode: "multiply",
          borderTop: "3px solid #23282d",
        }}
      />

      {/* window with blinds */}
      <div className="absolute left-[6%] top-[8%] h-[30%] w-[20%] min-w-[120px] overflow-hidden rounded-[2px] border-[6px] border-[#1d2125] shadow-[0_0_80px_rgba(80,130,170,0.15)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b2a3a] via-[#142030] to-[#0b1118]" />
        {/* city lights */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-70 [background:radial-gradient(circle_at_20%_80%,#e9c46a_0_1px,transparent_2px),radial-gradient(circle_at_60%_70%,#e9c46a_0_1px,transparent_2px),radial-gradient(circle_at_80%_90%,#9ad1ff_0_1px,transparent_2px),radial-gradient(circle_at_35%_95%,#9ad1ff_0_1px,transparent_2px)] [background-size:40px_30px]" />
        <div className="absolute inset-0 [background:repeating-linear-gradient(180deg,rgba(40,45,52,0.95)_0_9px,rgba(0,0,0,0)_9px_14px)]" />
        <div className="absolute inset-y-0 left-1/2 w-[2px] bg-[#2a2f35]" />
      </div>
      {/* light through the blinds on the wall */}
      <div
        className="absolute left-[18%] top-[30%] h-[30%] w-[38%] opacity-[0.07] blur-[2px]"
        style={{
          background: "repeating-linear-gradient(170deg, #9ad1ff 0 8px, transparent 8px 18px)",
          transform: "skewX(-25deg)",
        }}
      />

      {/* motivational poster */}
      <div className="absolute right-[8%] top-[10%] hidden h-[26%] w-[13%] min-w-[110px] flex-col items-center justify-between border-[5px] border-[#24282c] bg-[#0b0c0e] p-2 shadow-2xl sm:flex">
        <div className="relative w-full flex-1 overflow-hidden bg-gradient-to-br from-[#2b3a2f] to-[#0f1512]">
          <div className="absolute bottom-0 left-1/2 h-1/2 w-3/4 -translate-x-1/2 rounded-t-full bg-[#101814]" />
          <div className="absolute left-[30%] top-[25%] h-4 w-4 rounded-full bg-[#c9a227]/70 blur-[1px]" />
        </div>
        <div className="pt-1 text-center font-display text-[clamp(10px,1.1vw,15px)] tracking-[0.3em] text-stone-300">
          SYNERGY
        </div>
        <div className="text-center text-[clamp(5px,0.5vw,8px)] uppercase tracking-widest text-stone-500">
          We&apos;re a family here
        </div>
      </div>

      {/* clock */}
      <div className="absolute right-[27%] top-[9%] hidden h-[9vh] w-[9vh] rounded-full border-4 border-[#2a2e33] bg-[#d9d4c5] shadow-xl sm:block">
        <div className="absolute left-1/2 top-1/2 h-[34%] w-[3px] origin-bottom -translate-x-1/2 -translate-y-full rounded bg-[#1a1a1a] [animation:clock-hand_3600s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[42%] w-[1.5px] origin-bottom -translate-x-1/2 -translate-y-full bg-[#8b1e1e] [animation:clock-hand_60s_steps(60)_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a1a1a]" />
      </div>

      {/* hanging lamp */}
      <div className="absolute left-1/2 top-0 h-[7%] w-[2px] -translate-x-1/2 bg-[#2a2d31]" />
      <div className="absolute left-1/2 top-[6.5%] h-[4.5vh] w-[16vh] -translate-x-1/2 rounded-t-[50%] bg-gradient-to-b from-[#3a3f45] to-[#1c1f23] shadow-[0_8px_30px_rgba(255,200,120,0.25)]" />
      <div className="absolute left-1/2 top-[10.6%] h-[1.4vh] w-[7vh] -translate-x-1/2 rounded-b-full bg-[#ffe7b0] shadow-[0_0_40px_10px_rgba(255,210,140,0.45)] [animation:flicker_7s_infinite]" />
      <div
        className="pointer-events-none absolute left-1/2 top-[11%] h-[90%] w-[110vh] -translate-x-1/2 [animation:flicker_7s_infinite]"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(255,214,150,0.16), rgba(255,214,150,0.05) 55%, transparent 75%)",
          clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
        }}
      />
    </div>
  );
}
