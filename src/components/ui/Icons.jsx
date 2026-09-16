import React from 'react';

function createIcon(d, extraPaths = []) {
  return function Icon({ size = 24, color = 'currentColor', fill = 'none', strokeWidth = 2, className = '', style = {} }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ flexShrink: 0, ...style }}
      >
        <path d={d} />
        {extraPaths.map((p, idx) => (
          <path key={idx} d={p} />
        ))}
      </svg>
    );
  };
}

export const Compass = createIcon("M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z", ["M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z"]);

export const Search = createIcon("M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z");

export const Library = createIcon("M16 6V20M12 6V20M8 6V20M4 6V20M20 6V20");

export const ListMusic = createIcon("M21 15V6M18 6H21M12 6H3M12 12H3M12 18H3M18 18C16.8954 18 16 17.1046 16 16C16 14.8954 16.8954 14 18 14C19.1046 14 20 14.8954 20 16C20 17.1046 19.1046 18 18 18Z");

export const Play = ({ size = 24, color = 'currentColor', fill = 'currentColor', className = '', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={1} className={className} style={{ flexShrink: 0, ...style }}>
    <path d="M5 3L19 12L5 21V3Z" />
  </svg>
);

export const Pause = ({ size = 24, color = 'currentColor', fill = 'currentColor', className = '', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={1} className={className} style={{ flexShrink: 0, ...style }}>
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

export const Heart = ({ size = 24, color = 'currentColor', fill = 'none', stroke = 'currentColor', strokeWidth = 2, className = '', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, ...style }}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const ChevronLeft = createIcon("M15 18L9 12L15 6");
export const ChevronRight = createIcon("M9 18L15 12L9 6");
export const ChevronUp = createIcon("M18 15L12 9L6 15");
export const ChevronDown = createIcon("M6 9L12 15L18 9");

export const SkipBack = createIcon("M19 20L9 12L19 4V20Z", ["M5 19V5"]);
export const SkipForward = createIcon("M5 4L15 12L5 20V4Z", ["M19 5V19"]);

export const Volume2 = createIcon("M11 5L6 9H2V15H6L11 19V5Z", ["M19.07 4.93a10 10 0 0 1 0 14.14", "M15.54 8.46a5 5 0 0 1 0 7.07"]);
export const VolumeX = createIcon("M11 5L6 9H2V15H6L11 19V5Z", ["M23 9l-6 6", "M17 9l6 6"]);

export const Quote = createIcon("M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4-2 7-4 8z", ["M15 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4-2 7-4 8z"]);
export const X = createIcon("M18 6L6 18", ["M6 6l12 12"]);

export const ArrowUp = createIcon("M12 19V5", ["M5 12l7-7 7 7"]);
export const ArrowDown = createIcon("M12 5v14", ["M19 12l-7 7-7-7"]);
export const Trash2 = createIcon("M3 6h18", ["M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]);
export const Clock = createIcon("M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", ["M12 6v6l4 2"]);
export const Disc = createIcon("M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"]);
export const Users = createIcon("M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", ["M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]);
export const BadgeCheck = createIcon("M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z", ["M9 12l2 2 4-4"]);
export const ArrowLeft = createIcon("M19 12H5", ["M12 19l-7-7 7-7"]);
export const Sparkles = createIcon("M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z");
export const Music = createIcon("M9 18V5l12-2v13", ["M9 9l12-2", "M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"]);
