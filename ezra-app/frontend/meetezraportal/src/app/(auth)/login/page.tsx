'use client';

// ===========================================
// EZRA PORTAL - Login Page
// ===========================================

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, User, Mail, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/app');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({ email, password });
      if (result.success) {
        router.push('/app');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-950">
        <div className="w-8 h-8 border-2 border-ezra-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            AI-Powered Intelligence for Franchise Operations
          </h1>
          <p className="text-lg text-surface-400 max-w-md leading-relaxed">
            Access real-time analytics, loss prevention monitoring, and operational
            insights across all your locations.
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-ezra-500/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-ezra-400" />
              </div>
              <div>
                <p className="text-white font-medium">Enterprise Security</p>
                <p className="text-sm text-surface-500">SOC 2 compliant infrastructure</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-ezra-500/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-ezra-400" />
              </div>
              <div>
                <p className="text-white font-medium">Managed Access</p>
                <p className="text-sm text-surface-500">Accounts provisioned by Ezra team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
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
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Welcome back
              </h2>
              <p className="text-surface-400">
                Sign in to your Ezra portal
              </p>
            </div>

            {/* Info notice */}
            <div className="mb-6 p-4 rounded-lg bg-surface-800/50 border border-surface-700">
              <p className="text-sm text-surface-400">
                <span className="text-surface-300 font-medium">Note:</span> Ezra accounts
                are provisioned by our team. If you need access, please{' '}
                <Link href="/contact" className="text-ezra-400 hover:text-ezra-300">
                  contact us
                </Link>
                .
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
                <p className="text-sm text-danger-500">{error}</p>
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Username or Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin or you@company.com"
                leftIcon={<User className="w-5 h-5" />}
                required
              />

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  leftIcon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-surface-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-ezra-500 focus:ring-ezra-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-surface-400">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-ezra-400 hover:text-ezra-300"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Sign in
              </Button>
            </form>
          </div>

          {/* Back to home */}
          <p className="mt-4 text-center text-sm text-surface-500">
            <Link href="/" className="text-ezra-400 hover:text-ezra-300">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
