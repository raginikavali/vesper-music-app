import React from 'react';
import { Play, Pause } from './Icons';

export default function PlayButton({
  isPlaying = false,
  onClick,
  size = 'md',
  variant = 'gold', // 'gold' | 'glass' | 'subtle'
  ariaLabel = 'Play',
}) {
  const dimensions = {
    sm: { box: 36, icon: 16 },
    md: { box: 48, icon: 20 },
    lg: { box: 60, icon: 26 },
  }[size] || { box: 48, icon: 20 };

  const getBackground = () => {
    if (variant === 'gold') return 'var(--color-accent)';
    if (variant === 'glass') return 'rgba(244, 241, 236, 0.15)';
    return 'var(--color-surface-elevated)';
  };

  const getColor = () => {
    if (variant === 'gold') return '#121013';
    return 'var(--color-text-primary)';
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
      aria-label={ariaLabel}
      style={{
        width: `${dimensions.box}px`,
        height: `${dimensions.box}px`,
        borderRadius: 'var(--radius-full)',
        backgroundColor: getBackground(),
        color: getColor(),
        border: variant === 'glass' ? '1px solid rgba(244, 241, 236, 0.2)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: variant === 'gold' ? '0 8px 24px rgba(232, 182, 90, 0.3)' : 'none',
        transition: 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1), background-color 200ms ease, box-shadow 200ms ease',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.06)';
        if (variant === 'gold') e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        if (variant === 'gold') e.currentTarget.style.backgroundColor = 'var(--color-accent)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)';
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 200ms ease, opacity 200ms ease',
          transform: isPlaying ? 'scale(1) rotate(0deg)' : 'scale(1) rotate(0deg)',
        }}
      >
        {isPlaying ? (
          <Pause size={dimensions.icon} fill={getColor()} strokeWidth={1.5} />
        ) : (
          <Play
            size={dimensions.icon}
            fill={getColor()}
            strokeWidth={1.5}
            style={{ marginLeft: size === 'sm' ? '2px' : '3px' }}
          />
        )}
      </div>
    </button>
  );
}
