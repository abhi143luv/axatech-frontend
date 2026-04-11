import { Link } from 'react-router-dom';
import { EmailOutlineIcon, MessageTextOutlineIcon, PhoneIcon } from '../icons';

const CONTAINER = 'w-full max-w-[1200px] mx-auto px-5';

const footerLinkClass =
  'text-[0.9375rem] text-white/90 dark:text-gray-300 transition-colors duration-200 hover:text-secondary dark:hover:text-accent inline-block py-1';

const SOLUTIONS = [
  { to: '/licenses', label: 'Tally Licenses' },
  { to: '/licenses/tss-renewal-single-user', label: 'Single User TSS Renewal' },
  { to: '/licenses/tss-renewal-multi-user', label: 'Multi User TSS Renewal' },
  { to: '/products', label: 'Add-ons' },
  { to: '/cloud-hosting', label: 'Cloud Hosting' },
];

const COMPANY = [
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="bg-primary-hover dark:bg-gray-900 border-t border-primary/20 dark:border-gray-700/80 mt-auto">
      <div className={CONTAINER}>
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.25fr] gap-10 lg:gap-12 py-12 lg:py-14">
          {/* Brand column */}
          <div className="lg:max-w-[300px] sm:text-left text-center text-white/80 !dark:text-gray-200">
            <Link
              to="/"
              className="inline-flex flex-col items-center sm:items-start gap-1 mb-5 no-underline"
            >
              <img
                src="/logo1.png"
                alt="Axatech"
                className="h-11 w-auto max-w-[180px] object-contain object-left sm:object-left dark:opacity-95"
              />
              {/* <span className="text-[0.65rem] font-semibold tracking-[0.15em] text-white/80 dark:text-gray-400 uppercase">
                Building solutions...
              </span> */}
            </Link>
            <p className="text-[0.9375rem] leading-relaxed m-0">
              Tally licenses, add-ons, cloud hosting & integration services. Trusted by businesses across India.
            </p>
          </div>

          {/* Solutions */}
          <div className="sm:text-left text-center">
            <h4 className="text-[0.8125rem] font-semibold tracking-wider uppercase text-white/95 dark:text-gray-200 m-0 mb-5">
              Solutions
            </h4>
            <ul className="list-none m-0 p-0 space-y-2">
              {SOLUTIONS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={footerLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="sm:text-left text-center">
            <h4 className="text-[0.8125rem] font-semibold tracking-wider uppercase text-white/95 dark:text-gray-200 m-0 mb-5">
              Company
            </h4>
            <ul className="list-none m-0 p-0 space-y-2">
              {COMPANY.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={footerLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="sm:text-left text-center text-white/80 !dark:text-gray-200">
            <h4 className="text-[0.8125rem] font-semibold tracking-wider uppercase text-white/95 dark:text-gray-200 m-0 mb-5">
              Get in Touch
            </h4>
            <p className="text-[0.9375rem] text-white/85 dark:text-gray-400 m-0 mb-4 leading-relaxed">
              Have a question or need a quote?
            </p>
            <div className="flex flex-col gap-3 mb-5">
              <a
                href="tel:+918448449099"
                className="inline-flex items-center justify-center sm:justify-start gap-2 text-[0.9375rem] text-white/90 dark:text-gray-400 hover:text-secondary dark:hover:text-accent transition-colors duration-200"
              >
                <PhoneIcon className="text-[18px] shrink-0 opacity-90" />
                +91 8448449099
              </a>
              <a
                href="mailto:info@axatech.com"
                className="inline-flex items-center justify-center sm:justify-start gap-2 text-[0.9375rem] text-white/90 dark:text-gray-400 hover:text-secondary dark:hover:text-accent transition-colors duration-200"
              >
                <EmailOutlineIcon className="text-[18px] shrink-0 opacity-90" />
                info@axatech.com
              </a>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 font-semibold text-[0.9375rem] rounded-xl border-2 border-white/80 dark:border-gray-500 text-white dark:text-gray-200 bg-transparent transition-all duration-200 hover:bg-white/20 hover:border-white hover:text-white dark:hover:bg-secondary/20 dark:hover:border-secondary max-[640px]:w-full"
            >
              <MessageTextOutlineIcon className="text-[18px] shrink-0" />
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-white/10 dark:border-gray-700/80">
          <p className="m-0 text-[0.8125rem] text-white/70 dark:text-gray-500 text-center tracking-wide">
            &copy; {new Date().getFullYear()} Axatech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
