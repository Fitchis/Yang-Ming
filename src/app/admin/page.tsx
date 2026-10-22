'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Mail,
  FileText,
  Search,
  Plus,
  RotateCcw,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Users,
  HardDrive,
  Ship,
  DownloadCloud,
} from 'lucide-react';
import { RegisteredUser } from '@/types';
import { getRegisteredUsers, deleteRegisteredUser } from '@/lib/storage';
import FilePreviewModal from '@/components/FilePreviewModal';

export default function AdminPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserForFile, setSelectedUserForFile] = useState<RegisteredUser | null>(null);
  const [mounted, setMounted] = useState(false);

  const [source, setSource] = useState<string>('Supabase DB');

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users) && data.users.length > 0) {
        setUsers(data.users);
        setSource('Supabase PostgreSQL');
        return;
      }
    } catch (err) {
      console.warn('API fetch skipped, reading local storage:', err);
    }

    const list = getRegisteredUsers();
    setUsers(list);
    setSource('Local Cache');
  };

  useEffect(() => {
    setMounted(true);
    loadUsers();

    const handleStorageChange = () => {
      loadUsers();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('yangming_users_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('yangming_users_updated', handleStorageChange);
    };
  }, []);

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.companyName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.fileName.toLowerCase().includes(term)
    );
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove ${name} from active port carrier registry?`)) {
      try {
        await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Delete API error:', err);
      }
      const updated = deleteRegisteredUser(id);
      setUsers(updated);
    }
  };

  const handleExportCsv = () => {
    const header = 'Carrier Name,Email (User ID),Document,Status,Registration Date\n';
    const rows = users.map(
      (u) =>
        `"${u.companyName}","${u.email}","${u.fileName}","${u.status}","${new Date(u.createdAt).toISOString()}"`
    );
    const csvContent = header + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yangming_carriers_manifest_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-3xl text-white flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Connecting to Yang Ming Port Registry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-2">
            <Ship className="w-3.5 h-3.5" />
            <span>Yang Ming Port Authority Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Carrier & Partner Registry
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {source}
            </span>
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Official operational registry of certified shipping lines, freight forwarders, and logistics operators with verified licenses.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap relative z-10">
          <button
            onClick={handleExportCsv}
            className="glass-button-secondary px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 text-slate-200 hover:text-white"
            title="Export carrier manifest"
          >
            <DownloadCloud className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Export Manifest</span>
          </button>

          <Link
            href="/register"
            className="glass-button-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Carrier</span>
          </Link>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Registered Carriers
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {users.length}
            </h3>
            <p className="text-[11px] text-cyan-300 mt-0.5">
              Certified commercial operators
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Operating Licenses
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {users.length}
            </h3>
            <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>100% Documentation Clearance</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Active Port Berths
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              12 Berths
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Port of Kaohsiung & Keelung
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Ship className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Port Security Standard
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              ISPS Code
            </h3>
            <p className="text-[11px] text-emerald-400 mt-0.5">
              Two-Factor Authentication Enforced
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
            <HardDrive className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        {/* Table Controls */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40">
          <div className="w-full sm:w-80 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by carrier name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div className="text-xs text-slate-300 font-medium self-end sm:self-auto">
            Showing <span className="text-white font-bold">{filteredUsers.length}</span> certified carrier{filteredUsers.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-300">
                <th scope="col" className="px-6 py-4 font-semibold">
                  Company Name
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  User ID (Email)
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">
                  Document
                </th>
                <th scope="col" className="px-6 py-4 font-semibold hidden md:table-cell">
                  Registered On
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const initials = user.companyName
                    .split(' ')
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase();

                  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-white/5 transition-colors duration-150 group"
                    >
                      {/* Column 1: Company Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/30 border border-cyan-400/30 flex items-center justify-center font-bold text-cyan-300 text-xs shadow-inner flex-shrink-0">
                            {initials || <Building2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-cyan-200 transition-colors">
                              {user.companyName}
                            </div>
                            <span className="text-[11px] text-slate-400 block font-mono">
                              REF: {user.id.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: User ID (Email) */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-200">
                          <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <span className="font-mono text-xs sm:text-sm text-cyan-100 font-medium">
                            {user.email}
                          </span>
                        </div>
                      </td>

                      {/* Column 3: Document (Mock 'View File' Button) */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedUserForFile(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-semibold transition-all shadow-md hover:shadow-cyan-500/25 cursor-pointer"
                          title={`View file: ${user.fileName}`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View File</span>
                        </button>
                      </td>

                      {/* Column 4: Registered On */}
                      <td className="px-6 py-4 hidden md:table-cell text-slate-300 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* Column 5: Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedUserForFile(user)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors"
                            title="Inspect documentation"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id, user.companyName)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Revoke carrier registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-slate-400">
                        <Search className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-white">No registered carriers found</p>
                      <p className="text-xs text-slate-400">
                        {searchTerm
                          ? `No matches found for "${searchTerm}".`
                          : 'The carrier registry is currently empty.'}
                      </p>
                      <Link
                        href="/register"
                        className="glass-button-primary px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-2"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Register First Carrier</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <FilePreviewModal
        user={selectedUserForFile}
        onClose={() => setSelectedUserForFile(null)}
      />
    </div>
  );
}
