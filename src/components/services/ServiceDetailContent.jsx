import { Button, SectionHeader } from '../common';
import { EmailEditIcon } from '../icons';

export default function ServiceDetailContent({ service }) {
  return (
    <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-5">
        <div className="animate-[home-fadeInUp_0.5s_ease-out_0.2s_both]">
          <SectionHeader
            label="Service"
            title={service.title}
            subtitle={service.shortDescription}
            centered={false}
            as="h1"
            titleClassName="mb-4"
            subtitleClassName="text-text-muted text-lg mb-6"
          />
        </div>
        {service.description && (
          <div
            className="mb-8 leading-relaxed text-text-muted dark:text-gray-400 [&_a]:text-primary dark:[&_a]:text-secondary [&_a]:underline [&_p]:mb-4 last:[&_p]:mb-0 animate-[home-fadeInUp_0.5s_ease-out_0.4s_both]"
            dangerouslySetInnerHTML={{
              __html: service.description.replace(/\n/g, '<br/>'),
            }}
          />
        )}
        <div className="animate-[home-fadeInUp_0.5s_ease-out_0.45s_both]">
          <Button
            to="/contact"
            state={{ enquiryType: 'service', service: service._id, serviceName: service.title }}
            variant="primary"
            fullWidth={false}
            className="inline-flex items-center justify-center gap-2"
          >
            <EmailEditIcon className="text-xl shrink-0" />
            Enquire now
          </Button>
        </div>
      </div>
    </section>
  );
}
