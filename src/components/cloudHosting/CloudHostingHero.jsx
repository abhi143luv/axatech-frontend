import { Button, SectionHeader } from '../common';

export default function CloudHostingHero({
  title = 'Cloud Hosting',
  subtitle,
  type = 'shared',
  onTypeChange = () => {},
}) {
  return (
    <section className="hero-gradient-section py-20 md:py-24">
      <div className="max-w-4xl mx-auto px-5 text-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <SectionHeader
          label="Hosting"
          title={title}
          subtitle={subtitle}
          centered
          as="h1"
          inverse
          subtitleClassName="mb-8"
        />
        <div
          className="hero-glass-panel inline-flex p-1.5 gap-5 animate-fadeInUp"
          style={{ animationDelay: '0.32s' }}
        >
          <Button
            type="button"
            variant="ghost"
            fullWidth={false}
            onClick={() => onTypeChange('shared')}
            className={`min-w-[140px] px-6 py-3 rounded-lg text-sm shadow-md border transition-colors ${
              type === 'shared'
                ? 'bg-white/25! text-white! border-white/50!'
                : 'bg-transparent! text-white/90! border-transparent! hover:bg-white/15! hover:text-white!'
            }`}
          >
            Shared Server
          </Button>
          <Button
            type="button"
            variant="ghost"
            fullWidth={false}
            onClick={() => onTypeChange('vps')}
            className={`min-w-[140px] px-6 py-3 rounded-lg text-sm shadow-md border transition-colors ${
              type === 'vps'
                ? 'bg-white/25! text-white! border-white/50!'
                : 'bg-transparent! text-white/90! border-transparent! hover:bg-white/15! hover:text-white!'
            }`}
          >
            VPS Server
          </Button>
        </div>
      </div>
    </section>
  );
}
