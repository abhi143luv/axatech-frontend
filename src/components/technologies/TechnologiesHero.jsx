export default function TechnologiesHero({ title = 'Technologies', subtitle }) {
  return (
    <section className="py-20 md:py-24 bg-gray-50/80 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-5 text-center">
        <p className="inline-flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-secondary dark:text-accent mb-4 animate-[home-fadeInUp_0.5s_ease-out_0.2s_both]">
          <span className="w-8 h-px bg-secondary/60 dark:bg-accent/60" aria-hidden />
          Technologies
          <span className="w-8 h-px bg-secondary/60 dark:bg-accent/60" aria-hidden />
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3 animate-[home-fadeInUp_0.5s_ease-out_0.28s_both]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto leading-relaxed animate-[home-fadeInUp_0.5s_ease-out_0.35s_both]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
