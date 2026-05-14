'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forgotPasswordRequest, forgotPasswordVerify } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type Step = 'email' | 'otp' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  
  // Form state
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await forgotPasswordRequest({
        email,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await forgotPasswordVerify({ email, otp });
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      await forgotPasswordRequest({
        email,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setError(''); // Clear any previous error
      alert('A new OTP has been sent to your email');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-ezra-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col justify-center p-16">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <span className="text-3xl font-semibold text-white tracking-tight">
              Ezra
            </span>
          </Link>
          
          <h1 className="text-display-sm text-white mb-6">
            Reset Your Password
          </h1>
          <p className="text-lg text-surface-400 max-w-md leading-relaxed">
            Enter your email and new password. We&apos;ll send you a verification code to confirm the change.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-semibold text-white tracking-tight">
                Ezra
              </span>
            </Link>
          </div>

          <div className="bg-surface-900 border border-surface-800 rounded-2xl p-8">
            {/* Step 1: Email & Password */}
            {step === 'email' && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Forgot Password
                  </h2>
                  <p className="text-surface-400">
                    Enter your email and set a new password
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
                    <p className="text-sm text-danger-500">{error}</p>
                  </div>
                )}

                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    leftIcon={<Mail className="w-5 h-5" />}
                    required
                  />

                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-surface-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="hover:text-surface-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                  >
                    Send Verification Code
                  </Button>
                </form>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {step === 'otp' && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Verify OTP
                  </h2>
                  <p className="text-surface-400">
                    Enter the 6-digit code sent to <span className="text-ezra-400">{email}</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
                    <p className="text-sm text-danger-500">{error}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className={cn(
                        'w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono',
                        'bg-surface-800 border border-surface-700 rounded-lg',
                        'text-white placeholder:text-surface-500',
                        'focus:outline-none focus:ring-2 focus:ring-ezra-500 focus:border-transparent'
                      )}
                      maxLength={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                  >
                    Verify & Reset Password
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-sm text-ezra-400 hover:text-ezra-300 disabled:opacity-50"
                    >
                      Didn&apos;t receive the code? Resend
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="flex items-center justify-center gap-2 w-full text-sm text-surface-400 hover:text-surface-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to previous step
                  </button>
                </form>
              </>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Password Reset Successful
                </h2>
                <p className="text-surface-400 mb-8">
                  Your password has been changed successfully. You can now sign in with your new password.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full"
                  size="lg"
                >
                  Go to Sign In
                </Button>
              </div>
            )}
          </div>

          {/* Back to login */}
          {step !== 'success' && (
            <p className="mt-4 text-center text-sm text-surface-500">
              <Link href="/login" className="text-ezra-400 hover:text-ezra-300">
                ← Back to Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
