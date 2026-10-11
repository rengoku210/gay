import React from 'react';
import { X, ShieldCheck, HardDrive, Edit3, Camera } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-lg border border-white/10 bg-[#12141a] p-6 sm:p-8 shadow-2xl text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-display text-2xl tracking-wider text-neutral-100 uppercase">
              {SITE_CONFIG.brandName}
            </h3>
            <p className="font-editorial text-sm text-neutral-400 italic mt-0.5">
              {SITE_CONFIG.supportingText}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-5 text-sm text-neutral-300 leading-relaxed font-sans">
          <p>
            {SITE_CONFIG.archiveDescription}
          </p>

          <div className="rounded-md border border-white/5 bg-[#171922] p-4 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Camera className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-200">Preserved Aspect Ratios:</span>
                <p className="text-neutral-400 mt-0.5">
                  Photographs are displayed without cropping, forcing, or arbitrary grid squeezing. Portrait, landscape, and square moments retain their exact natural proportions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-200">Local Privacy & Persistence:</span>
                <p className="text-neutral-400 mt-0.5">
                  When you import your ZIP archive, all files are extracted directly in your browser. Blobs are safely cached in IndexedDB on your device.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Edit3 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-200">Custom Tagline Setting:</span>
                <p className="text-neutral-400 mt-0.5">
                  The top tagline <code className="text-amber-300">"{SITE_CONFIG.tagline}"</code> is central in <code className="text-neutral-300">src/config/siteConfig.ts</code>. Change it anytime to personalize your header.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-white/10 px-4 py-2 text-xs font-medium text-neutral-200 hover:bg-white/20 transition-colors"
          >
            Close Archive Notes
          </button>
        </div>
      </div>
    </div>
  );
};
