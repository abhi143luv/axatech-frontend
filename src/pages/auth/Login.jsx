import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Input, Button, PageMeta } from '../../components/common';
import { AccountIcon } from '../../components/icons';
import { toast } from '../../utils/toast';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

const DEMO_CREDENTIALS = [
  { label: 'Admin', email: 'admin@axatech.com', password: 'Admin@123' },
  { label: 'Customer (Rahul)', email: 'rahul@example.com', password: 'Customer@1' },
  { label: 'Customer (Priya)', email: 'priya@example.com', password: 'Customer@1' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleFillCredential = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
    setFieldErrors({ email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({ email: '', password: '' });

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const flatter = parsed.error.flatten();
      setFieldErrors({
        email: flatter.fieldErrors.email?.[0] ?? '',
        password: flatter.fieldErrors.password?.[0] ?? '',
      });
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Signed in successfully');
      navigate(user.role === 'admin' ? '/admin' : '/profile');
    } catch (err) {
      const msg = err.message || 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Login - Axatech" />
      <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 bg-gray-100 dark:bg-gray-900/80">
        <div className="w-full max-w-[440px]">
          <div className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-error-lighter dark:bg-error-darker/30 border border-error-light dark:border-error-dark px-4 py-3 text-sm text-error-dark dark:text-error-light" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-5">
              <Input
                label="Email"
                type="email"
                id="login-email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                schema={loginSchema.shape.email}
                error={fieldErrors.email}
                autoComplete="off"
                required
              />
              <Input
                label="Password"
                type="password"
                id="login-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                schema={loginSchema.shape.password}
                error={fieldErrors.password}
                autoComplete="off"
                required
              />
              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm font-medium text-primary dark:text-secondary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                loading={loading}
                loadingLabel="Signing in..."
                className="mt-2"
              >
                Sign in
              </Button>
            </form>

            <p className="mt-8 pt-6 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
              Don’t have an account?{' '}
              <Link to="/register" className="font-semibold text-primary dark:text-secondary hover:underline">
                Create account
              </Link>
            </p>

            <p className="mt-6 text-xs font-medium text-gray-500 dark:text-gray-400">
              Demo — click a card to auto-fill:
            </p>
            <div className="mt-3 grid gap-3">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.email}
                  type="button"
                  onClick={() => handleFillCredential(cred)}
                  className="flex items-center justify-between gap-3 w-full text-left rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-700/40 p-4 transition-colors duration-200 hover:bg-primary/10 hover:border-primary/30 dark:hover:bg-secondary/20 dark:hover:border-secondary/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AccountIcon className="text-xl shrink-0 text-primary dark:text-secondary" />
                    <div>
                      <span className="block text-sm font-semibold text-gray-900 dark:text-white">{cred.label}</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">{cred.email}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary dark:text-secondary shrink-0">Use this</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
