import React from 'react';
import { usePlayer } from '../hooks/usePlayer';
import LikeButton from '../components/ui/LikeButton';
import TrackRow from '../components/cards/TrackRow';
import MediaCard from '../components/cards/MediaCard';
import SectionHeader from '../components/ui/SectionHeader';
import GeneratedCover from '../components/ui/GeneratedCover';
import { BadgeCheck, Users, ArrowLeft } from 'lucide-react';

export default function ArtistDetail() {
  const { artists, songs, albums, routeParams, isArtistLiked, toggleLikeArtist, navigateTo } = usePlayer();

  const artistId = routeParams?.id || 'artist-1';
  const artist = artists.find(a => a.id === artistId) || artists[0];

  const artistSongs = songs.filter(s => s.artistId === artist.id || s.artist === artist.name);
  const artistAlbums = albums.filter(a => a.artistId === artist.id || a.artist === artist.name);
  const isLiked = isArtistLiked(artist.id);

  return (
    <div className="page-enter" style={{ paddingBottom: '180px' }}>
      {/* Back Link */}
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

      {/* Hero Artist Header with Scrim */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: 'var(--section-rhythm)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-divider)',
          padding: '48px',
          display: 'flex',
          alignItems: 'flex-end',
          minHeight: '380px',
        }}
      >
        {/* Background Generative Artwork */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <GeneratedCover seed={artist.id} image={artist.heroImage} alt={`${artist.name} artist artwork`} width="100%" height="100%" style={{ filter: 'brightness(0.45)' }} />
        </div>

        {/* Gradient Scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, var(--color-base) 0%, rgba(18,16,19,0.5) 60%, transparent 100%)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            width: '100%',
          }}
          className="artist-header-content"
        >
          {/* Circular Generative Avatar */}
          <div
            style={{
              width: '180px',
              height: '180px',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card-hover)',
              border: '3px solid var(--color-accent)',
              flexShrink: 0,
            }}
          >
            <GeneratedCover seed={artist.id} image={artist.avatar} alt={`${artist.name} portrait`} width="100%" height="100%" borderRadius="9999px" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BadgeCheck size={20} strokeWidth={1.5} color="var(--color-accent)" />
              <span className="caption" style={{ color: 'var(--color-accent)' }}>
                VERIFIED ARTIST
              </span>
            </div>

            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(32px, 5vw, 52px)',
                lineHeight: 1.1,
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              {artist.name}
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                color: 'var(--color-text-secondary)',
                maxWidth: '640px',
                lineHeight: 1.6,
              }}
            >
              {artist.bio}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
                <Users size={16} strokeWidth={1.5} color="var(--color-text-secondary)" />
                <span style={{ fontSize: '14px', fontFamily: 'var(--font-ui)', fontWeight: 500 }}>
                  {artist.monthlyListeners} monthly listeners
                </span>
              </div>

              <LikeButton
                isLiked={isLiked}
                onToggle={() => toggleLikeArtist(artist.id)}
                size={22}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Tracks */}
      {artistSongs.length > 0 && (
        <section style={{ marginBottom: 'var(--section-rhythm)' }}>
          <SectionHeader
            label="POPULAR"
            title="Top Tracks"
            subtitle="Most played releases by listeners after hours"
          />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {artistSongs.map((song, index) => (
              <TrackRow
                key={song.id}
                track={song}
                index={index}
                playlist={artistSongs}
              />
            ))}
          </div>
        </section>
      )}

      {/* Discography Albums */}
      {artistAlbums.length > 0 && (
        <section>
          <SectionHeader
            label="DISCOGRAPHY"
            title="Albums & EPs"
            subtitle="Complete studio album catalog"
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            {artistAlbums.map((album) => (
              <MediaCard key={album.id} item={album} variant="album" />
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 767px) {
          .artist-header-content {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}
