import React from 'react';

export default function EmptyState({ searchQuery, activeCategory, onReset }) {
  return (
    <div
      className="container"
      style={{
        padding: '4rem 1.5rem 6rem',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          maxWidth: '540px',
          width: '100%',
          backgroundColor: 'var(--bg-plaster-card)',
          border: '1px solid var(--border-stone)',
          borderRadius: '24px',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Artistic Pottery Vase SVG Graphic */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            backgroundColor: 'rgba(140, 106, 84, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.75rem',
            border: '1px dashed var(--border-stone)'
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--accent-clay)" strokeWidth="2">
            <path d="M16 10H32M20 10V16C20 18 12 24 12 32C12 38 18 42 24 42C30 42 36 38 36 32C36 24 28 18 28 16V10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 28C16 30 20 28 24 30C28 32 32 30 36 28" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>

        <h3
          style={{
            fontSize: '1.8rem',
            color: 'var(--text-espresso)',
            marginBottom: '0.65rem',
            fontFamily: 'var(--font-serif)'
          }}
        >
          No pieces found.
        </h3>

        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            marginBottom: '2rem',
            maxWidth: '380px'
          }}
        >
          {searchQuery ? (
            <>We couldn't find any ceramic pieces matching "<strong>{searchQuery}</strong>". Try another search, or explore the full collection.</>
          ) : (
            <>There are currently no pieces under "{activeCategory}". Try another search, or explore the full collection.</>
          )}
        </p>

        <button
          type="button"
          className="btn-primary"
          onClick={onReset}
          style={{ padding: '0.85rem 2rem' }}
        >
          <span>Clear Filters & View All</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
