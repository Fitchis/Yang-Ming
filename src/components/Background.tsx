'use client';

import React, { useState } from 'react';

// Unsplash Shipping Port containing sea, cargo vessel, colorful containers, and coastal green trees
const PRIMARY_PORT_IMAGE =
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2560&q=80';

// High-reliability secondary shipping port with sea, vessel, container yard, and green landscape
const FALLBACK_PORT_IMAGE =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2560&q=80';

export default function Background() {
  const [imgSrc, setImgSrc] = useState(PRIMARY_PORT_IMAGE);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-50 overflow-hidden"
      aria-hidden="true"
    >
      {/* Background Image Layer */}
      {!hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt="Yang Ming Shipping Port Terminal with Sea, Vessel, Containers, and Green Trees"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] transition-opacity duration-1000 scale-[1.02]"
          onError={() => {
            if (imgSrc === PRIMARY_PORT_IMAGE) {
              setImgSrc(FALLBACK_PORT_IMAGE);
            } else {
              setHasError(true);
            }
          }}
        />
      ) : (
        /* CSS Maritime Harbor Fallback */
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950" />
      )}

      {/* Atmospheric Overlays for optimal Glassmorphism contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-slate-950/60" />

      {/* Decorative ambient port lighting glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-soft-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-[28rem] h-[28rem] bg-blue-600/10 rounded-full blur-3xl animate-soft-glow" />
    </div>
  );
}
