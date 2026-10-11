import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Info, 
  Download, 
  RotateCw,
  Folder,
  Calendar,
  Maximize,
  HardDrive
} from 'lucide-react';
import { PhotoItem } from '../types/gallery';

interface LightboxProps {
  photos: PhotoItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const currentPhoto = photos[currentIndex];
  const [isZoomed, setIsZoomed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Touch swipe support
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const handlePrev = useCallback(() => {
    if (photos.length <= 1) return;
    setIsZoomed(false);
    setIsLoading(true);
    setImageError(false);
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (photos.length <= 1) return;
    setIsZoomed(false);
    setIsLoading(true);
    setImageError(false);
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'i' || e.key === 'I') {
        setShowInfo((prev) => !prev);
      } else if (e.key === 'z' || e.key === 'Z') {
        setIsZoomed((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Reset states when photo changes
  useEffect(() => {
    setIsZoomed(false);
    setIsLoading(true);
    setImageError(false);
  }, [currentIndex]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  if (!isOpen || !currentPhoto) return null;

  const displaySrc = imageError 
    ? (currentPhoto.thumbnailUrl || currentPhoto.url)
    : (currentPhoto.url || currentPhoto.thumbnailUrl);

  const formattedSize = currentPhoto.sizeBytes 
    ? (currentPhoto.sizeBytes / (1024 * 1024) > 1 
        ? `${(currentPhoto.sizeBytes / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(currentPhoto.sizeBytes / 1024)} KB`)
    : undefined;

  const formattedDate = currentPhoto.lastModified 
    ? new Date(currentPhoto.lastModified).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none transition-opacity duration-300"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph ${currentIndex + 1} of ${photos.length}`}
    >
      {/* Top Bar: Position Indicator, Controls, Close */}
      <div className="absolute top-0 inset-x-0 z-50 flex h-16 items-center justify-between px-4 sm:px-6 bg-gradient-to-b from-black/80 to-transparent">
        {/* Position counter: e.g. "4 / 13" */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm tracking-widest text-amber-200/90 font-medium">
            {currentIndex + 1} <span className="text-neutral-600">/</span> {photos.length}
          </span>
          <span className="hidden sm:inline-block text-neutral-600" aria-hidden="true">·</span>
          <span className="hidden sm:inline-block font-mono text-xs text-neutral-400 truncate max-w-[280px]">
            {currentPhoto.name}
          </span>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-neutral-300">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="rounded p-2 hover:bg-white/10 hover:text-white transition-colors"
            title={isZoomed ? 'Fit to screen (Z)' : 'Zoom in (Z)'}
            aria-label="Toggle Zoom"
          >
            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`rounded p-2 transition-colors ${
              showInfo ? 'bg-amber-400/20 text-amber-200' : 'hover:bg-white/10 hover:text-white'
            }`}
            title="Photograph Info (I)"
            aria-label="Toggle Info"
          >
            <Info className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-white/20 mx-1" aria-hidden="true" />

          <button
            onClick={onClose}
            className="rounded p-2 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
            title="Close viewer (Escape)"
            aria-label="Close Lightbox"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons: Prev & Next */}
      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 sm:left-4 z-40 rounded-full p-2.5 text-neutral-400 bg-black/40 hover:bg-black/80 hover:text-white border border-white/10 transition-colors backdrop-blur-sm"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 sm:right-4 z-40 rounded-full p-2.5 text-neutral-400 bg-black/40 hover:bg-black/80 hover:text-white border border-white/10 transition-colors backdrop-blur-sm"
            aria-label="Next photograph"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Backdrop click area */}
      <div 
        className="absolute inset-0 cursor-default" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Stage Image Viewer */}
      <div 
        className="relative z-30 max-h-[85vh] max-w-[90vw] flex items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
          </div>
        )}

        <img
          src={displaySrc}
          alt={currentPhoto.caption || currentPhoto.name}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            if (!imageError && currentPhoto.thumbnailUrl) {
              setImageError(true);
            }
            setIsLoading(false);
          }}
          className={`max-h-[85vh] max-w-[90vw] object-contain transition-all duration-300 rounded-sm shadow-2xl ${
            isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
          } ${isLoading ? 'opacity-30' : 'opacity-100'}`}
          onClick={() => setIsZoomed(!isZoomed)}
        />
      </div>

      {/* Side Info Drawer (Toggleable) */}
      {showInfo && (
        <aside 
          className="absolute right-4 top-20 z-50 w-80 rounded-md border border-white/15 bg-[#121319]/95 p-5 text-neutral-200 shadow-2xl backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-amber-300/80">
              Frame Metadata
            </h4>
            <button
              onClick={() => setShowInfo(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block">Filename</span>
              <p className="text-neutral-200 break-all select-all mt-0.5">{currentPhoto.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Aspect Ratio</span>
                <p className="text-neutral-200 capitalize mt-0.5">{currentPhoto.aspectCategory}</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Orientation</span>
                <p className="text-neutral-200 mt-0.5">
                  {currentPhoto.aspectRatio > 1 ? 'Landscape' : 'Portrait (9:16)'}
                </p>
              </div>
            </div>

            {currentPhoto.width && currentPhoto.height && (
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Resolution</span>
                <p className="text-neutral-200 mt-0.5">{currentPhoto.width} × {currentPhoto.height} px</p>
              </div>
            )}

            {formattedSize && (
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">File Size</span>
                <p className="text-neutral-200 mt-0.5">{formattedSize}</p>
              </div>
            )}

            {formattedDate && (
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Recorded</span>
                <p className="text-neutral-200 mt-0.5">{formattedDate}</p>
              </div>
            )}

            {currentPhoto.folder && (
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Album Folder</span>
                <p className="text-neutral-200 mt-0.5">{currentPhoto.folder}</p>
              </div>
            )}

            {currentPhoto.caption && (
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">Caption</span>
                <p className="text-neutral-300 font-sans italic mt-0.5">{currentPhoto.caption}</p>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Bottom Minimal Caption & Controls Guide */}
      <div className="absolute bottom-4 inset-x-0 z-40 flex items-center justify-between px-6 text-[11px] font-mono text-neutral-500 pointer-events-none">
        <div className="hidden sm:block">
          Use <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-neutral-300">←</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-neutral-300">→</kbd> to browse · <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-neutral-300">ESC</kbd> to exit
        </div>
        <div className="mx-auto sm:mx-0 text-center text-neutral-400">
          HOMIE LIBRARY ARCHIVE
        </div>
      </div>
    </div>
  );
};
