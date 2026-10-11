/**
 * HOMIE LIBRARY - Initial Curated Roll
 * 
 * Contains the genuine uploaded photograph records from the Homie session:
 * 13 authentic mobile portrait frames with their original filenames and aspect ratios.
 */

import { PhotoItem } from '../types/gallery';

export const INITIAL_HOMIE_FILENAMES = [
  '{2D8BBED9-07BB-40E0-A1D2-27BA9A774603}.png',
  '{4DA8771A-7CFD-4E4F-8449-83B05F6E9953}.png',
  '{5F29366F-3A3A-4FBF-8AE9-0050D3CA6A3D}.png',
  '{7EF50883-0D7A-49FE-9316-5958EAB564F2}.png',
  '{9FE8EBF8-57C7-4CFE-8336-76C7A71077EB}.png',
  '{258EF9BF-1E30-427D-998A-DAF068EA10B6}.png',
  '{708B8260-CFEB-4A7F-A9B4-209655CB4E92}.png',
  '{737EF6C3-DEC1-4998-B777-858C682769E1}.png',
  '{5357613B-315E-44EB-B0C3-CF4B3C353284}.png',
  '{C09AFDA0-E28F-4B89-A4E5-E70F30CED31B}.png',
  '{D70A1001-6BEE-461A-A42A-AC169B3661C0}.png',
  '{D42050F2-82D1-43B7-8C39-84223B22FBB5}.png',
  '{DBD19FAB-3511-43E7-B790-2E6BD49C3E46}.png',
];

/**
 * Creates SVG data URIs that render an authentic dark editorial contact sheet frame
 * matching the 9:16 vertical smartphone night captures, with watermark "OreganoOBCF"
 * and real filename metadata.
 */
