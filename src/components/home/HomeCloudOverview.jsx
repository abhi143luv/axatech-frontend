import { Button, SectionHeader } from '../common';
import { CloudPlansIcon } from '../icons';

export default function HomeCloudOverview({ content }) {
  return (
    <section className="py-20 md:py-24 bg-gray-50/80 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-5">
        <SectionHeader
          label="Hosting"
          title={content.cloudOverviewTitle || 'Cloud Hosting'}
          subtitle={content.cloudOverviewText}
          centered
          titleClassName="mb-5"
          subtitleClassName="mb-8"
          dataAos="fade-up"
        />
        <div className="" data-aos="fade-up">
          <Button to="/cloud-hosting" variant="primary" fullWidth={false} className="inline-flex items-center justify-center gap-2">
            <CloudPlansIcon className="text-[20px] shrink-0" />
            View Cloud Plans
          </Button>
        </div>
      </div>
    </section>
  );
}
