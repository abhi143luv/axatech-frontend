import { SectionHeader } from '../common';

export default function ProductsHero() {
  return (
    <section className="hero-gradient-section py-20 md:py-24">
      <div className="max-w-[1200px] mx-auto px-5 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <SectionHeader
          label="Add-ons"
          title="Tally Add-ons"
          subtitle="Products and automation add-ons. Use Buy Now to send an enquiry."
          centered
          as="h1"
          inverse
        />
      </div>
    </section>
  );
}
