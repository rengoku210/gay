import React, { useState } from 'react';
import { Maximize2, Image as ImageIcon } from 'lucide-react';
import { PhotoItem, ViewMode } from '../types/gallery';

interface GalleryGridProps {
  photos: PhotoItem[];
  onSelectPhoto: (index: number) => void;
  viewMode: ViewMode;
  onOpenImportModal: () => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  photos,
  onSelectPhoto,
  viewMode,
  onOpenImportModal,
}) => {
  if (photos.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[#121319] text-neutral-400">
          <ImageIcon className="h-8 w-8 text-neutral-500" />
        </div>
        <h3 className="mt-4 font-editorial text-2xl text-neutral-200">No photographs matched your search</h3>
        <p className="mt-2 text-sm text-neutral-500">
          Try clearing your search query or orientation filter, or import new photographs.
        </p>
        <button
          onClick={onOpenImportModal}
          className="mt-6 inline-flex items-center gap-2 rounded-md border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-400/20"
        >
          Import Album ZIP Archive
        </button>
      </div>
    );
  }

  // 1. MASONRY VIEW (Natural aspect ratios in balanced columns)
  if (viewMode === 'masonry') {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {photos.map((photo, index) => (
            <div key={photo.id} className="mb-6 break-inside-avoid">
              <PhotoCard photo={photo} index={index} onClick={() => onSelectPhoto(index)} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. EDITORIAL GRID VIEW (Refined balanced gallery blocks)
  if (viewMode === 'editorial') {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo, index) => (
            <div key={photo.id} className="flex flex-col">
              <PhotoCard photo={photo} index={index} onClick={() => onSelectPhoto(index)} />
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-neutral-500 px-1">
                <span className="truncate max-w-[200px] text-neutral-400">{photo.name}</span>
                <span>{photo.aspectCategory.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. CONTACT SHEET / FILMSTRIP VIEW
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative rounded-sm border border-neutral-800 bg-[#0e1014] p-3 shadow-lg transition-all duration-300 hover:border-amber-400/40"
          >
            {/* Film sprockets aesthetic top */}
            <div className="flex justify-between items-center text-[9px] font-mono text-neutral-600 mb-2 px-1">
              <span>HOMIE FILM</span>
              <span className="text-amber-300/70">#{String(index + 1).padStart(2, '0')}</span>
              <span>ISO 400</span>
            </div>

            <div
              className="relative overflow-hidden cursor-pointer bg-black"
              style={{
                aspectRatio: `${photo.aspectRatio || 9 / 16}`,
              }}
              onClick={() => onSelectPhoto(index)}
            >
              <GalleryImage photo={photo} />
            </div>

            {/* Film strip bottom stamp */}
            <div className="mt-2 text-center text-[10px] font-mono text-neutral-500 truncate">
              {photo.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface PhotoCardProps {
  photo: PhotoItem;
  index: number;
  onClick: () => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-md border border-white/[0.07] bg-[#121319] cursor-pointer transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-black/70"
      style={{
        // Preserve natural aspect ratio space to prevent layout shift
        aspectRatio: `${photo.aspectRatio || 9 / 16}`,
      }}
    >
      {/* Photo Image */}
      <GalleryImage photo={photo} />

      {/* Atmospheric gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Frame number badge (top right, minimal) */}
      <div className="absolute top-3 right-3 text-[10px] font-mono tracking-wider text-white/70 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
        FRAME #{String(index + 1).padStart(2, '0')}
      </div>

      {/* Subtle bottom metadata info revealed on hover */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 transition-transform duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        <p className="font-mono text-xs text-neutral-200 truncate font-medium">
          {photo.name}
        </p>

        <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span>{photo.width ? `${photo.width}×${photo.height}` : 'ORIGINAL RES'}</span>
            <span className="text-neutral-600">·</span>
            <span className="capitalize">{photo.aspectCategory}</span>
          </div>

          <div className="flex items-center gap-1 text-amber-300/90 text-xs">
            <Maximize2 className="h-3 w-3" />
            <span>View</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryImage: React.FC<{ photo: PhotoItem }> = ({ photo }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If user imported, url is valid object URL; if initial photo, try url first then thumbnail fallback
  const imgSrc = hasError ? (photo.thumbnailUrl || photo.url) : (photo.thumbnailUrl || photo.url);

  return (
    <>
      {/* Skeleton / Placeholder state while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#161820] animate-pulse" />
      )}

      <img
        src={imgSrc}
        alt={photo.name}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError && photo.thumbnailUrl) {
            setHasError(true);
          }
        }}
        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
};
