'use client';

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Mail,
  Lock,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  X,
  FileCheck2,
  KeyRound,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { saveRegisteredUser } from '@/lib/storage';

export default function RegisterPage() {
  const router = useRouter();

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileError, setFileError] = useState('');

  // Captcha State
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // 2FA / OTP State
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [generatedOtp, setGeneratedOtp] = useState('8824');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Errors State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Validate Email
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Handle File Change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds the 10MB limit.');
      return;
    }

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFileDataUrl((uploadEvent.target?.result as string) || '');
    };
    reader.readAsDataURL(file);

    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  // Remove File
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileDataUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Captcha Click Simulation
  const handleCaptchaClick = () => {
    if (captchaChecked) {
      setCaptchaChecked(false);
      return;
    }
    setCaptchaLoading(true);
    setTimeout(() => {
      setCaptchaLoading(false);
      setCaptchaChecked(true);
      if (errors.captcha) {
        setErrors((prev) => ({ ...prev, captcha: '' }));
      }
    }, 500);
  };

  // Step 1 Validation & Proceed to OTP
  const handleProceedToOtp = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!companyName.trim()) {
      newErrors.companyName = 'Company Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email Address (User ID) is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please provide a valid business email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    // MANDATORY REQUIRED FILE CHECK
    if (!uploadedFile) {
      newErrors.file = 'Commercial operating license or certificate is required.';
    }

    if (!captchaChecked) {
      newErrors.captcha = 'Please complete the security verification challenge.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setOtpDigits(['', '', '', '']);
    setOtpError('');
    setErrors({});
    setStep('otp');

    setTimeout(() => {
      otpInputRefs[0].current?.focus();
    }, 150);
  };

  // Handle OTP Inputs
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 4);
      if (pasted.length === 4) {
        const chars = pasted.split('');
        setOtpDigits(chars);
        otpInputRefs[3].current?.focus();
        return;
      }
    }

    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpError('');

    if (digit && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleResendCode = () => {
    if (resendCooldown > 0) return;
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtpDigits(['', '', '', '']);
    setOtpError('');
    setResendCooldown(30);

    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Final Submission
  const handleFinalSubmit = (e: FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 4) {
      setOtpError('Please enter the complete 4-digit verification code.');
      return;
    }

    if (enteredOtp !== generatedOtp) {
      setOtpError('Invalid verification code. Please check and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const sizeInMb = (uploadedFile!.size / (1024 * 1024)).toFixed(1);
      const formattedSize = `${sizeInMb} MB`;

      saveRegisteredUser({
        companyName: companyName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        fileName: uploadedFile!.name,
        fileType: uploadedFile!.type || 'application/octet-stream',
        fileSize: formattedSize,
        fileDataUrl: fileDataUrl,
        status: 'Verified',
      });

      setTimeout(() => {
        router.push(`/login?registered=1&email=${encodeURIComponent(email)}`);
      }, 500);
    } catch (err) {
      console.error(err);
      setOtpError('An error occurred during submission. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Yang Ming Marine Transport</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Carrier Registration
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Register your commercial shipping entity for terminal clearance and berth allocations.
          </p>
        </div>

        {/* STEP 1: Registration Form */}
        {step === 'form' && (
          <form onSubmit={handleProceedToOtp} className="space-y-4" noValidate>
            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Company Legal Name <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Pacific Rim Ocean Lines Ltd."
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: '' }));
                  }}
                  className={`glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm ${
                    errors.companyName ? 'border-red-400/80 focus:border-red-400' : ''
                  }`}
                />
              </div>
              {errors.companyName && (
                <p className="text-xs text-red-300 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Email Address (Acts as User ID) */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Business Email Address (User ID) <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="e.g. operations@pacific-ocean.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
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
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Account Password <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
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

            {/* File Upload Field - MANDATORY REQUIRED */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Maritime Operating License / Certificate <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                  Required
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />

              {!uploadedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 bg-slate-900/40 hover:bg-slate-900/60 ${
                    errors.file
                      ? 'border-red-400/80 bg-red-950/20'
                      : 'border-white/20 hover:border-cyan-400/60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mx-auto mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-white">
                    Upload official company shipping license, charter, or tax certificate
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Accepted formats: PDF, PNG, JPG (Maximum size: 10MB)
                  </p>
                </div>
              ) : (
                <div className="glass-panel-subtle rounded-2xl p-3 flex items-center justify-between border border-cyan-500/30">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white truncate" title={uploadedFile.name}>
                        {uploadedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-300">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Attached for port clearance
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-2"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {errors.file && (
                <p className="text-xs text-red-300 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {errors.file}
                </p>
              )}
              {fileError && (
                <p className="text-xs text-red-300 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {fileError}
                </p>
              )}
            </div>

            {/* Captcha: "I am not a robot" */}
            <div className="pt-1">
              <div
                onClick={handleCaptchaClick}
                className={`glass-panel-subtle rounded-2xl p-3.5 flex items-center justify-between cursor-pointer border transition-all select-none ${
                  captchaChecked
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : errors.captcha
                    ? 'border-red-400/80 bg-red-950/20'
                    : 'border-white/15 hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                      captchaChecked
                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/30'
                        : 'border-slate-400 bg-slate-800/80'
                    }`}
                  >
                    {captchaLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    ) : captchaChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : null}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    I am not a robot
                  </span>
                </div>

                <div className="flex flex-col items-end opacity-85">
                  <div className="flex items-center gap-1 text-[10px] text-slate-300 font-semibold tracking-wider uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>reCAPTCHA</span>
                  </div>
                  <span className="text-[9px] text-slate-400">Enterprise Security</span>
                </div>
              </div>
              {errors.captcha && (
                <p className="text-xs text-red-300 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {errors.captcha}
                </p>
              )}
            </div>

            {/* Submit to Step 2 */}
            <div className="pt-2">
              <button
                type="submit"
                className="glass-button-primary w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Continue to Two-Factor Verification</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-300">
                Already registered with Yang Ming?{' '}
                <Link
                  href="/login"
                  className="text-cyan-300 hover:text-cyan-200 font-semibold underline underline-offset-4"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* STEP 2: OTP 2FA Verification UI */}
        {step === 'otp' && (
          <form onSubmit={handleFinalSubmit} className="space-y-5 animate-in fade-in duration-300">
            <button
              type="button"
              onClick={() => setStep('form')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Registration Details</span>
            </button>

            <div className="glass-panel-subtle rounded-2xl p-4 border border-cyan-500/30 text-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-white">Two-Factor Authentication (2FA)</h2>
              <p className="text-xs text-slate-300 mt-1">
                A 4-digit security verification code has been dispatched to:
              </p>
              <p className="text-xs font-semibold text-cyan-300 mt-0.5">{email}</p>
              
              <div className="mt-3 text-[11px] text-slate-400">
                Security verification code: <span className="font-mono text-cyan-300 font-semibold">{generatedOtp}</span>
              </div>
            </div>

            {/* 4-Digit Inputs */}
            <div>
              <label className="block text-center text-xs font-semibold text-slate-200 mb-2">
                Enter Security Code
              </label>
              <div className="flex items-center justify-center gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpInputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="glass-input w-12 sm:w-14 h-14 text-center text-xl sm:text-2xl font-bold font-mono rounded-2xl focus:scale-105 transition-transform"
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-xs text-red-300 mt-2 text-center flex items-center justify-center gap-1 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {otpError}
                </p>
              )}
            </div>

            {/* Submission Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="glass-button-primary w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authorizing & Registering Carrier...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Authorize Account</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0}
                  className="text-xs text-slate-400 hover:text-slate-200 disabled:opacity-50"
                >
                  {resendCooldown > 0 ? (
                    <span>Resend code in {resendCooldown}s</span>
                  ) : (
                    <>Didn&apos;t receive code? <span className="text-cyan-400 underline">Resend code</span></>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
