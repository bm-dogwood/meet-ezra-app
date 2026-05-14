'use client';

// ===========================================
// EZRA PORTAL - Terms of Service Page
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
          <Link href="/privacy" className="text-surface-400 hover:text-surface-300 text-sm">Privacy Policy</Link>
          <Link href="/terms" className="text-white font-medium text-sm">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-display-sm text-white mb-4">Terms of Service</h1>
            <p className="text-surface-400">Last updated: January 1, 2025</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-8 text-surface-300">
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using the Ezra AI platform and services ("Services"), you agree to be 
                  bound by these Terms of Service ("Terms"). If you are using the Services on behalf of 
                  an organization, you agree to these Terms on behalf of that organization and represent 
                  that you have authority to do so.
                </p>
                <p className="mt-4">
                  If you do not agree to these Terms, you may not access or use our Services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Services</h2>
                <p>
                  Ezra AI provides a managed AI automation platform for franchise operations, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>POS system integration and data aggregation</li>
                  <li>Sales analytics and reporting dashboards</li>
                  <li>Loss prevention monitoring and alerts</li>
                  <li>Operational insights and AI-powered recommendations</li>
                  <li>Multi-location performance tracking</li>
                </ul>
                <p className="mt-4">
                  The specific features available to you depend on your subscription plan and agreement 
                  with Ezra AI.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration</h2>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">3.1 Account Creation</h3>
                <p>
                  Access to Ezra is by invitation only. Accounts are provisioned by our team after 
                  completion of the onboarding process. You agree to provide accurate, current, and 
                  complete information during registration.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">3.2 Account Security</h3>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials 
                  and for all activities that occur under your account. You must immediately notify us 
                  of any unauthorized use of your account or any other security breach.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">3.3 User Management</h3>
                <p>
                  Account administrators are responsible for managing user access within their organization 
                  and ensuring users comply with these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Use the Services for any unlawful purpose or in violation of any applicable laws</li>
                  <li>Attempt to gain unauthorized access to any part of the Services or related systems</li>
                  <li>Interfere with or disrupt the integrity or performance of the Services</li>
                  <li>Reverse engineer, decompile, or disassemble any part of the Services</li>
                  <li>Use the Services to transmit malware, viruses, or other malicious code</li>
                  <li>Share account credentials or allow unauthorized users to access your account</li>
                  <li>Use automated systems to access the Services without our prior written consent</li>
                  <li>Resell, sublicense, or otherwise provide access to the Services to third parties</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data and Privacy</h2>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">5.1 Your Data</h3>
                <p>
                  You retain ownership of all data you provide or that is collected through your connected 
                  POS systems ("Customer Data"). You grant Ezra AI a limited license to use Customer Data 
                  solely to provide and improve the Services.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">5.2 Data Processing</h3>
                <p>
                  Our collection and use of data is governed by our Privacy Policy. By using the Services, 
                  you consent to our data practices as described in the Privacy Policy.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">5.3 Data Security</h3>
                <p>
                  We implement industry-standard security measures to protect your data. However, you are 
                  responsible for maintaining the security of your own systems and credentials.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">6.1 Ezra AI Property</h3>
                <p>
                  The Services, including all software, algorithms, designs, trademarks, and documentation, 
                  are owned by Ezra AI or its licensors. Nothing in these Terms grants you any right to 
                  use Ezra AI's trademarks, logos, or branding without prior written consent.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">6.2 Feedback</h3>
                <p>
                  If you provide feedback, suggestions, or ideas about the Services, you grant Ezra AI a 
                  perpetual, royalty-free license to use and incorporate such feedback into our Services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Payment Terms</h2>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">7.1 Fees</h3>
                <p>
                  You agree to pay all fees specified in your service agreement. Fees are non-refundable 
                  except as expressly stated in your agreement or required by law.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">7.2 Payment</h3>
                <p>
                  Payment terms are specified in your service agreement. Failure to pay may result in 
                  suspension or termination of your access to the Services.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">7.3 Taxes</h3>
                <p>
                  You are responsible for all applicable taxes, except for taxes on Ezra AI's income.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Service Level and Support</h2>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">8.1 Availability</h3>
                <p>
                  We strive to maintain high availability of the Services but do not guarantee uninterrupted 
                  access. Specific uptime commitments, if any, are detailed in your service agreement.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">8.2 Support</h3>
                <p>
                  Support is provided according to your service plan. As a managed service, our team works 
                  directly with you to address issues and optimize your implementation.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">8.3 Maintenance</h3>
                <p>
                  We may perform scheduled maintenance that temporarily affects availability. We will 
                  provide reasonable advance notice when possible.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Disclaimers</h2>
                <p>
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF 
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p className="mt-4">
                  We do not warrant that the Services will be uninterrupted, error-free, or completely 
                  secure. The insights and recommendations provided by the Services are for informational 
                  purposes and should not be relied upon as the sole basis for business decisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Limitation of Liability</h2>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, EZRA AI SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, 
                  DATA, OR BUSINESS OPPORTUNITIES ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES.
                </p>
                <p className="mt-4">
                  OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE 
                  SERVICES SHALL NOT EXCEED THE AMOUNTS PAID BY YOU TO EZRA AI IN THE TWELVE (12) MONTHS 
                  PRECEDING THE CLAIM.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless Ezra AI and its officers, directors, 
                  employees, and agents from any claims, damages, losses, or expenses (including reasonable 
                  attorneys' fees) arising out of:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Your use of the Services</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any applicable laws or regulations</li>
                  <li>Any data you submit through the Services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Term and Termination</h2>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">12.1 Term</h3>
                <p>
                  These Terms remain in effect until terminated. The term of your subscription is specified 
                  in your service agreement.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">12.2 Termination by You</h3>
                <p>
                  You may terminate your account according to the terms of your service agreement. Certain 
                  obligations, including payment for services rendered, survive termination.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">12.3 Termination by Us</h3>
                <p>
                  We may suspend or terminate your access to the Services immediately if you breach these 
                  Terms, fail to pay fees, or if required by law.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">12.4 Effect of Termination</h3>
                <p>
                  Upon termination, your right to access the Services ends. You may request export of your 
                  Customer Data within 30 days of termination. We may delete your data after this period.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">13. Modifications to Terms</h2>
                <p>
                  We may modify these Terms at any time. We will provide notice of material changes through 
                  the Services or by email. Your continued use of the Services after changes become effective 
                  constitutes acceptance of the modified Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">14. General Provisions</h2>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">14.1 Governing Law</h3>
                <p>
                  These Terms are governed by the laws of the State of Delaware, without regard to conflict 
                  of law principles.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">14.2 Dispute Resolution</h3>
                <p>
                  Any disputes arising from these Terms shall be resolved through binding arbitration in 
                  accordance with the rules of the American Arbitration Association, except that either 
                  party may seek injunctive relief in any court of competent jurisdiction.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">14.3 Entire Agreement</h3>
                <p>
                  These Terms, together with your service agreement and Privacy Policy, constitute the 
                  entire agreement between you and Ezra AI regarding the Services.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">14.4 Severability</h3>
                <p>
                  If any provision of these Terms is found unenforceable, the remaining provisions will 
                  continue in full force and effect.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">14.5 Assignment</h3>
                <p>
                  You may not assign these Terms without our prior written consent. We may assign these 
                  Terms in connection with a merger, acquisition, or sale of assets.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">14.6 Waiver</h3>
                <p>
                  Our failure to enforce any right or provision of these Terms shall not constitute a 
                  waiver of such right or provision.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">15. Contact Information</h2>
                <p>
                  For questions about these Terms, please contact us:
                </p>
                <div className="mt-4 p-6 bg-surface-900 rounded-xl border border-surface-800">
                  <p><strong className="text-white">Ezra AI</strong></p>
                  <p className="mt-2">Email: legal@ezra.ai</p>
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
