import React from 'react';

export default function SectionHeader({ label, title, subtitle, actionText, onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '24px',
      }}
    >
      <div>
        {label && <div className="caption" style={{ marginBottom: '6px' }}>{label}</div>}
        {title && <h2 className="h2">{title}</h2>}
        {subtitle && (
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '14px',
              marginTop: '4px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px 8px',
            transition: 'color var(--transition-fast)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
        >
          {actionText} →
        </button>
      )}
    </div>
  );
}
