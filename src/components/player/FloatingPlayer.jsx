import React, { useState } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import PlayButton from '../ui/PlayButton';
import LikeButton from '../ui/LikeButton';
import Slider from '../ui/Slider';
import SleepTimer from '../ui/SleepTimer';
import { RotateCcw, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, ChevronUp, Sparkles } from 'lucide-react';
import GeneratedCover from '../ui/GeneratedCover';

function formatTime(seconds = 0) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function FloatingPlayer() {
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
    isQueueOpen,
    toggleQueue,
    toggleNowPlayingExpanded,
    cycleLikeSong,
    isSongLiked,
    isSongLoved,
    sessionHistory,
    setReceiptModalOpen,
  } = usePlayer();

  const [isRotating, setIsRotating] = useState(false);

  const handleRewind15 = () => {
    setIsRotating(true);
    rewind15s();
    setTimeout(() => setIsRotating(false), 300);
  };

  const isLiked = currentTrack ? isSongLiked(currentTrack.id) : false;
  const isLoved = currentTrack ? isSongLoved(currentTrack.id) : false;

  return (
    <div
      className="floating-player-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(680px, calc(100vw - 32px))',
        height: '76px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'rgba(28, 25, 30, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(244, 241, 236, 0.12)',
        boxShadow: 'var(--shadow-player)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px 0 12px',
        gap: '12px',
        userSelect: 'none',
        transition: 'all 300ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      {/* Thumbnail + Track Metadata / Empty State */}
      <div
        onClick={toggleNowPlayingExpanded}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: '160px',
          maxWidth: '210px',
          cursor: 'pointer',
        }}
        title="Click to expand Now Playing"
      >
        {currentTrack ? (
          <>
            <GeneratedCover seed={currentTrack.albumId || currentTrack.id} image={currentTrack.coverArt} alt={`${currentTrack.title} artwork`} width="48px" height="48px" borderRadius="var(--radius-full)" style={{ flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
              <span
                className="font-display"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentTrack.title}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentTrack.artist}
              </span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            <span>Nothing playing — pick something</span>
          </div>
        )}
      </div>

      {/* Center Controls & Scrubber */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {/* Control Buttons: Rewind 15s + Prev + Play + Next */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Rewind 15s Button with 360° counter-clockwise rotation */}
          <button
            onClick={handleRewind15}
            title="Rewind 15s"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '11px',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            <div
              style={{
                transform: isRotating ? 'rotate(-360deg)' : 'rotate(0deg)',
                transition: isRotating ? 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <RotateCcw size={16} strokeWidth={1.5} color="var(--color-text-secondary)" />
              <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>15</span>
            </div>
          </button>

          <button
            onClick={playPrev}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            aria-label="Previous Track"
          >
            <SkipBack size={18} strokeWidth={1.5} color="var(--color-text-secondary)" />
          </button>

          <PlayButton
            size="sm"
            isPlaying={isPlaying}
            onClick={togglePlay}
          />

          <button
            onClick={playNext}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            aria-label="Next Track"
          >
            <SkipForward size={18} strokeWidth={1.5} color="var(--color-text-secondary)" />
          </button>
        </div>

        {/* Scrubber Progress Slider */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              minWidth: '32px',
              textAlign: 'right',
            }}
          >
            {formatTime(progress)}
          </span>

          <Slider
            value={progress}
            min={0}
            max={duration || 100}
            onChangeEnd={(val) => seekTo(val)}
            height={3}
          />

          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              minWidth: '32px',
            }}
          >
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right Controls: Receipt Chip (5+ tracks), Sleep Timer, Like, Volume, Queue, Chevron Expand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Listening Receipt Chip (Appears after 5+ session tracks) */}
        {sessionHistory.length >= 5 && (
          <button
            onClick={() => setReceiptModalOpen(true)}
            title="View Listening Receipt"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(232, 182, 90, 0.15)',
              color: 'var(--color-accent)',
              border: '1px solid rgba(232, 182, 90, 0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 180ms cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <Sparkles size={12} strokeWidth={1.5} color="var(--color-accent)" />
            <span>Receipt</span>
          </button>
        )}

        {/* Sleep Fade Timer Component */}
        <SleepTimer />

        {currentTrack && (
          <LikeButton
            isLiked={isLiked}
            isLoved={isLoved}
            onToggle={() => cycleLikeSong(currentTrack.id)}
            size={18}
          />
        )}

        {/* Volume Controls */}
        <div
          className="desktop-volume-ctrl"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            width: '76px',
          }}
        >
          <button
            onClick={toggleMute}
            style={{
              background: 'none',
              border: 'none',
              color: isMuted ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
            }}
          >
            {isMuted ? <VolumeX size={16} strokeWidth={1.5} color="var(--color-accent)" /> : <Volume2 size={16} strokeWidth={1.5} color="var(--color-text-secondary)" />}
          </button>
          <Slider
            value={isMuted ? 0 : volume}
            min={0}
            max={1}
            onChange={(val) => setVolume(val)}
            height={3}
          />
        </div>

        {/* Queue Drawer Toggle */}
        <button
          onClick={toggleQueue}
          aria-label="Queue Drawer"
          style={{
            background: 'none',
            border: 'none',
            color: isQueueOpen ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            borderRadius: 'var(--radius-full)',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            if (!isQueueOpen) e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
          onMouseLeave={(e) => {
            if (!isQueueOpen) e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          <ListMusic size={18} strokeWidth={1.5} color="var(--color-text-secondary)" />
        </button>

        {/* Expand Chevron to Fullscreen Now Playing */}
        <button
          onClick={toggleNowPlayingExpanded}
          aria-label="Expand Now Playing"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            borderRadius: 'var(--radius-full)',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        >
          <ChevronUp size={18} strokeWidth={1.5} color="var(--color-text-secondary)" />
        </button>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .floating-player-container {
            bottom: 72px !important;
            width: calc(100vw - 24px) !important;
            height: 64px !important;
            border-radius: var(--radius-lg) !important;
            padding: 0 12px !important;
          }
          .desktop-volume-ctrl {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
