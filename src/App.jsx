import React, { useEffect, useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { usePlayer } from './hooks/usePlayer';
import NavRail from './components/nav/NavRail';
import MobileTabBar from './components/nav/MobileTabBar';
import FloatingPlayer from './components/player/FloatingPlayer';
import NowPlaying from './components/player/NowPlaying';
import QueueDrawer from './components/player/QueueDrawer';
import ListeningReceipt from './components/ui/ListeningReceipt';
import IntroSplash from './components/ui/IntroSplash';
import CursorGlow from './components/ui/CursorGlow';
import GlobalGrain from './components/ui/GlobalGrain';

// Pages
import Discover from './pages/Discover';
import Search from './pages/Search';
import Library from './pages/Library';
import AlbumDetail from './pages/AlbumDetail';
import ArtistDetail from './pages/ArtistDetail';

// Styles
import './styles/tokens.css';

function MainLayout() {
  const { activeRoute, focusMode } = usePlayer();
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      const bounds = button.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 6;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
      button.style.setProperty('--magnetic-x', `${x}px`);
      button.style.setProperty('--magnetic-y', `${y}px`);
    };

    const resetMagneticButton = (event) => {
      const button = event.target.closest('button');
      if (button) {
        button.style.setProperty('--magnetic-x', '0px');
        button.style.setProperty('--magnetic-y', '0px');
      }
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerout', resetMagneticButton);
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerout', resetMagneticButton);
    };
  }, []);

  const renderRoute = () => {
    switch (activeRoute) {
      case 'discover':
        return <Discover />;
      case 'search':
        return <Search />;
      case 'library':
        return <Library />;
      case 'album':
        return <AlbumDetail />;
      case 'artist':
        return <ArtistDetail />;
      default:
        return <Discover />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-base)',
        color: 'var(--color-text-primary)',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(232, 182, 90, 0.035) 0%, transparent 70%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Desktop Left Rail Nav */}
      <NavRail />

      {/* Main Content Area (Margin-left: 72px, Max-width 1180px, Padding: 56px 48px 160px) */}
      <main
        className="app-main-content"
        style={{
          flex: 1,
          maxWidth: '1180px',
          marginLeft: 'var(--nav-rail-width)',
          marginRight: 'auto',
          padding: '56px 48px 180px 48px',
          width: 'calc(100% - var(--nav-rail-width))',
          boxSizing: 'border-box',
          opacity: focusMode ? 0 : introComplete ? 1 : 0,
          transform: focusMode ? 'scale(0.98)' : introComplete ? 'scale(1)' : 'scale(0.97)',
          filter: introComplete ? 'blur(0)' : 'blur(8px)',
          pointerEvents: focusMode || !introComplete ? 'none' : 'auto',
          transition: 'opacity 420ms cubic-bezier(0.32, 0.72, 0, 1), transform 420ms cubic-bezier(0.32, 0.72, 0, 1), filter 420ms ease',
        }}
      >
        {renderRoute()}
      </main>

      <CursorGlow />
      <GlobalGrain />
      <IntroSplash onComplete={() => setIntroComplete(true)} />

      {/* Floating Pill Player (Always visible) */}
      <FloatingPlayer />

      {/* Full-screen Expanded Now Playing & Focus Mode View */}
      <NowPlaying />

      {/* Slide-in Split Queue Drawer */}
      <QueueDrawer />

      {/* Session Listening Receipt Modal */}
      <ListeningReceipt />

      {/* Mobile Bottom Navigation Tab Bar (<768px) */}
      <MobileTabBar />

      <style>{`
        @media (max-width: 767px) {
          .desktop-only-rail {
            display: none !important;
          }
          .app-main-content {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 24px 20px 180px 20px !important;
          }
        }
        @media (min-width: 768px) {
          .mobile-tab-bar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <MainLayout />
    </PlayerProvider>
  );
}
