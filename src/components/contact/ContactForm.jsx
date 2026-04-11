import { useState } from 'react';
import { z } from 'zod';
import { Button, Input } from '../common';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export default function ContactForm({ form, onChange, onSubmit, error, loading }) {
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({ name: '', email: '', phone: '', company: '', message: '' });

    const parsed = contactSchema.safeParse({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      message: form.message,
    });

    if (!parsed.success) {
      const flatter = parsed.error.flatten();
      setFieldErrors({
        name: flatter.fieldErrors.name?.[0] ?? '',
        email: flatter.fieldErrors.email?.[0] ?? '',
        phone: flatter.fieldErrors.phone?.[0] ?? '',
        company: flatter.fieldErrors.company?.[0] ?? '',
        message: flatter.fieldErrors.message?.[0] ?? '',
      });
      return;
    }

    onSubmit(e);
  };

  return (
    <section className="min-h-[60vh] flex items-center justify-center py-12 md:py-16 px-4 sm:px-6 bg-gray-100 dark:bg-gray-900/80">
      <div className="w-full max-w-[520px]">
        <div className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Send an enquiry
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Fill in the form below and we&apos;ll get back to you shortly
            </p>
          </div>

          {error && (
            <div
              className="mb-6 rounded-lg bg-error-lighter dark:bg-error-darker/30 border border-error-light dark:border-error-dark px-4 py-3 text-sm text-error-dark dark:text-error-light"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <input type="hidden" name="type" value={form.type} />
            <Input
              label="Name"
              id="contact-name"
              type="text"
              name="name"
              placeholder="Your name"
              required
              value={form.name}
              onChange={onChange}
              schema={contactSchema.shape.name}
              error={fieldErrors.name}
              className="mb-0"
            />
            <Input
              label="Email"
              id="contact-email"
              type="email"
              name="email"
              placeholder="name@company.com"
              required
              value={form.email}
              onChange={onChange}
              schema={contactSchema.shape.email}
              error={fieldErrors.email}
              className="mb-0"
            />
            <Input
              label="Phone"
              id="contact-phone"
              type="tel"
              name="phone"
              placeholder="Your phone number"
              value={form.phone}
              onChange={onChange}
              schema={contactSchema.shape.phone}
              error={fieldErrors.phone}
              className="mb-0"
            />
            <Input
              label="Company"
              id="contact-company"
              type="text"
              name="company"
              placeholder="Company name (optional)"
              value={form.company}
              onChange={onChange}
              schema={contactSchema.shape.company}
              error={fieldErrors.company}
              className="mb-0"
            />
            <Input
              label="Message"
              id="contact-message"
              type="textarea"
              name="message"
              placeholder="Your message or enquiry details..."
              required
              value={form.message}
              onChange={onChange}
              schema={contactSchema.shape.message}
              error={fieldErrors.message}
              className="mb-0"
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              loading={loading}
              loadingLabel="Sending..."
              className="mt-2"
            >
              Submit Enquiry
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
