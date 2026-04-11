import { SectionHeader } from '../common';

export default function BlogHero({ title = 'Blog', subtitle }) {
  return (
    <section className="hero-gradient-section py-20 md:py-24">
      <div className="max-w-4xl mx-auto px-5 animate-[home-fadeInUp_0.5s_ease-out_0.2s_both]">
        <SectionHeader
          label="Blog"
          title={title}
          subtitle={null}
          centered
          inverse
          as="h1"
          subtitleClassName="mb-0"
        />
        {subtitle ? (
          <div className="hero-glass-panel mt-6 rounded-2xl p-5">
            <p className="text-sm font-medium text-white/95">{subtitle}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
