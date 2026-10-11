# HOMIE LIBRARY

> *A collection of moments worth keeping.*

**HOMIE LIBRARY** is an editorial personal photo gallery website dedicated to memories, moments, photography, and shared experiences. Designed with a darkroom aesthetic inspired by classic cinema, raw contact sheets, and modern digital archives.

---

## 1. Where to Replace the Tagline

The exact editable placeholder **`our gay is here`** is configured in:

📁 **`src/config/siteConfig.ts`** (Line 12):
```typescript
export const SITE_CONFIG = {
  // EDIT HERE: Custom tagline placeholder requested by user
  tagline: "our gay is here",

  brandName: "HOMIE LIBRARY",
  supportingText: "A collection of moments worth keeping.",
  editorialIntro: "A personal archive dedicated to raw memories, candid late nights, and shared moments that linger.",
  footerText: "Made of moments.",
  // ...
};
```
Simply edit `tagline: "our gay is here"` to your desired final text. The website updates immediately.

---

## 2. Using Your ZIP File as the Album

HOMIE LIBRARY offers **two native workflows** to import your photographic album:

### Method A: In-Browser Instant Drag & Drop (Zero Setup)
1. Open the website in any browser.
2. Drag and drop your `.zip` archive directly anywhere onto the page, or click **"Import ZIP Album"** in the top navigation bar.
3. The site's client-side extraction engine (`jszip`) will:
   - Identify all supported image formats (**JPG**, **JPEG**, **PNG**, **WebP**).
   - Compute natural pixel dimensions and preserve authentic aspect ratios without cropping or distortion.
   - Generate fast, lightweight thumbnails via HTML5 canvas for smooth scrolling.
   - Store the images securely in your browser's **IndexedDB** (`HomieLibraryDB`), keeping your imported photos persistent across page refreshes!
   - Organize any subfolder structure and maintain original filenames.

### Method B: Command-Line Asset Unpacking
If you want to bake the photos permanently into the website before deployment:
```bash
# Run the extraction utility with the path to your ZIP file:
npm run import-album /path/to/your/album.zip

# Or via node:
node scripts/import-zip.js /path/to/your/album.zip
```
This unpacks all images directly into `public/photos/` and generates `src/data/album-manifest.json`.

---

## 3. Key Features

- **Top Tagline Section**: Prominent header featuring the custom tagline placeholder `our gay is here`, with editorial serif typography and subtle entrance animation.
- **Natural Aspect Ratio Preservation**: Supports 9:16 vertical smartphone portraits, 16:9 landscapes, and 1:1 squares without cropping or letterbox stretching.
- **Curated Session Roll**: Pre-configured with the 13 authentic mobile portrait frames (`{2D8BBED9-07BB-40E0-A1D2-27BA9A774603}.png`, etc.) matching the OreganoOBCF session.
- **Multiple Curated View Modes**:
  - **Editorial Masonry**: Natural column-balanced layout with zero layout shifts.
  - **Editorial Grid**: Uniform structured cards with clean metadata bars.
  - **Filmstrip / Contact Sheet**: Cinematic 35mm film frame styling with frame numbers and ISO stamps.
- **Full-Screen Cinematic Lightbox**:
  - Next/Previous controls and image position counter (e.g., `4 / 13`).
  - Keyboard navigation (`ArrowLeft`, `ArrowRight`, `Escape` to close, `Z` to zoom, `I` for metadata).
  - Touch-friendly swipe gestures on mobile devices.
  - Toggleable technical drawer showing filename, resolution, aspect ratio, file size, and timestamps.
  - Body scroll lock while open.
- **Subtle Search & Sorting**:
  - Search by filename or frame ID.
  - Sort by original roll order, filename (A-Z, Z-A), or date.
  - Filter by orientation (Portrait / Landscape) and subfolder.
- **Restrained Footer**: Minimalistic closing section reading *"Made of moments."* and HOMIE LIBRARY branding.
- **Zero-Pill Discipline**: Metadata is displayed with clean typographic dividers (`·`), completely free of AI-slop pill badges.

---

## 4. Setup and Development Instructions

### Prerequisites
- Node.js 18+ or Bun

### Running Locally
```bash
# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev
```

### Production Build
```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 5. Project Structure

```
HOMIE LIBRARY/
├── index.html                   # HTML entry point with Cinzel & Playfair fonts
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies & scripts
├── public/
│   └── photos/                  # Extracted gallery images directory
├── scripts/
│   └── import-zip.js            # Node CLI script for unpacking ZIP archives
├── src/
│   ├── components/
│   │   ├── AboutModal.tsx       # Archive description & tagline notes
│   │   ├── AlbumIntro.tsx       # Live count, layout toggle, search & sort
│   │   ├── Footer.tsx           # "Made of moments." footer
│   │   ├── GalleryGrid.tsx      # Masonry, Grid, and Filmstrip views
│   │   ├── Header.tsx           # Tagline section ("our gay is here") & hero
│   │   ├── Lightbox.tsx         # Full-screen image viewer with keyboard/swipe
│   │   └── ZipImportModal.tsx   # Drag-and-drop ZIP album ingestion
│   ├── config/
│   │   └── siteConfig.ts        # CENTRAL CONFIG: Tagline, titles & palette
│   ├── data/
│   │   └── initialPhotos.ts     # The 13 uploaded frames with original filenames
│   ├── services/
│   │   ├── imageStorage.ts      # IndexedDB persistence layer
│   │   └── zipExtractor.ts      # JSZip extraction & thumbnail processor
│   ├── types/
│   │   └── gallery.ts           # PhotoItem and filter interfaces
│   ├── App.tsx                  # Main application orchestrator
│   ├── index.css                # Tailwind styling, dark theme, font utilities
│   └── main.tsx                 # React entry point
└── tsconfig.json
```
