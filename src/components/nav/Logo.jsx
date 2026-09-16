import React, { useState } from 'react';
import GeneratedCover from '../ui/GeneratedCover';

export default function Logo({ size = 'md', showWordmark = true, onClick }) {
  const isLarge = size === 'lg';
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div 
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        overflow: 'hidden',
      }}
      title="VESPER — Music, after hours"
    >
      {imageFailed ? (
        <GeneratedCover seed="vesper-logo" width={isLarge ? '36px' : '32px'} height={isLarge ? '36px' : '32px'} borderRadius="var(--radius-full)" />
      ) : (
        <img
          src="/vesper-mark.svg"
          alt=""
          width={isLarge ? "36" : "32"}
          height={isLarge ? "36" : "32"}
          onError={() => setImageFailed(true)}
          style={{ flexShrink: 0, display: 'block' }}
        />
      )}

      {/* Wordmark (Fades/Slides gracefully, Never renders when showWordmark=false) */}
      {showWordmark && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: isLarge ? "26px" : "20px",
            letterSpacing: "0.25em",
            color: "var(--color-text-primary)",
            textTransform: "uppercase",
            lineHeight: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          VESPER
        </span>
      )}
    </div>
  );
}
