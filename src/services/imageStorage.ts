/**
 * IndexedDB storage service for HOMIE LIBRARY
 * Persists user-imported album photos across browser sessions.
 */

import { PhotoItem } from '../types/gallery';

const DB_NAME = 'HomieLibraryDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

interface StoredPhotoRecord {
  id: string;
  name: string;
  blob: Blob;
  thumbBlob?: Blob;
  width?: number;
  height?: number;
  aspectRatio: number;
  aspectCategory: 'portrait' | 'landscape' | 'square';
  sizeBytes: number;
  mimeType: string;
  lastModified: number;
  folder?: string;
  caption?: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save array of PhotoItems and their Blobs to IndexedDB
 */
export async function savePhotosToStorage(
  photos: { item: PhotoItem; blob: Blob; thumbBlob?: Blob }[]
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    for (const { item, blob, thumbBlob } of photos) {
      const record: StoredPhotoRecord = {
        id: item.id,
        name: item.name,
        blob,
        thumbBlob,
        width: item.width,
        height: item.height,
        aspectRatio: item.aspectRatio,
        aspectCategory: item.aspectCategory,
        sizeBytes: item.sizeBytes || blob.size,
        mimeType: item.mimeType,
        lastModified: item.lastModified || Date.now(),
        folder: item.folder,
        caption: item.caption,
      };
      store.put(record);
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Load all saved photos from IndexedDB and generate fresh object URLs
 */
export async function loadPhotosFromStorage(): Promise<PhotoItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = request.result as StoredPhotoRecord[];
        const items: PhotoItem[] = records.map((rec) => {
          const url = URL.createObjectURL(rec.blob);
          const thumbnailUrl = rec.thumbBlob ? URL.createObjectURL(rec.thumbBlob) : url;
          return {
            id: rec.id,
            name: rec.name,
            url,
            thumbnailUrl,
            width: rec.width,
            height: rec.height,
            aspectRatio: rec.aspectRatio,
            aspectCategory: rec.aspectCategory,
            sizeBytes: rec.sizeBytes,
            mimeType: rec.mimeType,
            lastModified: rec.lastModified,
            folder: rec.folder,
            caption: rec.caption,
            isUserImported: true,
          };
        });
        resolve(items);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to load photos from IndexedDB:', err);
    return [];
  }
}

/**
 * Clear all imported photos from IndexedDB
 */
export async function clearPhotosStorage(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to clear storage:', err);
  }
}
