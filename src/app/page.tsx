import Link from 'next/link';
import {
  Ship,
  UserPlus,
  LogIn,
  LayoutDashboard,
  ShieldCheck,
  ArrowRight,
  Anchor,
  Globe2,
  FileCheck2,
  Layers,
  Container,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/10">
          <Anchor className="w-4 h-4 text-cyan-400" />
          <span>Yang Ming Marine Transport Corporation</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Global Maritime Fleet & <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            Port Operations Portal
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Centralized terminal management system for verified container carriers, commercial vessels, and intermodal freight partners across our global shipping network.
        </p>
      </div>

      {/* 3 Core Operational Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Module 1: Carrier Onboarding */}
        <Link
          href="/register"
          className="glass-panel rounded-3xl p-6 hover:border-cyan-400/50 transition-all duration-300 group flex flex-col justify-between hover:translate-y-[-4px] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <UserPlus className="w-6 h-6" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
                PORTAL-REG
              </span>
              <span className="text-[10px] uppercase font-bold text-cyan-400">Carrier Onboarding</span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Partner Registration</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Register commercial shipping lines, freight forwarders, and logistics operators with required port operating licenses and 2FA verification.
            </p>

            <ul className="text-xs text-slate-300 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Mandatory operating license upload</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Two-Factor Authentication (2FA) enforced</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Authorized berth booking access</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-cyan-300 group-hover:text-cyan-200">
            <span>Access Registration</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </Link>

        {/* Module 2: Partner Login */}
        <Link
          href="/login"
          className="glass-panel rounded-3xl p-6 hover:border-blue-400/50 transition-all duration-300 group flex flex-col justify-between hover:translate-y-[-4px] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <LogIn className="w-6 h-6" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold text-blue-300 bg-blue-950/70 px-2 py-0.5 rounded border border-blue-500/30">
                PORTAL-AUTH
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-400">Secure Access</span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Carrier Sign In</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Secure authentication for verified maritime partners to review container bookings, voyage schedules, and cargo status updates.
            </p>

            <ul className="text-xs text-slate-300 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>Encrypted maritime credential validation</span>
              </li>
              <li className="flex items-center gap-2">
                <Container className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>Real-time container manifest tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>Multi-terminal operations dispatch</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-blue-300 group-hover:text-blue-200">
            <span>Sign In to Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </Link>

        {/* Module 3: Admin Console */}
        <Link
          href="/admin"
          className="glass-panel rounded-3xl p-6 hover:border-emerald-400/50 transition-all duration-300 group flex flex-col justify-between hover:translate-y-[-4px] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-6 h-6" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                PORT-OPS
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Port Authority</span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Port Registry Console</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Real-time directory of verified carriers with operating licenses, company profiles, and direct document inspection tools.
            </p>

            <ul className="text-xs text-slate-300 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Live registry of verified carriers</span>
              </li>
              <li className="flex items-center gap-2">
                <Ship className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Instant license & document verification</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Port clearance and compliance audit</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-300 group-hover:text-emerald-200">
            <span>Open Registry</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Real Enterprise Assurance Bar */}
      <div className="w-full glass-panel-subtle rounded-2xl p-5 border border-cyan-500/20 text-xs text-slate-300 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">International Maritime Security & Customs Compliance</h3>
            <p className="text-slate-300 text-xs mt-0.5">
              Operating under ISPS Code (International Ship and Port Facility Security) & C-TPAT Certification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 font-mono">
            Kaohsiung • Keelung • Taipei
          </span>
        </div>
      </div>
    </div>
  );
}
