'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Ship,
  UserPlus,
  LogIn,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Building2,
  Anchor,
} from 'lucide-react';
import { useSession } from '@/lib/auth';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isAuthenticated, loading, logout } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };


  const isUserLoggedIn = mounted && isAuthenticated;

  const navLinks = isUserLoggedIn
    ? [
      { href: '/register', label: 'Carrier Registration', icon: UserPlus },
      { href: '/admin', label: 'Port Registry', icon: LayoutDashboard },
    ]
    : [
      { href: '/register', label: 'Carrier Registration', icon: UserPlus },
      { href: '/login', label: 'Carrier Sign In', icon: LogIn },
    ];

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5">
      <nav className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl transition-all">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg px-1 py-0.5"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300 border border-white/20">
            <img src="/favicon.ico" alt="Logo" className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base sm:text-lg bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent">
                YANG MING
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Port Ops
              </span>
            </div>
            <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
              Maritime Transport Portal
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-cyan-500/25 text-white border border-cyan-400/50 shadow-md shadow-cyan-500/20'
                    : 'text-slate-200 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-300'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* If user is logged in, show authenticated Carrier badge & Sign Out button */}
          {isUserLoggedIn && session?.user && (
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-white/15">
              <div
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-200"
                title={`Signed in as ${session.user.companyName} (${session.user.email})`}
              >
                <Building2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="max-w-[130px] truncate font-medium">
                  {session.user.companyName || session.user.email}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-red-300 hover:bg-red-500/15 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
                title="Sign out of Yang Ming Port Console"
              >
                <LogOut className="w-4 h-4 text-slate-400 hover:text-red-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-1.5 ml-2 pl-2 sm:ml-3 sm:pl-3 border-l border-white/10 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>2FA Enforced</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
