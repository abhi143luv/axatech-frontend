import { Button, SectionHeader } from '../common';

export default function HomeCta({ contactTitle }) {
  return (
    <section className="py-20 md:py-24 text-center bg-gray-50/80 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-2xl mx-auto px-5">
        <SectionHeader
          label="Contact"
          title={contactTitle || 'Get in Touch'}
          subtitle="Have questions? We're here to help with licenses, add-ons, and cloud hosting."
          centered
          subtitleClassName="mb-8"
          dataAos="fade-up"
        />
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center" data-aos="fade-up">
          <Button to="/contact" variant="primary" fullWidth={false} className="w-full sm:w-auto">
            Contact Us
          </Button>
          <Button to="/licenses" variant="outline" fullWidth={false} className="w-full sm:w-auto">
            View Pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
