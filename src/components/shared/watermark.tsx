
export function Watermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-[0.03] dark:opacity-[0.015]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+50px)] rotate-[-20deg] w-full text-center">
        <div className="text-[10vw] sm:text-[8vw] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] leading-none pointer-events-none inline-block">
          Biggest Market
        </div>
      </div>
    </div>
  );
}
