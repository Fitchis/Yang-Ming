'use client';

import React, { useState, useEffect, Suspense, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, LogIn, CheckCircle2, AlertCircle, Eye, EyeOff, LayoutDashboard, Shield, Ship } from 'lucide-react';
import { getRegisteredUsers } from '@/lib/storage';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const registeredParam = searchParams.get('registered');
  const emailParam = searchParams.get('email');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  useEffect(() => {
    if (registeredParam === '1') {
      setSuccessBanner(true);
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
    }
  }, [registeredParam, emailParam]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid business email format.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setIsSubmitting(false);
        setLoginError(data.error || 'Authentication failed. Please verify your credentials.');
        if (data.field) {
          setErrors((prev) => ({ ...prev, [data.field]: data.error }));
        }
        return;
      }

      // Successful login
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'yangming_session',
          JSON.stringify({
            user: data.user,
            loggedInAt: new Date().toISOString(),
          })
        );
      }

      router.push('/admin');
    } catch (err) {
      console.warn('API error during login, falling back to local registry check:', err);

      const localUsers = getRegisteredUsers();
      const matched = localUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!matched) {
        setIsSubmitting(false);
        setLoginError('No carrier account found with this email. Please register first.');
        setErrors((prev) => ({ ...prev, email: 'Carrier account not found.' }));
        return;
      }

      if (matched.password && matched.password !== password) {
        setIsSubmitting(false);
        setLoginError('Incorrect password. Please verify your credentials and try again.');
        setErrors((prev) => ({ ...prev, password: 'Password does not match.' }));
        return;
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'yangming_session',
          JSON.stringify({
            user: { id: matched.id, email: matched.email, companyName: matched.companyName },
            loggedInAt: new Date().toISOString(),
          })
        );
      }

      router.push('/admin');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Success Banner if coming from /register */}
        {successBanner && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm animate-in fade-in duration-300 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-300">Registration Confirmed</p>
              <p className="text-emerald-200/90 text-xs mt-0.5">
                Your enterprise credentials and license have been verified. You may sign in or proceed to the operations console.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
            <Ship className="w-3.5 h-3.5" />
            <span>Yang Ming Marine Transport</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Carrier Sign In
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Sign in to access berth assignments, container manifests, and cargo clearance.
          </p>
        </div>

        {/* Error Alert Banner */}
        {loginError && (
          <div className="mb-5 p-4 rounded-2xl bg-red-950/60 border border-red-500/60 text-red-200 text-xs sm:text-sm animate-in fade-in duration-200 flex items-start gap-3 shadow-lg shadow-red-950/40">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Authentication Failed</p>
              <p className="text-red-200/90 text-xs mt-0.5">{loginError}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Business Email Address <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="operations@shipping-line.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLoginError('');
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                className={`glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm ${
                  errors.email ? 'border-red-400/80 focus:border-red-400' : ''
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Account Password <span className="text-cyan-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered carrier contact.')}
                className="text-[11px] text-cyan-300 hover:text-cyan-200"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError('');
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                className={`glass-input w-full pl-10 pr-10 py-2.5 rounded-xl text-sm ${
                  errors.password ? 'border-red-400/80 focus:border-red-400' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-300 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-900/60 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0"
              />
              <span className="text-xs text-slate-300">Remember carrier terminal session</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="glass-button-primary w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Direct link to operations console */}
          <div className="pt-2">
            <Link
              href="/admin"
              className="glass-button-secondary w-full py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 text-cyan-200 border-cyan-500/30 hover:border-cyan-400/50"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Enter Port Operations Console</span>
            </Link>
          </div>

          {/* Register Link */}
          <div className="text-center pt-3 border-t border-white/10">
            <p className="text-xs text-slate-300">
              New carrier or logistics operator?{' '}
              <Link
                href="/register"
                className="text-cyan-300 hover:text-cyan-200 font-semibold underline underline-offset-4"
              >
                Register carrier here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-panel p-8 rounded-2xl text-white">Authenticating carrier session...</div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
