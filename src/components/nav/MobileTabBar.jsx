import React from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { Compass, Search, Library, ListMusic } from '../ui/Icons';

export default function MobileTabBar() {
  const { activeRoute, navigateTo, isQueueOpen, toggleQueue } = usePlayer();

  const items = [
    { id: 'discover', label: 'Discover', icon: Compass, action: () => navigateTo('discover') },
    { id: 'search', label: 'Search', icon: Search, action: () => navigateTo('search') },
    { id: 'library', label: 'Library', icon: Library, action: () => navigateTo('library') },
    { id: 'queue', label: 'Queue', icon: ListMusic, action: toggleQueue, isActiveOverride: isQueueOpen },
  ];

  return (
    <nav
      className="mobile-tab-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'rgba(28, 25, 30, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--color-divider)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.isActiveOverride !== undefined ? item.isActiveOverride : activeRoute === item.id;

        return (
          <button
            key={item.id}
            onClick={item.action}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '6px 12px',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Icon size={20} />
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.02em',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
