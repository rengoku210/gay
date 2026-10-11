/**
 * HOMIE LIBRARY - Data Types
 */

export interface PhotoItem {
  id: string;
  name: string; // Original filename e.g. {2D8BBED9-07BB-40E0-A1D2-27BA9A774603}.png
  url: string; // Object URL or static path for full-resolution view
  thumbnailUrl?: string; // Optimized thumbnail for fast grid rendering
  width?: number; // Natural pixel width
  height?: number; // Natural pixel height
  aspectRatio: number; // width / height
  aspectCategory: 'portrait' | 'landscape' | 'square';
  sizeBytes?: number; // File size in bytes
  mimeType: string;
  lastModified?: number; // Timestamp
  folder?: string; // Subfolder if provided inside ZIP
  caption?: string; // Metadata caption if present
  isUserImported?: boolean;
}

export type ViewMode = 'masonry' | 'editorial' | 'filmstrip';

export type SortOption = 
  | 'default'
  | 'name-asc'
  | 'name-desc'
  | 'date-desc'
  | 'date-asc'
  | 'aspect-portrait'
  | 'aspect-landscape';

export interface GalleryFilter {
  searchQuery: string;
  sort: SortOption;
  aspectFilter: 'all' | 'portrait' | 'landscape' | 'square';
  folderFilter: string; // 'all' or specific folder name
}

export interface ZipExtractionStats {
  totalFilesFound: number;
  validImagesExtracted: number;
  skippedFiles: number;
  totalSizeBytes: number;
  foldersFound: string[];
}
