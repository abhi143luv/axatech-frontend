import { Button, SectionHeader } from '../common';

export default function LicensesHero({ type, onTypeChange }) {
  return (
    <section className="hero-gradient-section py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <SectionHeader
              label="Pricing"
              title="Tally License Pricing"
              subtitle="Choose Single User or Multi User plans. Buy Now redirects to enquiry form."
              position="left"
              as="h1"
              labelClassName="text-white/90 dark:text-white"
              titleClassName="text-white dark:text-white"
              subtitleClassName="mb-8 text-white/90 dark:text-white/90"
            />
            <div className="flex justify-start">
              <div
                className="hero-glass-panel inline-flex p-1.5 gap-5 animate-fadeInUp"
                style={{ animationDelay: '0.32s' }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth={false}
                  onClick={() => onTypeChange('single')}
                  className={`min-w-[120px] px-6 py-3 rounded-lg text-sm shadow-md border transition-colors ${
                    type === 'single'
                      ? 'bg-white/25! text-white! border-white/50!'
                      : 'bg-transparent! text-white/90! border-transparent! hover:bg-white/15! hover:text-white!'
                  }`}
                >
                  Single User
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth={false}
                  onClick={() => onTypeChange('multi')}
                  className={`min-w-[120px] px-6 py-3 rounded-lg text-sm shadow-md border transition-colors ${
                    type === 'multi'
                      ? 'bg-white/25! text-white! border-white/50!'
                      : 'bg-transparent! text-white/90! border-transparent! hover:bg-white/15! hover:text-white!'
                  }`}
                >
                  Multi User
                </Button>
              </div>
            </div>
          </div>
          <div className="animate-fadeInUp lg:justify-self-end" style={{ animationDelay: '0.2s' }}>
            <img
              src="/images/banner/TallyLicenes.jpg"
              alt="Tally license"
              className="w-full max-w-[420px] rounded-2xl border border-white/20 shadow-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
