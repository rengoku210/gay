import React from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#090a0d] py-14 text-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HOMIE LIBRARY Title */}
        <h2 className="font-display text-xl sm:text-2xl tracking-[0.2em] uppercase text-neutral-300 font-medium">
          {SITE_CONFIG.brandName}
        </h2>

        {/* Restrained line: "Made of moments." */}
        <p className="mt-2 font-editorial text-base text-neutral-500 italic">
          {SITE_CONFIG.footerText}
        </p>

        {/* Quiet archival stamp */}
        <div className="mt-8 flex items-center justify-center gap-3 text-[11px] font-mono text-neutral-600">
          <span>ALL RIGHTS RESERVED</span>
          <span aria-hidden="true">·</span>
          <span>DIGITAL PHOTOGRAPHY VAULT</span>
          <span aria-hidden="true">·</span>
          <span>HOMIE ARCHIVE</span>
        </div>
      </div>
    </footer>
  );
};
