'use client';

// ===========================================
// EZRA PORTAL - Privacy Policy Page
// ===========================================

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

// Header component
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
          <Link href="/bots" className="text-surface-300 hover:text-white transition-colors">Products</Link>
          <Link href="/about" className="text-surface-300 hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="text-surface-300 hover:text-white transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/contact">
            <Button>Request Demo</Button>
          </Link>
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
          <span className="text-surface-400">© 2025 Ezra AI. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="text-white font-medium text-sm">Privacy Policy</Link>
          <Link href="/terms" className="text-surface-400 hover:text-surface-300 text-sm">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-display-sm text-white mb-4">Privacy Policy</h1>
            <p className="text-surface-400">Last updated: January 1, 2025</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-8 text-surface-300">
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                <p>
                  Ezra AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                  explains how we collect, use, disclose, and safeguard your information when you use our 
                  platform and services.
                </p>
                <p className="mt-4">
                  By accessing or using Ezra, you agree to the terms of this Privacy Policy. If you do not 
                  agree with the terms of this policy, please do not access or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">2.1 Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account registration information (name, email, company name)</li>
                  <li>Contact form submissions and support requests</li>
                  <li>Payment and billing information</li>
                  <li>Communications with our team</li>
                </ul>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">2.2 POS and Business Data</h3>
                <p>
                  When you connect your POS system to Ezra, we collect transactional and operational data 
                  including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Sales transactions and revenue data</li>
                  <li>Payment method information (aggregated, not individual card numbers)</li>
                  <li>Refund and discount data</li>
                  <li>Employee performance metrics</li>
                  <li>Inventory and service data</li>
                </ul>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">2.3 Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Generate analytics, reports, and insights for your business</li>
                  <li>Detect anomalies and potential loss prevention issues</li>
                  <li>Process transactions and send related information</li>
                  <li>Respond to your comments, questions, and support requests</li>
                  <li>Send you technical notices, updates, and administrative messages</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing and Disclosure</h2>
                <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">4.1 Within Your Organization</h3>
                <p>
                  Data is shared among authorized users within your organization based on role-based access 
                  controls that you configure.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">4.2 Service Providers</h3>
                <p>
                  We may share information with third-party vendors who perform services on our behalf, 
                  such as cloud hosting, analytics, and customer support. These providers are contractually 
                  obligated to protect your data.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">4.3 Legal Requirements</h3>
                <p>
                  We may disclose information if required by law, regulation, legal process, or governmental 
                  request, or to protect the rights, property, or safety of Ezra, our users, or others.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your data, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Encryption of data in transit and at rest (AES-256)</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Role-based access controls and audit logging</li>
                  <li>SOC 2 Type II compliant infrastructure</li>
                  <li>Multi-factor authentication options</li>
                </ul>
                <p className="mt-4">
                  While we strive to protect your information, no method of electronic transmission or 
                  storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
                <p>
                  We retain your data for as long as your account is active or as needed to provide you 
                  services. We will retain and use your information as necessary to comply with our legal 
                  obligations, resolve disputes, and enforce our agreements.
                </p>
                <p className="mt-4">
                  Upon account termination, you may request deletion of your data. Certain data may be 
                  retained for legal or legitimate business purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
                <p>Depending on your location, you may have the following rights:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to or restrict processing of your data</li>
                  <li>Data portability</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at privacy@ezra.ai.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar tracking technologies to collect and track information about 
                  your activity on our platform. You can instruct your browser to refuse all cookies or 
                  indicate when a cookie is being sent. However, some features of our service may not 
                  function properly without cookies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Third-Party Links</h2>
                <p>
                  Our platform may contain links to third-party websites or services. We are not responsible 
                  for the privacy practices of these third parties. We encourage you to review the privacy 
                  policies of any third-party sites you visit.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Children's Privacy</h2>
                <p>
                  Our services are not intended for individuals under the age of 18. We do not knowingly 
                  collect personal information from children. If we learn we have collected personal 
                  information from a child, we will take steps to delete that information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. International Data Transfers</h2>
                <p>
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your data in accordance with 
                  applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                  Your continued use of the service after any changes constitutes acceptance of the new policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="mt-4 p-6 bg-surface-900 rounded-xl border border-surface-800">
                  <p><strong className="text-white">Ezra AI</strong></p>
                  <p className="mt-2">Email: privacy@ezra.ai</p>
                  <p>Address: [Your Business Address]</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
