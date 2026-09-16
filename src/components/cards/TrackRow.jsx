import React, { useState } from 'react';
import { Play, Pause, Heart, ListMusic, Quote } from '../ui/Icons';
import LikeButton from '../ui/LikeButton';
import GeneratedCover from '../ui/GeneratedCover';
import { usePlayer } from '../../hooks/usePlayer';

export default function TrackRow({
  track,
  index = 0,
  showAlbum = true,
  playlist = [],
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    playTrack,
    togglePlay,
    cycleLikeSong,
    isSongLiked,
    isSongLoved,
    songNotes,
    setSongNote,
    addToManualQueue,
    navigateTo,
  } = usePlayer();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isPlayingCurrent = isCurrentTrack && isPlaying;
  const isLiked = isSongLiked(track.id);
  const isLoved = isSongLoved(track.id);
  const existingNote = songNotes[track.id];

  const handleRowClick = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track, playlist.length > 0 ? playlist : undefined);
    }
  };

  const handleSaveNote = (e) => {
    if (e.key === 'Enter') {
      setSongNote(track.id, noteInput);
      setIsEditingNote(false);
    } else if (e.key === 'Escape') {
      setIsEditingNote(false);
    }
  };

  // Mini Waveform progress ratio calculation
  const currentRatio = isCurrentTrack ? Math.min(1, Math.max(0, progress / (duration || 1))) : 0;

  return (
    <div
      onClick={handleRowClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: showAlbum ? '40px 1fr 1fr 60px 70px 100px' : '40px 1fr 60px 70px 100px',
        alignItems: 'center',
        gap: '16px',
        height: '72px',
        padding: '0 16px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: isCurrentTrack
          ? 'rgba(232, 182, 90, 0.07)'
          : isHovered
          ? 'var(--color-surface-elevated)'
          : 'var(--color-surface)',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'all 180ms cubic-bezier(0.32, 0.72, 0, 1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        position: 'relative',
        userSelect: 'none',
        animation: 'trackRowFadeUp 300ms ease forwards',
        animationDelay: `${index * 30}ms`,
        opacity: 0,
      }}
      className="upgraded-track-row"
    >
      {/* Gold Left Border on Hover or Active Track */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '12%',
          bottom: '12%',
          width: isCurrentTrack ? '3px' : isHovered ? '3px' : '0px',
          backgroundColor: 'var(--color-accent)',
          borderRadius: '0 2px 2px 0',
          transition: 'width 180ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      />

      {/* Index / Play / Animated Equalizer Bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          color: isCurrentTrack ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          fontSize: '14px',
          fontFamily: 'var(--font-ui)',
          fontWeight: 500,
        }}
      >
        {isPlayingCurrent ? (
          <div className="equalizer-bars">
            <div className="equalizer-bar" />
            <div className="equalizer-bar" />
            <div className="equalizer-bar" />
          </div>
        ) : isHovered ? (
          <Play size={16} fill="currentColor" style={{ color: 'var(--color-text-primary)' }} />
        ) : (
          <span>{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>

      {/* Track info (48px Album Art + Title + Note Caption) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <GeneratedCover seed={track.albumId || track.id} width="48px" height="48px" borderRadius="var(--radius-md)" style={{ flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, width: '100%' }}>
          <span
            style={{
              fontFamily: isCurrentTrack ? 'var(--font-display)' : 'var(--font-ui)',
              fontSize: '15px',
              fontWeight: isCurrentTrack ? 600 : 500,
              color: isCurrentTrack ? 'var(--color-accent)' : 'var(--color-text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {track.title}
          </span>

          {/* Inline Note Editor or Saved Gold-Italic Note Caption */}
          {isEditingNote ? (
            <input
              type="text"
              autoFocus
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyDown={handleSaveNote}
              onClick={(e) => e.stopPropagation()}
              onBlur={() => setIsEditingNote(false)}
              placeholder="Add song note... (Press Enter)"
              style={{
                background: 'none',
                border: 'none',
                borderBottom: '1px solid var(--color-accent)',
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                fontStyle: 'italic',
                outline: 'none',
                width: '90%',
              }}
            />
          ) : existingNote ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setNoteInput(existingNote);
                setIsEditingNote(true);
              }}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                fontStyle: 'italic',
                color: 'var(--color-accent)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              📝 {existingNote}
            </span>
          ) : (
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (track.artistId) navigateTo('artist', { id: track.artistId });
              }}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {track.artist}
            </span>
          )}
        </div>
      </div>

      {/* Album Title Column */}
      {showAlbum && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            if (track.albumId) navigateTo('album', { id: track.albumId });
          }}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {track.album}
        </span>
      )}

      {/* Mini SVG Waveform Strip (40x24) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
          {/* Muted Gray Base Waveform Bars */}
          <rect x="2" y="8" width="3" height="8" rx="1.5" fill="rgba(244,241,236,0.18)" />
          <rect x="7" y="4" width="3" height="16" rx="1.5" fill="rgba(244,241,236,0.18)" />
          <rect x="12" y="10" width="3" height="4" rx="1.5" fill="rgba(244,241,236,0.18)" />
          <rect x="17" y="2" width="3" height="20" rx="1.5" fill="rgba(244,241,236,0.18)" />
          <rect x="22" y="6" width="3" height="12" rx="1.5" fill="rgba(244,241,236,0.18)" />
          <rect x="27" y="3" width="3" height="18" rx="1.5" fill="rgba(244,241,236,0.18)" />
          <rect x="32" y="9" width="3" height="6" rx="1.5" fill="rgba(244,241,236,0.18)" />

          {/* Gold Filled Overlay up to play position ratio */}
          <rect x="2" y="8" width="3" height="8" rx="1.5" fill={currentRatio >= 0.1 ? 'var(--color-accent)' : 'transparent'} />
          <rect x="7" y="4" width="3" height="16" rx="1.5" fill={currentRatio >= 0.25 ? 'var(--color-accent)' : 'transparent'} />
          <rect x="12" y="10" width="3" height="4" rx="1.5" fill={currentRatio >= 0.4 ? 'var(--color-accent)' : 'transparent'} />
          <rect x="17" y="2" width="3" height="20" rx="1.5" fill={currentRatio >= 0.55 ? 'var(--color-accent)' : 'transparent'} />
          <rect x="22" y="6" width="3" height="12" rx="1.5" fill={currentRatio >= 0.7 ? 'var(--color-accent)' : 'transparent'} />
          <rect x="27" y="3" width="3" height="18" rx="1.5" fill={currentRatio >= 0.85 ? 'var(--color-accent)' : 'transparent'} />
          <rect x="32" y="9" width="3" height="6" rx="1.5" fill={currentRatio >= 0.95 ? 'var(--color-accent)' : 'transparent'} />
        </svg>
      </div>

      {/* Duration */}
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-text-secondary)', textAlign: 'right' }}>
        {track.duration}
      </span>

      {/* Hover Reveal Actions (Note Edit, Add to Queue, Two-Tap Like) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
        {/* Note Icon (Fades in on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setNoteInput(existingNote || '');
            setIsEditingNote(true);
          }}
          title="Add song note"
          style={{
            background: 'none',
            border: 'none',
            color: existingNote ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            opacity: isHovered || existingNote ? 1 : 0,
            transition: 'opacity 180ms ease, color 180ms ease',
            display: 'flex',
          }}
        >
          <Quote size={15} />
        </button>

        {/* Add to Queue (Fades in on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToManualQueue(track);
          }}
          title="Add to Playing Next Queue"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 180ms ease, color 180ms ease',
            display: 'flex',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        >
          <ListMusic size={15} />
        </button>

        {/* Two-Tap Like Button (Always visible) */}
        <LikeButton
          isLiked={isLiked}
          isLoved={isLoved}
          onToggle={() => cycleLikeSong(track.id)}
          size={16}
        />
      </div>

      <style>{`
        @keyframes trackRowFadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
