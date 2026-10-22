import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Background from '@/components/Background';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Yang Ming Marine Transport | Partner Portal',
  description:
    'Full-Stack logistics portal with 2FA partner onboarding, required document verification, and real-time admin registry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative text-slate-100 selection:bg-cyan-500 selection:text-white">
        {/* Full-screen Global Shipping Port Background */}
        <Background />

        {/* Global Navigation Bar */}
        <Navbar />

        {/* Main Application Content */}
        <main className="flex-1 flex flex-col relative z-10">{children}</main>

        {/* Footer */}
        <footer className="w-full py-4 px-6 text-center text-xs text-slate-300 relative z-10 border-t border-white/5 bg-slate-950/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 Yang Ming Marine Transport Corp. All rights reserved.</span>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>Port of Kaohsiung & Keelung Operations</span>
              <span>•</span>
              <span className="text-cyan-300 font-mono">2FA Enforced</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
