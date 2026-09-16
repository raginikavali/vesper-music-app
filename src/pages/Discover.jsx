import React from 'react';
import { usePlayer } from '../hooks/usePlayer';
import PlayButton from '../components/ui/PlayButton';
import LikeButton from '../components/ui/LikeButton';
import MoodDial from '../components/ui/MoodDial';
import MediaCard from '../components/cards/MediaCard';
import TrackRow from '../components/cards/TrackRow';
import GeneratedCover from '../components/ui/GeneratedCover';
import SectionHeader from '../components/ui/SectionHeader';
import { Sparkles, Compass } from 'lucide-react';

export default function Discover() {
  const { albums, artists, songs, playAlbum, playTrack, isAlbumLiked, cycleLikeSong, toggleLikeAlbum, navigateTo } = usePlayer();

  const featuredAlbum = albums[0] || {};
  const isFeaturedLiked = isAlbumLiked(featuredAlbum.id);

  const editorsPick = albums[1] || albums[0];
  const bentoAlbums = albums.slice(2, 6);
  const trendingSongs = songs.slice(0, 5);

  return (
    <div className="page-enter" style={{ paddingBottom: '180px' }}>
      {/* Feature E: Unboxed Hero Section (Full-width, 60/40 off-center split, Generated Cover bleed, Diagonal scrim) */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '480px',
          marginBottom: '48px',
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        className="unboxed-hero-section"
      >
        {/* Left 60%: Hero Text Content & Actions */}
        <div
          style={{
            zIndex: 2,
            paddingRight: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="caption" style={{ color: 'var(--color-accent)' }}>
              FEATURED RELEASE
            </span>
            <span style={{ color: 'var(--color-text-secondary)' }}>•</span>
            <span className="caption">{featuredAlbum.genre}</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>•</span>
            <span className="caption">{featuredAlbum.releaseYear}</span>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              lineHeight: 1.05,
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {featuredAlbum.title}
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '16px',
              color: 'var(--color-text-secondary)',
              maxWidth: '520px',
              lineHeight: 1.6,
            }}
          >
            {featuredAlbum.description} Recorded live in 3 AM analogue sessions by{' '}
            <strong
              onClick={() => navigateTo('artist', { id: featuredAlbum.artistId })}
              style={{ color: 'var(--color-text-primary)', cursor: 'pointer' }}
            >
              {featuredAlbum.artist}
            </strong>.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <PlayButton
                size="lg"
                variant="gold"
                onClick={() => playAlbum(featuredAlbum)}
              />
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                }}
              >
                PLAY ALBUM
              </span>
            </div>

            <LikeButton
              isLiked={isFeaturedLiked}
              onToggle={() => toggleLikeAlbum(featuredAlbum.id)}
              size={24}
            />
          </div>
        </div>

        {/* Right 40%: Full Bleed Deterministic Generative Cover Art with Diagonal Scrim */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '480px',
            borderRadius: '24px',
            overflow: 'hidden',
          }}
        >
          <GeneratedCover seed={featuredAlbum.id} image={featuredAlbum.coverArt} alt={`${featuredAlbum.title} artwork`} borderRadius="24px" width="100%" height="100%" />

          {/* Diagonal Soft-Edged Scrim blending into page background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, var(--color-base) 0%, rgba(18,16,19,0.5) 45%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </section>

      {/* Feature E: Asymmetric Bento Grid (12px gaps, varied heights & radii, mixed content) */}
      <section style={{ marginBottom: '64px' }}>
        {/* Negative top margin on section header for visual overlap continuity */}
        <div style={{ marginTop: '-24px', marginBottom: '24px' }}>
          <SectionHeader
            label="CURATED BENTO"
            title="Editorial Selection"
            subtitle="Asymmetric midnight curation of albums, tracks, and atmospheric dials"
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '12px',
          }}
          className="bento-grid-container"
        >
          {/* Tile 1: Mood Dial Embedded Tile (Spans 8 columns) */}
          <div style={{ gridColumn: 'span 8', minHeight: '340px' }} className="bento-tile bento-span-8">
            <MoodDial songs={songs} />
          </div>

          {/* Tile 2: Oversized "Editor's Pick" Tile (Spans 4 columns, 24px radius, large Playfair text over generated art) */}
          <div
            onClick={() => navigateTo('album', { id: editorsPick.id })}
            style={{
              gridColumn: 'span 4',
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative',
              minHeight: '340px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              boxShadow: 'var(--shadow-card)',
              cursor: 'pointer',
              border: '1px solid var(--color-divider)',
              transition: 'transform 180ms cubic-bezier(0.32, 0.72, 0, 1)',
            }}
            className="bento-tile bento-span-4"
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <GeneratedCover seed={editorsPick.id} image={editorsPick.coverArt} alt={`${editorsPick.title} artwork`} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,16,19,0.92) 0%, rgba(18,16,19,0.3) 60%)', zIndex: 1 }} />

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="caption" style={{ color: 'var(--color-accent)' }}>EDITOR'S PICK</span>
              <PlayButton size="sm" variant="gold" onClick={() => playAlbum(editorsPick)} />
            </div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 className="font-display" style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                {editorsPick.title}
              </h2>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                {editorsPick.artist}
              </p>
            </div>
          </div>

          {/* Tile 3: Trending Singles List (Spans 7 columns) */}
          <div
            style={{
              gridColumn: 'span 7',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid var(--color-divider)',
            }}
            className="bento-tile bento-span-7"
          >
            <div className="caption" style={{ marginBottom: '12px', color: 'var(--color-accent)' }}>
              MIDNIGHT SINGLES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {trendingSongs.map((song, idx) => (
                <TrackRow key={song.id} track={song} index={idx} playlist={trendingSongs} />
              ))}
            </div>
          </div>

          {/* Tile 4: Smaller 1x1 Album Cards (Spans 5 columns, 2x2 internal grid) */}
          <div
            style={{
              gridColumn: 'span 5',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}
            className="bento-tile bento-span-5"
          >
            {bentoAlbums.map((album) => (
              <MediaCard key={album.id} item={album} variant="album" style={{ borderRadius: '12px' }} />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .bento-span-8 { grid-column: span 12 !important; }
          .bento-span-4 { grid-column: span 12 !important; }
          .bento-span-7 { grid-column: span 12 !important; }
          .bento-span-5 { grid-column: span 12 !important; }
        }
        @media (max-width: 767px) {
          .unboxed-hero-section {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
