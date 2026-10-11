/**
 * ZIP and Image File Extraction Engine for HOMIE LIBRARY
 * Inspects ZIP archives and individual image uploads client-side.
 */

import JSZip from 'jszip';
import { PhotoItem, ZipExtractionStats } from '../types/gallery';
import { savePhotosToStorage } from './imageStorage';

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Determine if a filename matches supported image types
 */
export function isSupportedImageFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  // Filter out Mac metadata or thumbs
  if (lower.includes('__macosx') || lower.includes('.ds_store') || lower.startsWith('._')) {
    return false;
  }
  return SUPPORTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function getMimeType(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

/**
 * Measure image dimensions and create an optimized thumbnail
 */
function processImageBlob(
  blob: Blob
): Promise<{ width: number; height: number; thumbBlob?: Blob }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth || 800;
      const height = img.naturalHeight || 1200;

      // Generate optimized thumbnail (max 720px width/height)
      try {
        const maxThumbDim = 720;
        let thumbW = width;
        let thumbH = height;

        if (width > maxThumbDim || height > maxThumbDim) {
          if (width >= height) {
            thumbW = maxThumbDim;
            thumbH = Math.round((height * maxThumbDim) / width);
          } else {
            thumbH = maxThumbDim;
            thumbW = Math.round((width * maxThumbDim) / height);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = thumbW;
        canvas.height = thumbH;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, thumbW, thumbH);
          canvas.toBlob(
            (thumbBlob) => {
              URL.revokeObjectURL(url);
              resolve({
                width,
                height,
                thumbBlob: thumbBlob || undefined,
              });
            },
            'image/webp',
            0.85
          );
          return;
        }
      } catch (e) {
        console.warn('Canvas thumbnail generation skipped:', e);
      }

      URL.revokeObjectURL(url);
      resolve({ width, height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 800, height: 1200 }); // Graceful fallback
    };

    img.src = url;
  });
}

/**
 * Extract images directly from a ZIP file
 */
export async function extractPhotosFromZip(
  zipFile: File | Blob,
  onProgress?: (progress: number, currentFileName: string) => void
): Promise<{ photos: PhotoItem[]; stats: ZipExtractionStats }> {
  const zip = await JSZip.loadAsync(zipFile);
  const entries: { path: string; file: JSZip.JSZipObject }[] = [];

  const foldersSet = new Set<string>();
  let totalFiles = 0;
  let skippedFiles = 0;

  zip.forEach((relativePath, file) => {
    totalFiles++;
    if (file.dir) {
      const folderName = relativePath.split('/')[0];
      if (folderName && !folderName.startsWith('__')) {
        foldersSet.add(folderName);
      }
      return;
    }

    if (isSupportedImageFile(relativePath)) {
      entries.push({ path: relativePath, file });
      const parts = relativePath.split('/');
      if (parts.length > 1 && parts[0] && !parts[0].startsWith('__')) {
        foldersSet.add(parts[0]);
      }
    } else {
      skippedFiles++;
    }
  });

  const extractedItems: PhotoItem[] = [];
  const storagePayload: { item: PhotoItem; blob: Blob; thumbBlob?: Blob }[] = [];
  let totalBytes = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const pathParts = entry.path.split('/');
    const filename = pathParts[pathParts.length - 1];
    const folder = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : undefined;

    if (onProgress) {
      onProgress(Math.round(((i + 1) / entries.length) * 100), filename);
    }

    try {
      const blobData = await entry.file.async('blob');
      const mimeType = getMimeType(filename);
      const typedBlob = new Blob([blobData], { type: mimeType });
      totalBytes += typedBlob.size;

      const { width, height, thumbBlob } = await processImageBlob(typedBlob);
      const aspectRatio = width / (height || 1);
      const aspectCategory =
        aspectRatio > 1.2 ? 'landscape' : aspectRatio < 0.85 ? 'portrait' : 'square';

      const url = URL.createObjectURL(typedBlob);
      const thumbnailUrl = thumbBlob ? URL.createObjectURL(thumbBlob) : url;

      const photoItem: PhotoItem = {
        id: `zip-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
        name: filename,
        url,
        thumbnailUrl,
        width,
        height,
        aspectRatio,
        aspectCategory,
        sizeBytes: typedBlob.size,
        mimeType,
        lastModified: entry.file.date ? entry.file.date.getTime() : Date.now(),
        folder: folder || undefined,
        isUserImported: true,
      };

      extractedItems.push(photoItem);
      storagePayload.push({ item: photoItem, blob: typedBlob, thumbBlob });
    } catch (err) {
      console.error(`Failed to extract ${entry.path}:`, err);
      skippedFiles++;
    }
  }

  // Persist into IndexedDB
  if (storagePayload.length > 0) {
    try {
      await savePhotosToStorage(storagePayload);
    } catch (storageErr) {
      console.warn('Failed to save imported photos to IndexedDB:', storageErr);
    }
  }

  const stats: ZipExtractionStats = {
    totalFilesFound: totalFiles,
    validImagesExtracted: extractedItems.length,
    skippedFiles,
    totalSizeBytes: totalBytes,
    foldersFound: Array.from(foldersSet),
  };

  return { photos: extractedItems, stats };
}

/**
 * Process a collection of directly uploaded image Files (drag-and-drop or folder picker)
 */
export async function processDirectImageFiles(
  files: File[],
  onProgress?: (progress: number, fileName: string) => void
): Promise<{ photos: PhotoItem[]; stats: ZipExtractionStats }> {
  const validFiles = files.filter((f) => isSupportedImageFile(f.name));
  const extractedItems: PhotoItem[] = [];
  const storagePayload: { item: PhotoItem; blob: Blob; thumbBlob?: Blob }[] = [];
  let totalBytes = 0;

  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    if (onProgress) {
      onProgress(Math.round(((i + 1) / validFiles.length) * 100), file.name);
    }

    try {
      totalBytes += file.size;
      const { width, height, thumbBlob } = await processImageBlob(file);
      const aspectRatio = width / (height || 1);
      const aspectCategory =
        aspectRatio > 1.2 ? 'landscape' : aspectRatio < 0.85 ? 'portrait' : 'square';

      const url = URL.createObjectURL(file);
      const thumbnailUrl = thumbBlob ? URL.createObjectURL(thumbBlob) : url;

      // Extract folder name if webkitRelativePath exists
      let folder: string | undefined = undefined;
      if (file.webkitRelativePath) {
        const parts = file.webkitRelativePath.split('/');
        if (parts.length > 1) {
          folder = parts[0];
        }
      }

      const photoItem: PhotoItem = {
        id: `file-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        url,
        thumbnailUrl,
        width,
        height,
        aspectRatio,
        aspectCategory,
        sizeBytes: file.size,
        mimeType: file.type || getMimeType(file.name),
        lastModified: file.lastModified || Date.now(),
        folder,
        isUserImported: true,
      };

      extractedItems.push(photoItem);
      storagePayload.push({ item: photoItem, blob: file, thumbBlob });
    } catch (e) {
      console.error(`Failed processing file ${file.name}:`, e);
    }
  }

  if (storagePayload.length > 0) {
    try {
      await savePhotosToStorage(storagePayload);
    } catch (e) {
      console.warn('Failed saving to IndexedDB:', e);
    }
  }

  const stats: ZipExtractionStats = {
    totalFilesFound: files.length,
    validImagesExtracted: extractedItems.length,
    skippedFiles: files.length - validFiles.length,
    totalSizeBytes: totalBytes,
    foldersFound: [],
  };

  return { photos: extractedItems, stats };
}
