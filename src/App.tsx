import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { AlbumIntro } from './components/AlbumIntro';
import { GalleryGrid } from './components/GalleryGrid';
import { Lightbox } from './components/Lightbox';
import { ZipImportModal } from './components/ZipImportModal';
import { AboutModal } from './components/AboutModal';
import { Footer } from './components/Footer';
import { INITIAL_HOMIE_PHOTOS } from './data/initialPhotos';
import { loadPhotosFromStorage, clearPhotosStorage } from './services/imageStorage';
import { GalleryFilter, PhotoItem, ViewMode, ZipExtractionStats } from './types/gallery';
import { FolderArchive, Upload } from 'lucide-react';

export default function App() {
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_HOMIE_PHOTOS);
  const [hasUserImports, setHasUserImports] = useState<boolean>(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('masonry');
  const [isWindowDragging, setIsWindowDragging] = useState<boolean>(false);

  const [filter, setFilter] = useState<GalleryFilter>({
    searchQuery: '',
    sort: 'default',
    aspectFilter: 'all',
    folderFilter: 'all',
  });

  // Load photos from IndexedDB on startup if available
  useEffect(() => {
    async function initStorage() {
      try {
        const storedPhotos = await loadPhotosFromStorage();
        if (storedPhotos && storedPhotos.length > 0) {
          setPhotos(storedPhotos);
          setHasUserImports(true);
        }
      } catch (err) {
        console.warn('Could not load saved photos from IndexedDB:', err);
      }
    }
    initStorage();
  }, []);

  // Global drag-and-drop listener for dropping ZIP files anywhere on screen
  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        setIsWindowDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setIsWindowDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsWindowDragging(false);
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // Open import modal to process dropped archive
        setIsImportModalOpen(true);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Compute available folders in current collection
  const availableFolders = useMemo(() => {
    const set = new Set<string>();
    photos.forEach((p) => {
      if (p.folder) set.add(p.folder);
    });
    return Array.from(set);
  }, [photos]);

  // Check if collection has both portrait and landscape
  const hasDifferentAspects = useMemo(() => {
    const hasPortrait = photos.some((p) => p.aspectCategory === 'portrait');
    const hasLandscape = photos.some((p) => p.aspectCategory === 'landscape');
    return hasPortrait && hasLandscape;
  }, [photos]);

  // Filter and sort the photo collection
  const filteredPhotos = useMemo(() => {
    let result = [...photos];

    // Search query
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.caption && p.caption.toLowerCase().includes(q)) ||
          (p.folder && p.folder.toLowerCase().includes(q))
      );
    }

    // Aspect filter
    if (filter.aspectFilter !== 'all') {
      result = result.filter((p) => p.aspectCategory === filter.aspectFilter);
    }

    // Folder filter
    if (filter.folderFilter !== 'all') {
      result = result.filter((p) => p.folder === filter.folderFilter);
    }

    // Sorting
    if (filter.sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filter.sort === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (filter.sort === 'date-desc') {
      result.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
    } else if (filter.sort === 'date-asc') {
      result.sort((a, b) => (a.lastModified || 0) - (b.lastModified || 0));
    }

    return result;
  }, [photos, filter]);

  const handleImportComplete = (newPhotos: PhotoItem[], stats: ZipExtractionStats) => {
    setPhotos(newPhotos);
    setHasUserImports(true);
    // Reset filters to show all newly imported photos
    setFilter({
      searchQuery: '',
      sort: 'default',
      aspectFilter: 'all',
      folderFilter: 'all',
    });
  };

  const handleResetArchive = async () => {
    if (window.confirm('Reset gallery back to the initial 13-frame session roll?')) {
      await clearPhotosStorage();
      setPhotos(INITIAL_HOMIE_PHOTOS);
      setHasUserImports(false);
      setFilter({
        searchQuery: '',
        sort: 'default',
        aspectFilter: 'all',
        folderFilter: 'all',
      });
    }
  };

  const handleLoadSessionPhotos = () => {
    setPhotos(INITIAL_HOMIE_PHOTOS);
    setHasUserImports(false);
    setFilter({
      searchQuery: '',
      sort: 'default',
      aspectFilter: 'all',
      folderFilter: 'all',
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#e4e7ec] flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* 
        =======================================================================
        TOP SECTION AND CUSTOM TAGLINE:
        Contains prominent header with exact editable placeholder "our gay is here"
        =======================================================================
      */}
      <Header
        photoCount={photos.length}
        onOpenImport={() => setIsImportModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onResetArchive={handleResetArchive}
        hasUserImports={hasUserImports}
      />

      {/* 
        =======================================================================
        ALBUM INTRODUCTION & CONTROLS:
        Curated introduction, live count, layout toggles, subtle search/sort
        =======================================================================
      */}
      <AlbumIntro
        totalCount={photos.length}
        filteredCount={filteredPhotos.length}
        filter={filter}
        onFilterChange={setFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        availableFolders={availableFolders}
        hasDifferentAspects={hasDifferentAspects}
      />

      {/* 
        =======================================================================
        MAIN PHOTO GALLERY:
        Editorial masonry & balanced views preserving natural aspect ratios
        =======================================================================
      */}
      <main className="flex-1">
        <GalleryGrid
          photos={filteredPhotos}
          onSelectPhoto={(idx) => setSelectedPhotoIndex(idx)}
          viewMode={viewMode}
          onOpenImportModal={() => setIsImportModalOpen(true)}
        />
      </main>

      {/* 
        =======================================================================
        CLOSING SECTION:
        Restrained footer reading "Made of moments." with HOMIE LIBRARY branding
        =======================================================================
      */}
      <Footer />

      {/* 
        =======================================================================
        IMAGE VIEWER (LIGHTBOX):
        Fullscreen modal, arrow keys, Escape, counter, zoom & metadata
        =======================================================================
      */}
      {selectedPhotoIndex !== null && (
        <Lightbox
          photos={filteredPhotos}
          currentIndex={selectedPhotoIndex}
          isOpen={selectedPhotoIndex !== null}
          onClose={() => setSelectedPhotoIndex(null)}
          onNavigate={(newIdx) => setSelectedPhotoIndex(newIdx)}
        />
      )}

      {/* 
        =======================================================================
        ZIP IMPORT MODAL:
        Extracts ZIP files client-side, creates thumbnails, saves to IndexedDB
        =======================================================================
      */}
      <ZipImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
        onLoadSessionPhotos={handleLoadSessionPhotos}
      />

      {/* 
        =======================================================================
        ABOUT MODAL:
        Explains HOMIE LIBRARY, privacy preservation & tagline customization
        =======================================================================
      */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* 
        =======================================================================
        FULLSCREEN DROP OVERLAY (when user drags any ZIP file over the window)
        =======================================================================
      */}
      {isWindowDragging && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md pointer-events-none">
          <div className="rounded-xl border-2 border-dashed border-amber-400/80 bg-amber-400/10 p-12 text-center max-w-lg mx-4">
            <Upload className="mx-auto h-16 w-16 text-amber-400 animate-bounce" />
            <h3 className="mt-4 font-display text-2xl uppercase tracking-wider text-white">
              Drop ZIP Album to Import
            </h3>
            <p className="mt-2 text-sm text-neutral-300">
              Release your ZIP archive to automatically unpack and render in HOMIE LIBRARY.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
