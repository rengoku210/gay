import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FolderArchive, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  FileImage,
  FolderOpen,
  Sparkles
} from 'lucide-react';
import { extractPhotosFromZip, processDirectImageFiles } from '../services/zipExtractor';
import { PhotoItem, ZipExtractionStats } from '../types/gallery';

interface ZipImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (photos: PhotoItem[], stats: ZipExtractionStats) => void;
  onLoadSessionPhotos: () => void;
}

export const ZipImportModal: React.FC<ZipImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  onLoadSessionPhotos,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFilename, setCurrentFilename] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stats, setStats] = useState<ZipExtractionStats | null>(null);

  const zipInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleZipFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setErrorMsg(null);
    setStats(null);

    try {
      const result = await extractPhotosFromZip(file, (pct, name) => {
        setProgress(pct);
        setCurrentFilename(name);
      });

      if (result.photos.length === 0) {
        setErrorMsg('No supported image files (JPG, PNG, WebP) were found inside this ZIP archive.');
        setIsProcessing(false);
        return;
      }

      setStats(result.stats);
      setIsProcessing(false);
      onImportComplete(result.photos, result.stats);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to read ZIP archive. Please ensure it is a valid ZIP file.');
      setIsProcessing(false);
    }
  };

  const handleImageFiles = async (files: FileList | File[]) => {
    setIsProcessing(true);
    setProgress(0);
    setErrorMsg(null);
    setStats(null);

    try {
      const fileArray = Array.from(files);
      const result = await processDirectImageFiles(fileArray, (pct, name) => {
        setProgress(pct);
        setCurrentFilename(name);
      });

      if (result.photos.length === 0) {
        setErrorMsg('No supported image files (JPG, PNG, WebP) were selected.');
        setIsProcessing(false);
        return;
      }

      setStats(result.stats);
      setIsProcessing(false);
      onImportComplete(result.photos, result.stats);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to process uploaded images.');
      setIsProcessing(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const firstFile = e.dataTransfer.files[0];
      if (firstFile.name.toLowerCase().endsWith('.zip')) {
        handleZipFile(firstFile);
      } else {
        handleImageFiles(e.dataTransfer.files);
      }
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-lg border border-white/10 bg-[#12141a] p-6 shadow-2xl text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <FolderArchive className="h-5 w-5 text-amber-400" />
            <h3 className="font-editorial text-xl text-neutral-100">
              Import Photographs into HOMIE LIBRARY
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hidden inputs */}
        <input
          ref={zipInputRef}
          type="file"
          accept=".zip,application/zip"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleZipFile(e.target.files[0]);
          }}
        />
        <input
          ref={filesInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleImageFiles(e.target.files);
          }}
        />
        <input
          ref={folderInputRef}
          type="file"
          // @ts-ignore
          webkitdirectory=""
          // @ts-ignore
          directory=""
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleImageFiles(e.target.files);
          }}
        />

        {/* Dropzone */}
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/15 bg-[#0e1015] p-8 text-center transition-colors hover:border-amber-400/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 text-amber-400 mb-3">
            <Upload className="h-6 w-6" />
          </div>

          <p className="font-medium text-sm text-neutral-200">
            Drag and drop your ZIP album file here
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Supports .zip archives containing JPG, JPEG, PNG, or WebP photographs
          </p>

          {/* Action buttons */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => zipInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-400/15 border border-amber-400/30 px-3.5 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-400/25 transition-colors disabled:opacity-50"
            >
              <FolderArchive className="h-4 w-4" />
              Select ZIP File
            </button>

            <button
              onClick={() => filesInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <FileImage className="h-4 w-4" />
              Select Image Files
            </button>

            <button
              onClick={() => folderInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <FolderOpen className="h-4 w-4" />
              Select Folder
            </button>
          </div>
        </div>

        {/* Quick session roll loader button */}
        <div className="mt-4 p-3 rounded-md bg-[#161822] border border-white/5 flex items-center justify-between text-xs">
          <div>
            <span className="font-medium text-neutral-200">Uploaded Session Roll:</span>
            <p className="text-neutral-500 text-[11px]">13 frames from the current OreganoOBCF session</p>
          </div>
          <button
            onClick={() => {
              onLoadSessionPhotos();
              onClose();
            }}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-mono text-[11px] underline underline-offset-2"
          >
            <Sparkles className="h-3 w-3" />
            Load Session Roll
          </button>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs font-mono text-neutral-400">
              <span>Extracting: {currentFilename || 'Analyzing archive...'}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full bg-amber-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success stats */}
        {stats && (
          <div className="mt-4 rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>Successfully imported {stats.validImagesExtracted} photographs!</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-400/80 font-mono">
              Saved to your browser storage (IndexedDB). Your archive will persist across page refreshes.
            </p>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 flex items-start gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Workflow note */}
        <div className="mt-5 border-t border-white/5 pt-4 text-[11px] text-neutral-500 font-mono leading-relaxed">
          <p className="font-semibold text-neutral-400">ARCHIVE EXTRACTION SPECIFICATION:</p>
          <ul className="mt-1 list-disc list-inside space-y-0.5">
            <li>Original aspect ratios and pixel resolution are strictly preserved.</li>
            <li>Optimized thumbnails are generated on-the-fly for smooth scrolling.</li>
            <li>Files are kept in local storage without uploading to third-party clouds.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
