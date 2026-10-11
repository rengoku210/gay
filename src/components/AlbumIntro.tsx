import React from 'react';
import { Search, LayoutGrid, Columns, Film, ArrowDownAZ, ArrowUpZA, Calendar, SlidersHorizontal, X } from 'lucide-react';
import { GalleryFilter, SortOption, ViewMode } from '../types/gallery';
import { SITE_CONFIG } from '../config/siteConfig';

interface AlbumIntroProps {
  totalCount: number;
  filteredCount: number;
  filter: GalleryFilter;
  onFilterChange: (newFilter: GalleryFilter) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  availableFolders: string[];
  hasDifferentAspects: boolean;
}

export const AlbumIntro: React.FC<AlbumIntroProps> = ({
  totalCount,
  filteredCount,
  filter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  availableFolders,
  hasDifferentAspects,
}) => {
  const isFiltered = 
    filter.searchQuery.trim() !== '' || 
    filter.aspectFilter !== 'all' || 
    filter.folderFilter !== 'all' ||
    filter.sort !== 'default';

  const resetFilters = () => {
    onFilterChange({
      searchQuery: '',
      sort: 'default',
      aspectFilter: 'all',
      folderFilter: 'all',
    });
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
      {/* Editorial Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.06]">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-300/70 mb-2">
            CURATED COLLECTION · {totalCount} FRAMES
          </p>
          <p className="font-editorial text-xl sm:text-2xl text-neutral-300 font-light leading-relaxed">
            {SITE_CONFIG.editorialIntro}
          </p>
        </div>

        {/* View Layout Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mr-1 hidden sm:inline">
            Layout:
          </span>
          <div className="inline-flex rounded-md border border-white/10 bg-[#121319] p-0.5">
            <button
              onClick={() => onViewModeChange('masonry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                viewMode === 'masonry'
                  ? 'bg-white/10 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Editorial Masonry Layout"
            >
              <Columns className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Masonry</span>
            </button>
            <button
              onClick={() => onViewModeChange('editorial')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                viewMode === 'editorial'
                  ? 'bg-white/10 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Editorial Grid Layout"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => onViewModeChange('filmstrip')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                viewMode === 'filmstrip'
                  ? 'bg-white/10 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Film Archive Contact Sheet"
            >
              <Film className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Contact Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Search, Sort & Orientation Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        {/* Search by filename or caption */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
            placeholder="Search by filename or frame ID..."
            className="w-full rounded-md border border-white/10 bg-[#121319] py-2 pl-9 pr-8 text-xs text-neutral-200 placeholder-neutral-500 transition-colors focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/40"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filter, searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Orientation Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Orientation Filter (only if both portrait and landscape exist) */}
          {hasDifferentAspects && (
            <div className="inline-flex rounded-md border border-white/10 bg-[#121319] p-0.5 text-xs">
              <button
                onClick={() => onFilterChange({ ...filter, aspectFilter: 'all' })}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filter.aspectFilter === 'all'
                    ? 'bg-white/10 text-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onFilterChange({ ...filter, aspectFilter: 'portrait' })}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filter.aspectFilter === 'portrait'
                    ? 'bg-white/10 text-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Portrait
              </button>
              <button
                onClick={() => onFilterChange({ ...filter, aspectFilter: 'landscape' })}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filter.aspectFilter === 'landscape'
                    ? 'bg-white/10 text-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Landscape
              </button>
            </div>
          )}

          {/* Genuine Folder Filter (if ZIP contained subfolders) */}
          {availableFolders.length > 0 && (
            <select
              value={filter.folderFilter}
              onChange={(e) => onFilterChange({ ...filter, folderFilter: e.target.value })}
              className="rounded-md border border-white/10 bg-[#121319] px-2.5 py-1.5 text-xs text-neutral-300 focus:border-amber-400/50 focus:outline-none"
            >
              <option value="all">All Folders</option>
              {availableFolders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          )}

          {/* Sorting Dropdown */}
          <div className="relative">
            <select
              value={filter.sort}
              onChange={(e) => onFilterChange({ ...filter, sort: e.target.value as SortOption })}
              className="rounded-md border border-white/10 bg-[#121319] px-3 py-1.5 text-xs text-neutral-300 focus:border-amber-400/50 focus:outline-none"
            >
              <option value="default">Original Roll Order</option>
              <option value="name-asc">Filename (A → Z)</option>
              <option value="name-desc">Filename (Z → A)</option>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-xs text-amber-300/80 hover:text-amber-200 underline underline-offset-2 transition-colors ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filtered result counter */}
      {isFiltered && (
        <div className="mt-3 text-[11px] font-mono text-neutral-400">
          Showing {filteredCount} of {totalCount} photographs
        </div>
      )}
    </section>
  );
};
