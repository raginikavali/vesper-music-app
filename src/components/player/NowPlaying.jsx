import React, { useState } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import PlayButton from '../ui/PlayButton';
import LikeButton from '../ui/LikeButton';
import Slider from '../ui/Slider';
import {
  ChevronDown,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Quote,
  Sparkles,
} from 'lucide-react';
import GeneratedCover from '../ui/GeneratedCover';

function formatTime(seconds = 0) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function NowPlaying() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    rewind15s,
    progress,
    duration,
    seekTo,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isNowPlayingExpanded,
    setNowPlayingExpanded,
    focusMode,
    setFocusMode,
    cycleLikeSong,
    isSongLiked,
    isSongLoved,
    navigateTo,
    toggleQueue,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState('player'); // 'player' | 'lyrics'
  const [isRotating, setIsRotating] = useState(false);

  const isOpen = isNowPlayingExpanded || focusMode;

  if (!isOpen || !currentTrack) return null;

  const handleRewind15 = () => {
    setIsRotating(true);
    rewind15s();
    setTimeout(() => setIsRotating(false), 300);
  };

  const isLiked = isSongLiked(currentTrack.id);
  const isLoved = isSongLoved(currentTrack.id);

  const handleDismiss = () => {
    setNowPlayingExpanded(false);
    setFocusMode(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'var(--color-base)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        animation: 'nowPlayingSlideUp 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards',
      }}
    >
      {/* Blurred Album Art Background Bleed */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: focusMode ? 'blur(90px) brightness(0.18) saturate(1.2)' : 'blur(70px) brightness(0.25) saturate(1.4)',
          transform: 'scale(1.2)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        >
          <GeneratedCover seed={currentTrack.albumId || currentTrack.id} image={currentTrack.coverArt} alt={`${currentTrack.title} artwork`} style={{ width: '100%', height: '100%' }} />
        </div>

      {/* Top Header Bar */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(244,241,236,0.06)',
            border: '1px solid var(--color-divider)',
            color: 'var(--color-text-primary)',
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(244,241,236,0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(244,241,236,0.06)')}
          aria-label="Collapse Now Playing"
        >
          <ChevronDown size={24} strokeWidth={1.5} color="var(--color-text-primary)" />
        </button>

        {/* View Toggle Tabs (Now Playing / Lyrics) */}
        {!focusMode && (
          <div
            style={{
              display: 'flex',
              gap: '4px',
              backgroundColor: 'rgba(244,241,236,0.08)',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-divider)',
            }}
          >
            <button
              onClick={() => setActiveTab('player')}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeTab === 'player' ? 'var(--color-surface-elevated)' : 'transparent',
                color: activeTab === 'player' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                border: 'none',
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              NOW PLAYING
            </button>
            <button
              onClick={() => setActiveTab('lyrics')}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeTab === 'lyrics' ? 'var(--color-surface-elevated)' : 'transparent',
                color: activeTab === 'lyrics' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                border: 'none',
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              LYRICS
            </button>
          </div>
        )}

        {focusMode ? (
          <span className="caption" style={{ color: 'var(--color-accent)' }}>
            FOCUS MODE (ESC TO EXIT)
          </span>
        ) : (
          <button
            onClick={() => {
              setNowPlayingExpanded(false);
              toggleQueue();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '8px',
            }}
            aria-label="Open Queue"
          >
            <ListMusic size={22} strokeWidth={1.5} color="var(--color-text-secondary)" />
          </button>
        )}
      </header>

      {/* Main Content Body */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%',
          padding: '20px 32px',
        }}
      >
        {activeTab === 'player' || focusMode ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '32px',
              width: '100%',
              maxWidth: focusMode ? '480px' : '440px',
            }}
          >
            {/* Huge Centered Album Artwork */}
            <div
              style={{
                width: '100%',
                maxHeight: focusMode ? '420px' : '380px',
                aspectRatio: '1/1',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(232, 182, 90, 0.1)',
                border: '1px solid rgba(244,241,236,0.15)',
              }}
            >
              <GeneratedCover seed={currentTrack.albumId || currentTrack.id} image={currentTrack.coverArt} alt={`${currentTrack.title} artwork`} style={{ width: '100%', height: '100%' }} />
            </div>

            {/* Title & Artist & Two-Tap Like */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h1
                  className="font-display"
                  style={{
                    fontSize: '32px',
                    lineHeight: 1.2,
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {currentTrack.title}
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    onClick={() => {
                      handleDismiss();
                      if (currentTrack.artistId) navigateTo('artist', { id: currentTrack.artistId });
                    }}
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '18px',
                      color: 'var(--color-text-secondary)',
                      cursor: currentTrack.artistId ? 'pointer' : 'default',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                  >
                    {currentTrack.artist}
                  </span>
                  
                  <span style={{ color: 'var(--color-text-secondary)' }}>•</span>
                  
                  <span
                    onClick={() => {
                      handleDismiss();
                      if (currentTrack.albumId) navigateTo('album', { id: currentTrack.albumId });
                    }}
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '14px',
                      color: 'var(--color-text-secondary)',
                      cursor: currentTrack.albumId ? 'pointer' : 'default',
                    }}
                  >
                    {currentTrack.album}
                  </span>
                </div>
              </div>

              <LikeButton
                isLiked={isLiked}
                isLoved={isLoved}
                onToggle={() => cycleLikeSong(currentTrack.id)}
                size={26}
              />
            </div>

            {/* Precision Scrubber Slider */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Slider
                value={progress}
                min={0}
                max={duration || 100}
                onChangeEnd={(val) => seekTo(val)}
                height={5}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="caption">{formatTime(progress)}</span>
                <span className="caption">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Playback Controls + Rewind 15s */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              <button
                onClick={handleRewind15}
                title="Rewind 15s"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                <div
                  style={{
                    transform: isRotating ? 'rotate(-360deg)' : 'rotate(0deg)',
                    transition: isRotating ? 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)' : 'none',
                  }}
                >
                  <SkipBack size={16} strokeWidth={1.5} color="var(--color-text-primary)" />
                  <span style={{ fontSize: '12px' }}>15</span>
                </div>
              </button>

              <button
                onClick={playPrev}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                }}
              >
                <SkipBack size={26} strokeWidth={1.5} color="var(--color-text-primary)" />
              </button>

              <PlayButton
                size="lg"
                isPlaying={isPlaying}
                onClick={togglePlay}
              />

              <button
                onClick={playNext}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                }}
              >
                <SkipForward size={26} strokeWidth={1.5} color="var(--color-text-primary)" />
              </button>
            </div>
          </div>
        ) : (
          /* Lyrics View */
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              padding: '24px',
              backgroundColor: 'rgba(28,25,30,0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-divider)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--color-accent)',
                marginBottom: '24px',
              }}
            >
              <Quote size={20} strokeWidth={1.5} color="var(--color-accent)" />
              <span className="caption">LYRICS & NOTES</span>
            </div>

            <pre
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                lineHeight: 1.8,
                color: 'var(--color-text-primary)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {currentTrack.lyrics || "No lyrics available for this track."}
            </pre>
          </div>
        )}
      </main>

      {/* Footer Volume Controls */}
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '24px 32px 36px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <button
          onClick={toggleMute}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          {isMuted ? <VolumeX size={20} strokeWidth={1.5} color="var(--color-text-secondary)" /> : <Volume2 size={20} strokeWidth={1.5} color="var(--color-text-secondary)" />}
        </button>

        <div style={{ width: '160px' }}>
          <Slider
            value={isMuted ? 0 : volume}
            min={0}
            max={1}
            onChange={(val) => setVolume(val)}
            height={4}
          />
        </div>
      </footer>

      <style>{`
        @keyframes nowPlayingSlideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
