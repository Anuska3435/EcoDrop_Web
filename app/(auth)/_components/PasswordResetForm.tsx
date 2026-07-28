"use client";

import { useState, useTransition } from 'react';
import { resetPassword } from '@/lib/api/password-reset';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PasswordResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Reset token is missing');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    startTransition(async () => {
      try {
        await resetPassword(token, password, confirmPassword);
        setMessage('Password reset was successful. Redirecting to login...');
        router.push('/login');
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || 'Unable to reset password');
      }
    });
  };

  return (
    <div className="w-full max-w-md px-6 py-10 sm:px-10">
      <div className="rounded-[2rem] border border-sage-100 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sage-900">Reset Password</h1>
          <p className="mt-2 text-sm text-sage-600">
            Set a new password for your account.
          </p>
        </div>

        {message ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-sage-700">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="h-12 w-full rounded-xl border-0 bg-sage-100 pl-4 pr-4 text-gray-900 placeholder:text-sage-400 outline-none transition-colors focus:bg-sage-50 focus:ring-2 focus:ring-sage-500/20"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-sage-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="h-12 w-full rounded-xl border-0 bg-sage-100 pl-4 pr-4 text-gray-900 placeholder:text-sage-400 outline-none transition-colors focus:bg-sage-50 focus:ring-2 focus:ring-sage-500/20"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-sage-700 text-sm font-semibold text-white transition-colors hover:bg-sage-800 disabled:opacity-50"
          >
            {isPending ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
