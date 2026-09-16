import React from 'react';
import { Music, Heart, Search } from './Icons';

export default function EmptyState({ icon: Icon = Music, title, description, actionText, onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px border var(--color-divider)',
        margin: '24px 0',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-surface-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-accent)',
          marginBottom: '20px',
        }}
      >
        <Icon size={28} />
      </div>

      <h3 className="h3" style={{ marginBottom: '8px' }}>{title}</h3>
      
      {description && (
        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
            maxWidth: '400px',
            marginBottom: actionText ? '24px' : '0',
          }}
        >
          {description}
        </p>
      )}

      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#121013',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '12px 28px',
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color var(--transition-fast), transform var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
