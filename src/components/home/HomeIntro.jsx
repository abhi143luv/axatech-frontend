import { SectionHeader } from '../common';

export default function HomeIntro({ content }) {
  return (
    <section className="relative py-20 md:py-24 bg-gray-50/80 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-5">
        <SectionHeader
          label="About Us"
          title={content.introTitle}
          subtitle={content.introText}
          centered
          as="h2"
          className="max-w-[720px] mx-auto"
          titleClassName="mb-5"
          subtitleClassName="max-w-[720px]"
          dataAos="zoom-out-up"
        />
      </div>
    </section>
  );
}
