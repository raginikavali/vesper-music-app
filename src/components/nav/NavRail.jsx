import React, { useState } from 'react';
import Logo from './Logo';
import { usePlayer } from '../../hooks/usePlayer';
import { Compass, Search, Library, ListMusic, Sparkles } from 'lucide-react';

export default function NavRail() {
  const { activeRoute, navigateTo, isQueueOpen, toggleQueue, toggleFocusMode, focusMode } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Library', icon: Library },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: isHovered ? 'var(--nav-rail-expanded-width)' : 'var(--nav-rail-width)',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-divider)',
        zIndex: 40,
        transition: 'width 200ms cubic-bezier(0.32, 0.72, 0, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 0',
        overflow: 'hidden',
        boxShadow: isHovered ? '12px 0 32px rgba(0,0,0,0.4)' : 'none',
      }}
      className="desktop-only-rail"
    >
      {/* Top Header / Logo Area (24px from top, centered horizontally when collapsed) */}
      <div
        onClick={() => navigateTo('discover')}
        style={{
          padding: '0 20px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isHovered ? 'flex-start' : 'center',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        <Logo size="md" showWordmark={isHovered} />
      </div>

      {/* Main Nav Items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 12px 0 12px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                height: '48px',
                padding: '0 13px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'rgba(232, 182, 90, 0.06)' : 'transparent',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 180ms cubic-bezier(0.32, 0.72, 0, 1)',
                position: 'relative',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
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
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {/* 3px Gold Bar Flush to Left Edge */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '10%',
                    bottom: '10%',
                    width: '3px',
                    backgroundColor: 'var(--color-accent)',
                    borderRadius: '0 2px 2px 0',
                  }}
                />
              )}

              <Icon size={22} strokeWidth={1.5} color={isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)'} style={{ flexShrink: 0 }} />

              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '15px',
                  fontWeight: isActive ? 600 : 400,
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
                  transition: 'opacity 200ms ease, transform 200ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Nav Items: Focus Mode Toggle & Queue Drawer Toggle */}
      <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Focus Mode Toggle */}
        <button
          onClick={toggleFocusMode}
          title="Toggle Focus Mode"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            height: '48px',
            padding: '0 13px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: focusMode ? 'rgba(232, 182, 90, 0.12)' : 'transparent',
            color: focusMode ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'all 180ms cubic-bezier(0.32, 0.72, 0, 1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            if (!focusMode) {
              e.currentTarget.style.color = 'var(--color-text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (!focusMode) {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <Sparkles size={22} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: focusMode ? 600 : 400,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
              transition: 'opacity 200ms ease, transform 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            Focus Mode
          </span>
        </button>

        {/* Play Queue Toggle */}
        <button
          onClick={toggleQueue}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            height: '48px',
            padding: '0 13px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isQueueOpen ? 'rgba(232, 182, 90, 0.06)' : 'transparent',
            color: isQueueOpen ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'all 180ms cubic-bezier(0.32, 0.72, 0, 1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            if (!isQueueOpen) {
              e.currentTarget.style.color = 'var(--color-text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isQueueOpen) {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <ListMusic size={22} strokeWidth={1.5} style={{ flexShrink: 0 }} />

          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: isQueueOpen ? 600 : 400,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
              transition: 'opacity 200ms ease, transform 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            Play Queue
          </span>
        </button>
      </div>
    </aside>
  );
}
