import { Link } from 'react-router-dom';
import { Button, SectionHeader } from '../common';
import { PackageVariantIcon, ArrowRightIcon, AppsIcon } from '../icons';

export default function HomeFeaturedAddons({ products, featuredAddonsTitle }) {
  if (!products?.length) return null;

  return (
    <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeader
          label="Products"
          title={featuredAddonsTitle || 'Featured Add-ons'}
          subtitle="Extend Tally with our trusted add-ons. Automation, reporting, and more."
          centered={false}
          subtitleClassName="mb-10"
          dataAos="fade-up"
        />

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Link
              to={`/products/${p.slug}`}
              key={p._id}
              className="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-all duration-300 hover:border-primary/30 dark:hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-none hover:-translate-y-1 text-inherit no-underline" data-aos="fade-up"
              style={{ animationDelay: `${0.4 + i * 0.08}s` }}
            >
              {p.images?.[0] ? (
                <div className="aspect-4/3 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-4/3 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <PackageVariantIcon className="text-4xl text-gray-400 dark:text-gray-500" />
                </div>
              )}
              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-secondary transition-colors duration-200" data-aos="fade-up">
                  {p.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4" data-aos="fade-up">
                  {p.shortDescription || p.description?.slice(0, 100)}
                </p>
                <span className="inline-flex items-center gap-1 font-semibold text-secondary dark:text-accent text-sm" data-aos="fade-up">
                  Learn more
                  <ArrowRightIcon className="text-base transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center" data-aos="fade-up">
          <Button to="/products" variant="secondary" fullWidth={false} className="inline-flex items-center justify-center gap-2">
            <AppsIcon className="text-[20px] shrink-0" />
            All Add-ons
          </Button>
        </div>
      </div>
    </section>
  );
}
