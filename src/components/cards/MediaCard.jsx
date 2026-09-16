import React, { useState } from 'react';
import PlayButton from '../ui/PlayButton';
import LikeButton from '../ui/LikeButton';
import GeneratedCover from '../ui/GeneratedCover';
import { usePlayer } from '../../hooks/usePlayer';

export default function MediaCard({
  item,
  variant = 'album', // 'album' | 'artist' | 'song'
  style = {},
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { currentTrack, isPlaying, playTrack, playAlbum, navigateTo, cycleLikeSong, isSongLiked, isSongLoved, toggleLikeAlbum, isAlbumLiked } = usePlayer();

  const isCurrentPlaying =
    variant === 'song'
      ? currentTrack?.id === item.id && isPlaying
      : false;

  const handleCardClick = () => {
    if (variant === 'album') {
      navigateTo('album', { id: item.id });
    } else if (variant === 'artist') {
      navigateTo('artist', { id: item.id });
    } else if (variant === 'song') {
      playTrack(item);
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (variant === 'album') {
      playAlbum(item);
    } else if (variant === 'song') {
      playTrack(item);
    } else if (variant === 'artist') {
      navigateTo('artist', { id: item.id });
    }
  };

  const isLiked =
    variant === 'song'
      ? isSongLiked(item.id)
      : variant === 'album'
      ? isAlbumLiked(item.id)
      : false;

  const isLoved = variant === 'song' ? isSongLoved(item.id) : false;

  const handleLikeToggle = () => {
    if (variant === 'song') cycleLikeSong(item.id);
    if (variant === 'album') toggleLikeAlbum(item.id);
  };

  const isArtist = variant === 'artist';
  const title = item.title || item.name;
  const subtitle = isArtist
    ? `${item.monthlyListeners || '1.2M'} listeners`
    : item.artist || item.genre;

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '14px',
        borderRadius: isArtist ? 'var(--radius-xl)' : 'var(--radius-lg)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-divider)',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transition: 'all 180ms cubic-bezier(0.32, 0.72, 0, 1)',
        position: 'relative',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Generative Abstract Artwork Container */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: isArtist ? 'var(--radius-full)' : 'var(--radius-md)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <GeneratedCover
          seed={item.id || title}
          image={isArtist ? item.avatar : item.coverArt}
          alt={`${title} artwork`}
          borderRadius={isArtist ? 'var(--radius-full)' : 'var(--radius-md)'}
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 400ms cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        />

        {/* Soft Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(18,16,19,0.6) 0%, transparent 60%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 250ms ease',
          }}
        />

        {/* Floating Bottom-Right Play Button */}
        {!isArtist && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              opacity: isHovered || isCurrentPlaying ? 1 : 0,
              transform: isHovered || isCurrentPlaying ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 220ms ease, transform 220ms cubic-bezier(0.32, 0.72, 0, 1)',
              zIndex: 10,
            }}
          >
            <PlayButton
              size="md"
              isPlaying={isCurrentPlaying}
              onClick={handlePlayClick}
            />
          </div>
        )}

        {/* Top-Right Like Button */}
        {!isArtist && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              opacity: isHovered || isLiked || isLoved ? 1 : 0,
              transition: 'opacity 200ms ease',
              zIndex: 10,
            }}
          >
            <LikeButton isLiked={isLiked} isLoved={isLoved} onToggle={handleLikeToggle} size={18} />
          </div>
        )}
      </div>

      {/* Metadata Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h3
          className="font-display"
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </h3>
        
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
