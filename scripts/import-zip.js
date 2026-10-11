/**
 * HOMIE LIBRARY - Node.js ZIP Extraction Utility
 * 
 * Usage:
 *   node scripts/import-zip.js <path-to-album.zip>
 * 
 * Extracts all supported image files (JPG, PNG, WebP) into public/photos/
 * and generates a static album-manifest.json for high-performance builds.
 */

import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const SUPPORTED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

async function main() {
  const zipPath = process.argv[2];

  if (!zipPath) {
    console.log(`
===========================================================
  HOMIE LIBRARY - ALBUM ZIP EXTRACTOR
===========================================================

Usage:
  node scripts/import-zip.js <path-to-zip-file>
  npm run import-album <path-to-zip-file>

Examples:
  node scripts/import-zip.js ~/Downloads/homie_photos.zip
  npm run import-album ./my_album.zip

This will:
  1. Inspect the ZIP file and identify all JPG, PNG, and WebP photographs.
  2. Unpack them into public/photos/ preserving original filenames and ratios.
  3. Generate src/data/album-manifest.json for instant gallery loading.
===========================================================
`);
    process.exit(0);
  }

  if (!fs.existsSync(zipPath)) {
    console.error(`Error: File not found at path "${zipPath}"`);
    process.exit(1);
  }

  console.log(`Opening ZIP archive: ${zipPath}`);
  const fileData = fs.readFileSync(zipPath);
  const zip = await JSZip.loadAsync(fileData);

  const outDir = path.resolve('public', 'photos');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const manifestItems = [];
  let extractedCount = 0;
  let skippedCount = 0;

  for (const [filename, fileObj] of Object.entries(zip.files)) {
    if (fileObj.dir) continue;

    const lower = filename.toLowerCase();
    if (lower.includes('__macosx') || lower.includes('.ds_store') || lower.startsWith('._')) {
      skippedCount++;
      continue;
    }

    const isImage = SUPPORTED_EXTS.some(ext => lower.endsWith(ext));
    if (!isImage) {
      skippedCount++;
      continue;
    }

    const baseName = path.basename(filename);
    const destPath = path.join(outDir, baseName);

    console.log(`Extracting [${extractedCount + 1}]: ${baseName}`);
    const buffer = await fileObj.async('nodebuffer');
    fs.writeFileSync(destPath, buffer);

    manifestItems.push({
      id: `img-${Date.now()}-${extractedCount}`,
      name: baseName,
      url: `/photos/${baseName}`,
      thumbnailUrl: `/photos/${baseName}`,
      aspectRatio: 9 / 16, // Default portrait, detected dynamically in app
      aspectCategory: 'portrait',
      sizeBytes: buffer.length,
      mimeType: lower.endsWith('.png') ? 'image/png' : lower.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
      lastModified: fileObj.date ? fileObj.date.getTime() : Date.now(),
      isUserImported: true,
    });

    extractedCount++;
  }

  // Save manifest
  const manifestDir = path.resolve('src', 'data');
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }
  const manifestFile = path.join(manifestDir, 'album-manifest.json');
  fs.writeFileSync(manifestFile, JSON.stringify(manifestItems, null, 2));

  console.log(`
-----------------------------------------------------------
Successfully extracted ${extractedCount} photographs into public/photos/
Skipped ${skippedCount} non-image or system files.
Manifest written to: ${manifestFile}
Run "npm run dev" to see your photographs live in HOMIE LIBRARY!
-----------------------------------------------------------
`);
}

main().catch(err => {
  console.error('Extraction failed:', err);
  process.exit(1);
});
