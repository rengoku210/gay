import React from 'react';
import { Upload, Sparkles, FolderArchive, Info, RefreshCw } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface HeaderProps {
  photoCount: number;
  onOpenImport: () => void;
  onOpenAbout: () => void;
  onResetArchive?: () => void;
  hasUserImports: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  photoCount,
  onOpenImport,
  onOpenAbout,
  onResetArchive,
  hasUserImports,
}) => {
  return (
    <header className="relative w-full border-b border-white/[0.07] bg-[#0c0d10] overflow-hidden">
      {/* Subtle atmospheric darkroom glow */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(226,184,121,0.12),rgba(12,13,16,0))]" 
        aria-hidden="true" 
      />

      {/* Top utility bar */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between text-xs tracking-wider uppercase text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="font-mono text-neutral-500 tracking-widest text-[11px]">ARCHIVE VOL. 01</span>
            <span className="text-neutral-700" aria-hidden="true">/</span>
            <span className="text-neutral-400 font-sans tracking-wider hidden sm:inline">PERSONAL PHOTOGRAPHY VAULT</span>
          </div>

          <nav className="flex items-center gap-6">
            <button
              onClick={onOpenAbout}
              className="group flex items-center gap-1.5 py-1 text-neutral-400 transition-colors hover:text-neutral-100"
            >
              <Info className="h-3.5 w-3.5 text-neutral-500 transition-colors group-hover:text-amber-300/80" />
              <span className="border-b border-transparent group-hover:border-neutral-400">About Homie</span>
            </button>

            <button
              onClick={onOpenImport}
              className="group flex items-center gap-1.5 py-1 text-amber-200/90 transition-colors hover:text-amber-100"
              title="Import ZIP archive or loose image files"
            >
              <Upload className="h-3.5 w-3.5 text-amber-400/80 transition-transform group-hover:-translate-y-0.5" />
              <span className="border-b border-amber-400/40 group-hover:border-amber-300">Import ZIP Album</span>
            </button>

            {hasUserImports && onResetArchive && (
              <button
                onClick={onResetArchive}
                className="group hidden sm:flex items-center gap-1 text-neutral-500 hover:text-red-400 transition-colors"
                title="Restore default roll"
              >
                <RefreshCw className="h-3 w-3" />
                <span className="text-[10px]">Reset</span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* 
        =======================================================================
        SECTION 1: THE PROMINENT TAGLINE & HOMIE LIBRARY HERO
        Exact placeholder required: "our gay is here"
        =======================================================================
      */}
      <div className="relative mx-auto max-w-5xl px-4 pt-12 pb-16 sm:pt-16 sm:pb-20 text-center">
        
        {/* Custom Tagline Placeholder with subtle entrance animation */}
        <div className="mb-6 inline-block">
          <div className="relative px-6 py-2">
            <p className="font-editorial text-xl sm:text-2xl md:text-3xl italic tracking-wide text-amber-200/90 font-light select-none">
              “{SITE_CONFIG.tagline}”
            </p>
            {/* Subtle decorative horizontal whisper line */}
            <div className="mx-auto mt-2 h-px w-16 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          </div>
        </div>

        {/* Main Title: HOMIE LIBRARY */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[0.18em] text-[#f4ede2] uppercase drop-shadow-sm">
          {SITE_CONFIG.brandName}
        </h1>

        {/* Supporting Line */}
        <p className="mx-auto mt-4 max-w-xl font-editorial text-lg sm:text-xl text-neutral-400 italic font-normal">
          {SITE_CONFIG.supportingText}
        </p>

        {/* Metadata Bar (Anti-Slop Zero Pill Discipline: pure unboxed typographic text) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-neutral-500 font-mono">
          <span>{photoCount} {photoCount === 1 ? 'Photograph' : 'Photographs'} Curated</span>
          <span className="text-neutral-700" aria-hidden="true">·</span>
          <span>Preserved Aspect Ratios</span>
          <span className="text-neutral-700" aria-hidden="true">·</span>
          <span>Zero Distortion Archive</span>
          {hasUserImports && (
            <>
              <span className="text-neutral-700" aria-hidden="true">·</span>
              <span className="text-amber-400/80">ZIP Archive Loaded</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
