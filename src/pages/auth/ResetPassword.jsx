import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import api from '../../api';
import { toast } from '../../utils/toast';
import { Input, Button, PageMeta } from '../../components/common';

const schema = z.object({
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Confirm your password'),
}).refine((data) => data.password === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({ password: '', confirmPassword: '' });

    const parsed = schema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      const flatter = parsed.error.flatten();
      setFieldErrors({
        password: flatter.fieldErrors.password?.[0] ?? '',
        confirmPassword: flatter.fieldErrors.confirmPassword?.[0] ?? '',
      });
      return;
    }

    setLoading(true);
    try {
      await api.auth.resetPassword(token, password);
      setSuccess(true);
      toast.success('Password reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.message || 'Failed to reset password';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <PageMeta title="Invalid link - Axatech" />
        <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 bg-gray-100 dark:bg-gray-900/80">
          <div className="w-full max-w-[440px] text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <p className="text-error dark:text-error-light">Invalid or missing reset link.</p>
              <Link to="/forgot-password" className="mt-4 inline-block font-semibold text-primary dark:text-secondary hover:underline">Request a new link</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Reset password - Axatech" />
      <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 bg-gray-100 dark:bg-gray-900/80">
        <div className="w-full max-w-[440px]">
          <div className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Reset password
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Enter your new password below
              </p>
            </div>

            {success ? (
              <div className="rounded-lg bg-success-lighter dark:bg-success-darker/30 border border-success-light dark:border-success-dark px-4 py-3 text-sm text-success-dark dark:text-success-light text-center">
                Your password has been reset. Redirecting to sign in...
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 rounded-lg bg-error-lighter dark:bg-error-darker/30 border border-error-light dark:border-error-dark px-4 py-3 text-sm text-error-dark dark:text-error-light" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-5">
                  <Input
                    label="New password"
                    type="password"
                    id="reset-password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    schema={schema.shape.password}
                    error={fieldErrors.password}
                    autoComplete="new-password"
                    required
                  />
                  <Input
                    label="Confirm new password"
                    type="password"
                    id="reset-confirm"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={fieldErrors.confirmPassword}
                    autoComplete="new-password"
                    required
                  />
                  <Button type="submit" loading={loading} loadingLabel="Resetting...">
                    Reset password
                  </Button>
                </form>
              </>
            )}

            <p className="mt-8 pt-6 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
              <Link to="/login" className="font-semibold text-primary dark:text-secondary hover:underline">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
