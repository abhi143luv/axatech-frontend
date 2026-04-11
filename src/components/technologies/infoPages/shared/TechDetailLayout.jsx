import React from "react";
import { Link } from "react-router-dom";
import { Button, SectionHeader } from "../../../common";
import { ArrowLeftIcon, ArrowRightIcon } from "../../../icons";
import { techIconMap } from "./iconMap";
import { CodeIcon } from "../../../icons";

const CARD_CLASS =
  "group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-sm dark:shadow-none transition-all duration-300 hover:border-primary/30 dark:hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-none hover:-translate-y-1";

export default function TechDetailLayout({ content }) {
  const { hero, services, whyChoose, cta } = content;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-5 py-8">
        <Link
          to="/technologies"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary dark:text-secondary hover:underline mb-2"
        >
          <ArrowLeftIcon className="text-lg" />
          Back to Technologies
        </Link>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-20 text-white bg-linear-to-br from-primary to-secondary">
        <div className="bg-hero-pattern absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative z-7 max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-lg:text-center">
            <div className="max-lg:order-2">
              <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-white/90 mb-3">
                <span className="w-8 h-px bg-white/60" aria-hidden />
                Technology
                <span className="w-8 h-px bg-white/60" aria-hidden />
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 text-white">
                {hero.title}
              </h2>
              <p className="text-base lg:text-lg text-white/90 mb-6 leading-relaxed">
                {hero.paragraph1}
              </p>
              <p className="text-white/90 text-sm lg:text-base mb-6 leading-relaxed">
                {hero.paragraph2}
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button
                  to="/technologies"
                  variant="inverse"
                  fullWidth={false}
                  className="inline-flex items-center justify-center gap-2"
                >
                  All Technologies
                </Button>
                <Button
                  to="/contact"
                  variant="outline"
                  fullWidth={false}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/90 text-white hover:bg-white/15 hover:border-white dark:border-white/90 dark:text-white dark:hover:bg-white/15 dark:hover:border-white dark:bg-transparent"
                >
                  Get a Quote
                </Button>
              </div>
            </div>
            <div className="max-lg:order-1 flex justify-center">
              <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-white/10 p-6 max-w-md w-full min-h-[200px] flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]">
                <img
                  src={hero.image}
                  alt={hero.imageAlt}
                  className="w-full max-w-sm h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-24 bg-gray-50/80 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-5">
          <SectionHeader
            label="What we offer"
            title={services.sectionTitle}
            subtitle={services.sectionSubtitle}
            centered={false}
            subtitleClassName="mb-10"
          />
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {services.list.map((service, i) => {
              const Icon = techIconMap[service.icon] || CodeIcon;
              return (
                <div key={i} className={CARD_CLASS}>
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 dark:bg-secondary/20 mb-4 transition-all duration-200 group-hover:scale-105 group-hover:bg-primary/15 dark:group-hover:bg-secondary/30">
                    <Icon className={`text-2xl shrink-0 ${service.iconClass || ""}`} />
                  </span>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-secondary transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-1 font-semibold text-secondary dark:text-accent text-sm mt-3">
                    Learn more
                    <ArrowRightIcon className="text-base transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-5">
          <SectionHeader
            label="Why us"
            title={whyChoose.sectionTitle}
            subtitle={whyChoose.sectionSubtitle}
            centered
            subtitleClassName="mb-10"
          />
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.list.map((item, i) => (
              <div key={i} className={CARD_CLASS}>
                <span
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 dark:bg-secondary/20 text-primary dark:text-secondary text-xl font-bold mb-4 transition-all duration-200 group-hover:bg-primary/15 dark:group-hover:bg-secondary/30 group-hover:scale-105"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed m-0">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 text-center bg-gray-50/80 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-5">
          <p className="inline-flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-secondary dark:text-accent mb-4">
            <span className="w-8 h-px bg-secondary/60 dark:bg-accent/60" aria-hidden />
            Contact
            <span className="w-8 h-px bg-secondary/60 dark:bg-accent/60" aria-hidden />
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
            {cta.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Button to="/contact" variant="primary" fullWidth={false} className="w-full sm:w-auto">
              Get in Touch
            </Button>
            <Button to="/technologies" variant="outline" fullWidth={false} className="w-full sm:w-auto">
              All Technologies
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
