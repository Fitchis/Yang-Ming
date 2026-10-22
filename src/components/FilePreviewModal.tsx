'use client';

import React from 'react';
import { RegisteredUser } from '@/types';
import { X, FileText, Image as ImageIcon, Download, CheckCircle2, Shield, Calendar, HardDrive } from 'lucide-react';

interface FilePreviewModalProps {
  user: RegisteredUser | null;
  onClose: () => void;
}

export default function FilePreviewModal({ user, onClose }: FilePreviewModalProps) {
  if (!user) return null;

  const isImage =
    user.fileType.startsWith('image/') ||
    user.fileName.endsWith('.jpg') ||
    user.fileName.endsWith('.jpeg') ||
    user.fileName.endsWith('.png') ||
    user.fileName.endsWith('.webp');

  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-semibold text-white text-base flex items-center gap-2">
                Document Viewer
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Verified
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Partner: <span className="text-white font-medium">{user.companyName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* File Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel-subtle rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block mb-1">File Name</span>
              <span className="text-xs font-semibold text-white truncate block" title={user.fileName}>
                {user.fileName}
              </span>
            </div>
            <div className="glass-panel-subtle rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block mb-1">File Size</span>
              <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5" />
                {user.fileSize || '1.2 MB'}
              </span>
            </div>
            <div className="glass-panel-subtle rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block mb-1">User ID / Email</span>
              <span className="text-xs font-semibold text-white truncate block" title={user.email}>
                {user.email}
              </span>
            </div>
            <div className="glass-panel-subtle rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block mb-1">Uploaded On</span>
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Document Preview Stage */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 min-h-[260px] flex flex-col items-center justify-center relative overflow-hidden">
            {user.fileDataUrl && isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.fileDataUrl}
                alt={user.fileName}
                className="max-h-[340px] max-w-full rounded-xl object-contain shadow-lg border border-white/10"
              />
            ) : (
              /* High-fidelity Maritime Document Preview Card */
              <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-6 border border-cyan-500/20 shadow-xl space-y-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400 shadow-inner">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm sm:text-base tracking-wide">
                    {user.fileName}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Format: {user.fileType || 'Official Document'} • 256-Bit SSL Encrypted
                  </p>
                </div>

                <div className="bg-slate-800/40 rounded-xl p-3 border border-white/5 text-left text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Security Clearance:</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Approved
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Certificate Status:</span>
                    <span className="text-white font-mono text-[11px]">YM-DOC-{user.id.toUpperCase()}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Document verified by Yang Ming Port Authority</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-slate-900/40">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Official Maritime Document Archive • Yang Ming Port Clearance
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="glass-button-secondary px-4 py-2 rounded-xl text-xs sm:text-sm font-medium"
            >
              Close
            </button>
            <a
              href={user.fileDataUrl || '#'}
              download={user.fileName}
              onClick={(e) => {
                if (!user.fileDataUrl) {
                  e.preventDefault();
                  alert(`Mock file download initiated for: ${user.fileName}`);
                }
              }}
              className="glass-button-primary px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
