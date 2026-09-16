import React from 'react';
import { usePlayer } from '../hooks/usePlayer';
import PlayButton from '../components/ui/PlayButton';
import LikeButton from '../components/ui/LikeButton';
import TrackRow from '../components/cards/TrackRow';
import GeneratedCover from '../components/ui/GeneratedCover';
import { Clock, Disc3 as Disc, ArrowLeft } from 'lucide-react';

export default function AlbumDetail() {
  const { albums, songs, routeParams, playAlbum, isAlbumLiked, toggleLikeAlbum, navigateTo } = usePlayer();

  const albumId = routeParams?.id || 'album-1';
  const album = albums.find(a => a.id === albumId) || albums[0];
  const albumTracks = songs.filter(s => s.albumId === album.id || album.trackIds?.includes(s.id));
  const isLiked = isAlbumLiked(album.id);

  const totalSeconds = albumTracks.reduce((acc, t) => acc + (t.durationSec || 240), 0);
  const totalMins = Math.floor(totalSeconds / 60);

  return (
    <div className="page-enter" style={{ paddingBottom: '180px' }}>
      {/* Back Button */}
      <button
        onClick={() => navigateTo('discover')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-ui)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          marginBottom: '24px',
          padding: '4px 0',
          transition: 'color 180ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
      >
        <ArrowLeft size={18} /> Back to Catalogue
      </button>

      {/* Full-Bleed Artwork Header with Gradient Scrim */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '40px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-divider)',
          padding: '48px',
          display: 'flex',
          alignItems: 'flex-end',
          minHeight: '360px',
        }}
      >
        {/* Background Generative Artwork Bleed */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <GeneratedCover seed={album.id} image={album.coverArt} alt={`${album.title} artwork`} width="100%" height="100%" style={{ filter: 'blur(30px) brightness(0.35)' }} />
        </div>

        {/* Gradient Scrim into Base Color */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, var(--color-base) 0%, rgba(18,16,19,0.4) 60%, transparent 100%)',
            zIndex: 1,
          }}
        />

        {/* Content Header Info */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'flex-end',
            gap: '32px',
            width: '100%',
          }}
          className="album-header-content"
        >
          {/* Generative Cover Artwork */}
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card-hover)',
              border: '1px solid rgba(244,241,236,0.15)',
              flexShrink: 0,
            }}
          >
            <GeneratedCover seed={album.id} image={album.coverArt} alt={`${album.title} artwork`} width="100%" height="100%" borderRadius="16px" />
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div className="caption" style={{ color: 'var(--color-accent)' }}>
              ALBUM RELEASE
            </div>

            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                lineHeight: 1.1,
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              {album.title}
            </h1>

            {/* Metadata Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'var(--color-text-secondary)',
                fontSize: '15px',
                fontFamily: 'var(--font-ui)',
                flexWrap: 'wrap',
              }}
            >
              <strong
                onClick={() => navigateTo('artist', { id: album.artistId })}
                style={{ color: 'var(--color-text-primary)', cursor: 'pointer' }}
              >
                {album.artist}
              </strong>
              <span>•</span>
              <span>{album.releaseYear}</span>
              <span>•</span>
              <span>{album.genre}</span>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} strokeWidth={1.5} color="var(--color-text-secondary)" />
                <span>{albumTracks.length} tracks ({totalMins} mins)</span>
              </div>
            </div>

            {/* Play All + Like Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PlayButton
                  size="md"
                  variant="gold"
                  onClick={() => playAlbum(album)}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  PLAY ALL
                </span>
              </div>

              <LikeButton
                isLiked={isLiked}
                onToggle={() => toggleLikeAlbum(album.id)}
                size={22}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Track List Section */}
      <section>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {albumTracks.map((song, index) => (
            <TrackRow
              key={song.id}
              track={song}
              index={index}
              showAlbum={false}
              playlist={albumTracks}
            />
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 767px) {
          .album-header-content {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}
