export default function Loader({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`.trim()} aria-label="Loading">
      <div
        className="relative h-40 w-40 rounded-full overflow-hidden bg-[radial-gradient(circle,rgba(148,163,184,0.25)_30%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(15,23,42,0.4)_30%,transparent_70%)]"
      >
        {/* outer spinning ring (replaces ::before) */}
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary/80 dark:border-t-slate-300/70 animate-spin"
        />

        {/* rotating conic gradient (replaces ::after) */}
        <div
          className="absolute inset-[10%] rounded-full blur-[2px] animate-[spin_1.5s_linear_infinite_reverse] [--loader-conic:conic-gradient(from_90deg,rgba(15,23,42,0.25),transparent)] dark:[--loader-conic:conic-gradient(from_90deg,rgba(255,255,255,0.2),transparent)]"
          style={{
            background: 'var(--loader-conic)',
          }}
        />

        {/* center pulsing circle */}
        <div
          className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_18px_rgba(59,130,246,0.8)] animate-pulse dark:bg-slate-100"
        />

        {/* orbit container */}
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
          {/* 4 orbiting dots */}
          <div
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-primary dark:bg-slate-100"
            style={{ transform: 'rotate(0deg) translate(60px)' }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-primary dark:bg-slate-100"
            style={{ transform: 'rotate(90deg) translate(60px)' }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-primary dark:bg-slate-100"
            style={{ transform: 'rotate(180deg) translate(60px)' }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-primary dark:bg-slate-100"
            style={{ transform: 'rotate(270deg) translate(60px)' }}
          />
        </div>
      </div>

      <span className="sr-only">Loading</span>
    </div>
  );
}

