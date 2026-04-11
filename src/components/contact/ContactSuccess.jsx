import { Link } from 'react-router-dom';
import { Button } from '../common';
import { CheckCircleOutlineIcon } from '../icons';

export default function ContactSuccess({ title = 'Thank you', message }) {
  return (
    <section className="relative py-18 md:py-28 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute -top-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-96 w-96 rounded-full bg-secondary/25 blur-3xl" />
      </div>

      <div className="relative max-w-[980px] mx-auto px-5">
        <div className="mx-auto max-w-[740px] rounded-3xl border border-gray-200/80 dark:border-gray-700 bg-white/92 dark:bg-gray-800/92 shadow-2xl shadow-gray-200/70 dark:shadow-none p-10 sm:p-12 md:p-14 text-center backdrop-blur-sm">
          <div className="mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-3xl bg-primary/10 dark:bg-secondary/20 animate-[home-fadeInUp_0.5s_ease-out_0.12s_both]">
            <CheckCircleOutlineIcon className="text-4xl text-primary dark:text-secondary" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4 animate-[home-fadeInUp_0.5s_ease-out_0.18s_both]">
            {title}
          </h1>

          <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed animate-[home-fadeInUp_0.5s_ease-out_0.24s_both]">
            {message || 'Your enquiry has been submitted. We will get back to you soon.'}
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200/70 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/30 px-5 py-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 animate-[home-fadeInUp_0.5s_ease-out_0.3s_both]">
            <span className="font-semibold text-gray-900 dark:text-gray-100">Next steps:</span>{' '}
            Our team usually replies within <span className="font-semibold">24 hours</span>.
            If it’s urgent, you can also reach us via the Contact page.
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3.5 justify-center animate-[home-fadeInUp_0.5s_ease-out_0.36s_both]">
            <Button
              to="/products"
              variant="primary"
              size="lg"
              fullWidth={false}
              className="w-full sm:w-auto min-w-[200px] whitespace-nowrap"
            >
              Browse Products
            </Button>
            <Button
              to="/technologies"
              variant="outline"
              size="lg"
              fullWidth={false}
              className="w-full sm:w-auto min-w-[230px] whitespace-nowrap"
            >
              Explore Technologies
            </Button>
            <Link
              to="/"
              className="w-full sm:w-auto min-w-[160px] whitespace-nowrap inline-flex items-center justify-center rounded-xl px-6 h-12 text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
