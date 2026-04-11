import { Button } from '../common';

export default function HomeHero({ content }) {
  const heroImage = content.heroImage?.startsWith('http')
    ? content.heroImage
    : content.heroImage
      ? `/uploads/${content.heroImage.replace(/^.*[\\/]/, '')}`
      : null;

  return (
    <section className="relative overflow-hidden py-12 md:py-16 text-white bg-linear-to-br from-primary to-secondary">
      <div className="bg-hero-pattern absolute inset-0 pointer-events-none" aria-hidden="true" data-aos="zoom-out-up"/>
      <div className="relative z-7 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto px-5 max-md:text-center">
        <div className="max-md:order-2">
          <p className="inline-block text-sm font-semibold tracking-widest uppercase text-white/90 mb-3" data-aos="zoom-out-up">
            Tally & Business Solutions
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white" data-aos="zoom-out-up">
            {content.heroTitle}
          </h1>
          <p className="text-lg text-white/90 mb-6" data-aos="zoom-out-up">
            {content.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start" data-aos="zoom-out-up">
            <Button
              to="/licenses"
              variant="inverse"
              fullWidth={false}
              className="inline-flex items-center justify-center gap-2"
            >
              View License Pricing
            </Button>
            <Button
              to="/contact"
              variant="outline"
              fullWidth={false}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/90 text-white hover:bg-white/15 hover:border-white dark:border-white/90 dark:text-white dark:hover:bg-white/15 dark:hover:border-white dark:bg-transparent"
            >
              Contact Us
            </Button>
          </div>
        </div>
        {heroImage ? (
          <div className="max-md:order-1 max-md:max-h-[220px]">
            <img
              src={heroImage}
              alt=""
              className="w-full object-cover max-h-[360px] max-md:max-h-[220px] rounded-[10px] shadow-xl border border-white/20 transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="max-md:order-1 max-md:max-h-[220px]" data-aos="zoom-out-up">
            <div className="flex flex-col items-center justify-center gap-3 min-h-[200px] max-md:min-h-[160px] p-8 max-md:p-6 text-center bg-white/10 border border-white/25 rounded-[10px] text-white/95 text-base" data-aos="zoom-out-up">
              <span className="text-lg font-semibold tracking-wide text-white">
                Licenses · Add-ons · Cloud
              </span>
              <p className="text-sm text-white/90 max-w-[260px] leading-relaxed m-0">
                Your complete Tally & business solutions in one place
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
