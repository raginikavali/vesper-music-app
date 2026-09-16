import React, { useState } from 'react';
import { Heart } from './Icons';

export default function LikeButton({
  isLiked = false,
  isLoved = false,
  onToggle,
  size = 20,
}) {
  const [animating, setAnimating] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnimating(true);
    onToggle && onToggle();
    setTimeout(() => setAnimating(false), 350);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isLoved ? "Loved" : isLiked ? "Liked" : "Like"}
      title={isLoved ? "Loved (Pinned to top)" : isLiked ? "Liked" : "Click to like / double click to love"}
      style={{
        background: 'none',
        border: 'none',
        padding: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isLoved || isLiked ? 'var(--color-accent)' : 'var(--color-text-secondary)',
        transition: 'all 180ms cubic-bezier(0.32, 0.72, 0, 1)',
        borderRadius: 'var(--radius-full)',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!isLiked && !isLoved) e.currentTarget.style.color = 'var(--color-text-primary)';
      }}
      onMouseLeave={(e) => {
        if (!isLiked && !isLoved) e.currentTarget.style.color = 'var(--color-text-secondary)';
      }}
    >
      {/* Radiating Ring Animation for Loved state */}
      {isLoved && animating && (
        <div
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: 'var(--radius-full)',
            border: '2px solid var(--color-accent)',
            animation: 'lovedRadiate 350ms cubic-bezier(0.32, 0.72, 0, 1) forwards',
            pointerEvents: 'none',
          }}
        />
      )}

      <Heart
        size={size}
        className={animating ? 'heart-liked' : ''}
        fill={isLoved ? 'var(--color-accent)' : 'none'}
        stroke={isLiked || isLoved ? 'var(--color-accent)' : 'currentColor'}
        strokeWidth={isLoved ? 0 : 1.8}
      />

      <style>{`
        @keyframes lovedRadiate {
          from {
            transform: scale(0.8);
            opacity: 1;
          }
          to {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}
