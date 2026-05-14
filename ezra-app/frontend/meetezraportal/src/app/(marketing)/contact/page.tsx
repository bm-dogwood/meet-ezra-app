'use client';

// ===========================================
// EZRA PORTAL - Contact Page
// ===========================================

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  MapPin,
  Send,
  Check,
  Building2,
  Users,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import MobileMenu from '@/components/ui/MobileMenu';
import Input from '@/components/ui/Input';

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">Ezra</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/bots" className="text-surface-300 hover:text-white transition-colors">The Ezra Family</Link>
          <Link href="/solutions" className="text-surface-300 hover:text-white transition-colors">Solutions</Link>
          <Link href="/platform" className="text-surface-300 hover:text-white transition-colors">Platform</Link>
          <Link href="/about" className="text-surface-300 hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="text-white font-medium">Contact</Link>
        </nav>
        <MobileMenu active={"Contact"} />
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login"><Button variant="ghost">Sign In</Button></Link>
          <Link href="/contact"><Button>Request Demo</Button></Link>
        </div>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="py-12 bg-surface-950 border-t border-surface-800">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          <span className="text-surface-400">© 2026 Ezra AI. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="text-surface-400 hover:text-surface-300 text-sm">Privacy Policy</Link>
          <Link href="/terms" className="text-surface-400 hover:text-surface-300 text-sm">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    locations: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-surface-950">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-ezra-500/10 rounded-full blur-[128px]" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-display-lg text-white mb-6">
                Let's Talk
              </h1>
              <p className="text-xl text-surface-400">
                Ready to transform your franchise operations? Fill out the form below
                and our team will get back to you within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-surface-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Get in Touch</h2>
                  <p className="text-surface-400">
                    Have questions about Ezra? Want to schedule a demo? We'd love to hear from you.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-ezra-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-ezra-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Email</h3>
                      <p className="text-surface-400 text-sm mt-1">onboarding@meetezra.bot</p>
                    </div>
                  </div>


                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-ezra-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-ezra-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Office</h3>
                      <p className="text-surface-400 text-sm mt-1">
                        San Francisco, CA<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-surface-700">
                  <h3 className="font-medium text-white mb-4">What to expect</h3>
                  <ul className="space-y-3">
                    {[
                      'Response within 24 hours',
                      'Custom demo of relevant features',
                      'Discussion of your specific needs',
                      'No pressure, no sales pitch',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-surface-400 text-sm">
                        <Check className="w-4 h-4 text-ezra-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                {isSubmitted ? (
                  <div className="bg-surface-850 rounded-2xl p-12 border border-surface-700 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success-500/10 flex items-center justify-center">
                      <Check className="w-8 h-8 text-success-500" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      Thanks for reaching out!
                    </h3>
                    <p className="text-surface-400 max-w-md mx-auto mb-8">
                      We've received your message and will get back to you within 24 hours.
                      In the meantime, feel free to explore our platform.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Link href="/bots">
                        <Button variant="secondary">Meet The Ezra Family</Button>
                      </Link>
                      <Link href="/">
                        <Button>Back to Home</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-surface-850 rounded-2xl p-8 border border-surface-700">
                    <h3 className="text-lg font-semibold text-white mb-6">
                      Request a Demo
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          label="Full Name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="John Smith"
                          required
                        />
                        <Input
                          label="Work Email"
                          type="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          label="Company / Brand"
                          name="company"
                          value={formState.company}
                          onChange={handleChange}
                          placeholder="Acme Franchise Group"
                          required
                        />
                        <div>
                          <label className="block text-sm font-medium text-surface-300 mb-2">
                            Your Role
                          </label>
                          <select
                            name="role"
                            value={formState.role}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-surface-700 bg-surface-900 text-surface-100 px-4 py-2.5 text-sm focus:border-ezra-500 focus:ring-2 focus:ring-ezra-500/20"
                            required
                          >
                            <option value="">Select your role</option>
                            <option value="franchisor">Franchisor / Corporate</option>
                            <option value="franchisee">Franchisee</option>
                            <option value="district_manager">District / Regional Manager</option>
                            <option value="store_manager">Store Manager</option>
                            <option value="operations">Operations</option>
                            <option value="it">IT / Technology</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-300 mb-2">
                          Number of Locations
                        </label>
                        <select
                          name="locations"
                          value={formState.locations}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-surface-700 bg-surface-900 text-surface-100 px-4 py-2.5 text-sm focus:border-ezra-500 focus:ring-2 focus:ring-ezra-500/20"
                          required
                        >
                          <option value="">Select range</option>
                          <option value="1-5">1-5 locations</option>
                          <option value="6-20">6-20 locations</option>
                          <option value="21-50">21-50 locations</option>
                          <option value="51-100">51-100 locations</option>
                          <option value="100+">100+ locations</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-300 mb-2">
                          How can we help?
                        </label>
                        <textarea
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell us about your franchise operations and what you're looking to improve..."
                          className="w-full rounded-lg border border-surface-700 bg-surface-900 text-surface-100 px-4 py-3 text-sm placeholder:text-surface-500 focus:border-ezra-500 focus:ring-2 focus:ring-ezra-500/20 resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isSubmitting}
                        rightIcon={<Send className="w-4 h-4" />}
                      >
                        Send Message
                      </Button>

                      <p className="text-xs text-surface-500 text-center">
                        By submitting this form, you agree to our{' '}
                        <Link href="/privacy" className="text-ezra-400 hover:text-ezra-300">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
