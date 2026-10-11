/**
 * HOMIE LIBRARY - Core Site Configuration
 * 
 * Customize all text, taglines, branding, and gallery behaviors in this central file.
 */

export const SITE_CONFIG = {
  // =========================================================================
  // 1. TOP TAGLINE SECTION (CUSTOMIZE HERE)
  // Exact placeholder requested: "our gay is here"
  // =========================================================================
  tagline: "our gay is here",

  // =========================================================================
  // 2. MAIN BRANDING & SUPPORTING COPY
  // Rule: Use "Homie" wherever the personal identity of the site is referenced.
  // =========================================================================
  brandName: "HOMIE LIBRARY",
  supportingText: "A collection of moments worth keeping.",
  editorialIntro: "A personal archive dedicated to raw memories, candid late nights, and shared moments that linger.",
  footerText: "Made of moments.",

  // =========================================================================
  // 3. ARCHIVE DETAILS & ABOUT COPY
  // =========================================================================
  archiveDescription: 
    "HOMIE LIBRARY is an intimate photographic archive created to preserve authentic moments in their original resolution. Built with an editorial darkroom aesthetic, every frame holds time without distortion or noise.",

  // =========================================================================
  // 4. PALETTE & THEME ACCENTS (Easily customizable)
  // =========================================================================
  theme: {
    bgDark: "#0c0d10",
    bgSurface: "#13151b",
    bgCard: "#181a22",
    borderSubtle: "rgba(255, 255, 255, 0.08)",
    borderHover: "rgba(255, 255, 255, 0.22)",
    accentWarm: "#e2b879", // warm amber/candlelight
    accentMuted: "#9ca3af",
    textPrimary: "#f3f4f6",
    textSecondary: "#9ca3af",
  },

  // =========================================================================
  // 5. GALLERY BEHAVIOR DEFAULTS
  // =========================================================================
  gallery: {
    columnsDesktop: 3,
    columnsTablet: 2,
    columnsMobile: 1,
    defaultSort: "default" as const, // 'default' | 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc'
    enableKeyboardShortcuts: true,
    preloadAdjacentLightboxImages: true,
  },
} as const;
