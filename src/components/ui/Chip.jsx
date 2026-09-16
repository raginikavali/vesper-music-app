import React from 'react';

export default function Chip({ label, isActive = false, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 18px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-surface-elevated)',
        color: isActive ? '#121013' : 'var(--color-text-secondary)',
        border: isActive ? 'none' : '1px solid var(--color-divider)',
        fontFamily: 'var(--font-ui)',
        fontSize: '13px',
        fontWeight: isActive ? 600 : 500,
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = 'var(--color-text-primary)';
          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = 'var(--color-text-secondary)';
          e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated)';
        }
      }}
    >
      {label}
    </button>
  );
}
