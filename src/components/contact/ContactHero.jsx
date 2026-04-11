export default function ContactHero({ title = 'Contact Us', subtitle }) {
  return (
    <section className="hero-gradient-section py-20 md:py-24">
      <div className="max-w-4xl mx-auto px-5 text-center">
        <p className="inline-flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-white/90 mb-4 animate-[home-fadeInUp_0.5s_ease-out_0.2s_both]">
          <span className="w-8 h-px bg-white/60" aria-hidden />
          Contact
          <span className="w-8 h-px bg-white/60" aria-hidden />
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-3 animate-[home-fadeInUp_0.5s_ease-out_0.28s_both]">
          {title}
        </h1>
        {subtitle && (
          <div className="hero-glass-panel mt-6 rounded-2xl p-5 animate-[home-fadeInUp_0.5s_ease-out_0.35s_both]">
            <p className="text-base max-w-2xl mx-auto leading-relaxed text-white/95">{subtitle}</p>
          </div>
        )}
      </div>
    </section>
  );
}