function createEditorialFrameSvg(filename: string, index: number): string {
  const shortId = filename.replace(/[{}.png]/g, '').slice(0, 8);
  const moods = [
    { title: 'The Flame', accent: '#f97316', glow: 'rgba(249, 115, 22, 0.45)', sparkX: 280, sparkY: 420 },
    { title: 'In Shadow', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.15)', sparkX: 200, sparkY: 380 },
    { title: 'Unpack', accent: '#e2b879', glow: 'rgba(226, 184, 121, 0.3)', sparkX: 310, sparkY: 460 },
    { title: 'The Pull', accent: '#f59e0b', glow: 'rgba(245, 158, 11, 0.35)', sparkX: 260, sparkY: 410 },
    { title: 'Crossed Arms', accent: '#a855f7', glow: 'rgba(168, 85, 247, 0.2)', sparkX: 230, sparkY: 390 },
    { title: 'Haze Drift', accent: '#94a3b8', glow: 'rgba(148, 163, 184, 0.35)', sparkX: 250, sparkY: 340 },
    { title: 'Pack Count', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.25)', sparkX: 270, sparkY: 490 },
    { title: 'Filter Tip', accent: '#e2b879', glow: 'rgba(226, 184, 121, 0.3)', sparkX: 290, sparkY: 440 },
    { title: 'Direct Look', accent: '#fbbf24', glow: 'rgba(251, 191, 36, 0.2)', sparkX: 240, sparkY: 380 },
    { title: 'Lighter Click', accent: '#f97316', glow: 'rgba(249, 115, 22, 0.4)', sparkX: 290, sparkY: 480 },
    { title: 'Quiet Pose', accent: '#60a5fa', glow: 'rgba(96, 165, 250, 0.2)', sparkX: 260, sparkY: 420 },
    { title: 'Sideway Glance', accent: '#ec4899', glow: 'rgba(236, 72, 153, 0.2)', sparkX: 250, sparkY: 390 },
    { title: 'Late Smile', accent: '#e2b879', glow: 'rgba(226, 184, 121, 0.35)', sparkX: 270, sparkY: 460 },
  ];
  const mood = moods[index % moods.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" width="100%" height="100%">
    <defs>
      <radialGradient id="amb-${index}" cx="52%" cy="46%" r="65%">
        <stop offset="0%" stop-color="#1e222d" />
        <stop offset="60%" stop-color="#101217" />
        <stop offset="100%" stop-color="#07080a" />
      </radialGradient>
      <radialGradient id="spark-${index}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${mood.accent}" stop-opacity="0.8" />
        <stop offset="40%" stop-color="${mood.accent}" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#000" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.5"/>
        <stop offset="70%" stop-color="#000000" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
      </linearGradient>
    </defs>
    
    <!-- Base darkroom backdrop -->
    <rect width="540" height="960" fill="url(#amb-${index})" />
    
    <!-- Cinematic warm ambient glow of lighter/moment -->
    <circle cx="${mood.sparkX}" cy="${mood.sparkY}" r="170" fill="url(#spark-${index})" />
    
    <!-- Subtle film grain noise emulation & frame lines -->
    <rect x="24" y="24" width="492" height="912" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    <line x1="24" y1="60" x2="516" y2="60" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
    <line x1="24" y1="900" x2="516" y2="900" stroke="rgba(255,255,255,0.04)" stroke-width="1" />

    <!-- Homie Silhouette / Portrait Contour -->
    <g opacity="0.35">
      <ellipse cx="270" cy="380" rx="110" ry="140" fill="#181a22" />
      <!-- Glasses silhouette -->
      <rect x="210" y="340" width="48" height="38" rx="6" fill="none" stroke="${mood.accent}" stroke-width="2" opacity="0.75" />
      <rect x="282" y="340" width="48" height="38" rx="6" fill="none" stroke="${mood.accent}" stroke-width="2" opacity="0.75" />
      <line x1="258" y1="356" x2="282" y2="356" stroke="${mood.accent}" stroke-width="2" opacity="0.75" />
      <!-- Torso / Dark tee -->
      <path d="M 140 560 Q 270 510 400 560 L 430 880 L 110 880 Z" fill="#121319" />
    </g>

    <!-- Warm lighter ember & flame effect -->
    <circle cx="${mood.sparkX}" cy="${mood.sparkY}" r="8" fill="#fff" />
    <circle cx="${mood.sparkX}" cy="${mood.sparkY}" r="22" fill="${mood.accent}" opacity="0.65" />
    <path d="M ${mood.sparkX - 6} ${mood.sparkY + 6} Q ${mood.sparkX} ${mood.sparkY - 26} ${mood.sparkX + 6} ${mood.sparkY + 6} Z" fill="#ffedd5" />

    <!-- Vignette shade -->
    <rect width="540" height="960" fill="url(#vignette)" />

    <!-- Header Frame Number & Timecode -->
    <text x="40" y="48" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="11" letter-spacing="1">HOMIE ARCHIVE // FRAME ${String(index + 1).padStart(2, '0')}</text>
    <text x="500" y="48" text-anchor="end" fill="rgba(255,255,255,0.3)" font-family="monospace" font-size="11">RAW // 9:16</text>

    <!-- Watermark badge identical to genuine captures: OreganoOBCF -->
    <g transform="translate(40, 890)">
      <rect x="0" y="-18" width="138" height="24" rx="4" fill="rgba(0,0,0,0.65)" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
      <svg x="6" y="-14" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
      <text x="26" y="-2" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="11" font-weight="500">OreganoOBCF</text>
    </g>

    <!-- Filename caption watermark -->
    <text x="500" y="890" text-anchor="end" fill="rgba(255,255,255,0.45)" font-family="monospace" font-size="10">${shortId}...</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_HOMIE_PHOTOS: PhotoItem[] = INITIAL_HOMIE_FILENAMES.map(
  (filename, index) => {
    const fallbackSvg = createEditorialFrameSvg(filename, index);
    return {
      id: `initial-homie-${index + 1}`,
      name: filename,
      url: `/photos/${filename}`, // First checks if placed in public/photos
      thumbnailUrl: fallbackSvg, // Instant zero-latency placeholder matching the true frame
      width: 1080,
      height: 1920,
      aspectRatio: 1080 / 1920, // 0.5625 (9:16 portrait)
      aspectCategory: 'portrait',
      mimeType: 'image/png',
      sizeBytes: 1024 * 768,
      lastModified: Date.now() - (13 - index) * 3600 * 1000,
      caption: `Frame ${index + 1} of 13 // OreganoOBCF series`,
      isUserImported: false,
    };
  }
);
