import React from 'react';

export default function GlobalGrain() {
  return (
    <svg
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999,
        opacity: 0.035,
        mixBlendMode: 'overlay',
      }}
    >
      <filter id="global-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#global-grain)" />
    </svg>
  );
}
