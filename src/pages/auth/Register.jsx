import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Input, Button, PageMeta } from '../../components/common';
import { toast } from '../../utils/toast';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  company: z.string().optional(),
});

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', company: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', password: '', phone: '', company: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({ name: '', email: '', password: '', phone: '', company: '' });

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const flatter = parsed.error.flatten();
      setFieldErrors({
        name: flatter.fieldErrors.name?.[0] ?? '',
        email: flatter.fieldErrors.email?.[0] ?? '',
        password: flatter.fieldErrors.password?.[0] ?? '',
        phone: flatter.fieldErrors.phone?.[0] ?? '',
        company: flatter.fieldErrors.company?.[0] ?? '',
      });
      return;
    }

    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully');
      navigate('/profile');
    } catch (err) {
      const msg = err.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Register - Axatech" />
      <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 bg-gray-100 dark:bg-gray-900/80">
        <div className="w-full max-w-[520px]">
          <div className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Create account
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Get started with your free account
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 px-4 py-3 text-sm text-red-700 dark:text-red-300" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-5">
              <Input
                label="Full name"
                type="text"
                name="name"
                id="register-name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                schema={registerSchema.shape.name}
                error={fieldErrors.name}
                autoComplete="off"
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                id="register-email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                schema={registerSchema.shape.email}
                error={fieldErrors.email}
                autoComplete="off"
                required
              />
              <Input
                label="Password"
                type="password"
                id="register-password"
                name="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                schema={registerSchema.shape.password}
                error={fieldErrors.password}
                autoComplete="off"
                required
              />
              <Input
                label="Phone (optional)"
                type="tel"
                name="phone"
                id="register-phone"
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={handleChange}
                error={fieldErrors.phone}
                autoComplete="off"
              />
              <Input
                label="Company (optional)"
                type="text"
                name="company"
                id="register-company"
                placeholder="Your company name"
                value={form.company}
                onChange={handleChange}
                error={fieldErrors.company}
                autoComplete="off"
              />
              <Button
                type="submit"
                loading={loading}
                loadingLabel="Creating account..."
                className="mt-2"
              >
                Create account
              </Button>
            </form>

            <p className="mt-8 pt-6 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary dark:text-secondary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
