import React, { useMemo } from 'react';

// Deterministic seed hash function
function hashSeed(seed = 'vesper') {
  let hash = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Color Palettes for Midnight Editorial Aesthetic (Amber, Rust, Plum, Obsidian, Indigo)
const COLOR_PALETTES = [
  ['#E8B65A', '#8C3B2B', '#1C191E'], // Amber / Rust / Deep Charcoal
  ['#D97736', '#4A2545', '#121013'], // Copper / Deep Plum / Warm Charcoal
  ['#E8B65A', '#2A4365', '#1C191E'], // Muted Gold / Midnight Indigo / Obsidian
  ['#C57B57', '#F4F1EC', '#262227'], // Terracotta / Off-white / Elevated Surface
  ['#9B51E0', '#E8B65A', '#121013'], // Violet / Gold / Base Dark
  ['#E06D53', '#805AD5', '#1C191E'], // Warm Crimson / Iris / Charcoal
];

export default function GeneratedCover({
  seed = 'vesper-1',
  width = '100%',
  height = '100%',
  borderRadius = 'var(--radius-md)',
  style = {},
  className = '',
}) {
  const artworkParams = useMemo(() => {
    const num = hashSeed(seed);
    const paletteIndex = num % COLOR_PALETTES.length;
    const colors = COLOR_PALETTES[paletteIndex];

    // Blob positions & radiuses based on seed
    const cx1 = 20 + (num % 60);
    const cy1 = 20 + ((num >> 2) % 60);
    const r1 = 45 + ((num >> 4) % 35);

    const cx2 = 50 + ((num >> 3) % 40);
    const cy2 = 50 + ((num >> 5) % 40);
    const r2 = 40 + ((num >> 6) % 30);

    const angle = (num % 360);

    return {
      colors,
      cx1,
      cy1,
      r1,
      cx2,
      cy2,
      r2,
      angle,
      seedId: `cover-grain-${num}`,
    };
  }, [seed]);

  const { colors, cx1, cy1, r1, cx2, cy2, r2, angle, seedId } = artworkParams;

  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: colors[2],
        ...style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Subtle Grain Filter Overlay */}
          <filter id={seedId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feColorMatrix type="saturate" values="0" result="mono" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.08" />
            </feComponentTransfer>
          </filter>

          {/* Linear Gradient Mesh */}
          <linearGradient id={`grad-${seedId}`} x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform={`rotate(${angle})`}>
            <stop offset="0%" stopColor={colors[0]} stopOpacity="0.85" />
            <stop offset="50%" stopColor={colors[1]} stopOpacity="0.75" />
            <stop offset="100%" stopColor={colors[2]} stopOpacity="0.95" />
          </linearGradient>

          <radialGradient id={`radial1-${seedId}`} cx={`${cx1}%`} cy={`${cy1}%`} r={`${r1}%`}>
            <stop offset="0%" stopColor={colors[0]} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors[0]} stopOpacity="0" />
          </radialGradient>

          <radialGradient id={`radial2-${seedId}`} cx={`${cx2}%`} cy={`${cy2}%`} r={`${r2}%`}>
            <stop offset="0%" stopColor={colors[1]} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors[1]} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Mesh */}
        <rect width="100" height="100" fill={`url(#grad-${seedId})`} />

        {/* Organic Gradient Blobs */}
        <circle cx={cx1} cy={cy1} r={r1} fill={`url(#radial1-${seedId})`} />
        <circle cx={cx2} cy={cy2} r={r2} fill={`url(#radial2-${seedId})`} />

        {/* Printed Analog Grain Overlay */}
        <rect width="100" height="100" filter={`url(#${seedId})`} style={{ mixBlendMode: 'overlay' }} />
      </svg>
    </div>
  );
}
