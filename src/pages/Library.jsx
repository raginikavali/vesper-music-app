import React, { useState } from 'react';
import { usePlayer } from '../hooks/usePlayer';
import TrackRow from '../components/cards/TrackRow';
import MediaCard from '../components/cards/MediaCard';
import EmptyState from '../components/ui/EmptyState';
import { Heart, Disc3 as Disc, Users, Music } from 'lucide-react';
import GeneratedCover from '../components/ui/GeneratedCover';

export default function Library() {
  const { songs, albums, artists, likedSongIds, lovedSongIds, likedAlbumIds, likedArtistIds, navigateTo } = usePlayer();
  const [activeTab, setActiveTab] = useState('songs'); // 'songs' | 'albums' | 'artists'
  const [isMosaicHovered, setIsMosaicHovered] = useState(false);

  const likedSongs = songs.filter(s => likedSongIds.includes(s.id));
  const lovedSongs = songs.filter(s => lovedSongIds.includes(s.id));
  const likedAlbums = albums.filter(a => likedAlbumIds.includes(a.id));
  const likedArtists = artists.filter(ar => likedArtistIds.includes(ar.id));

  // Stat line total minutes calculation
  const totalSeconds = likedSongs.reduce((acc, t) => acc + (t.durationSec || 240), 0);
  const totalMins = Math.round(totalSeconds / 60);

  // 4 most recent liked album covers for the Scrapbook Mosaic
  const recentAlbums = (likedAlbums.length >= 4 ? likedAlbums : albums).slice(0, 4);

  const tabIndexMap = { songs: 0, albums: 1, artists: 2 };

  return (
    <div className="page-enter" style={{ paddingBottom: '180px' }}>
      {/* Header Container with Scrapbook Artwork Mosaic */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          paddingTop: '16px',
        }}
      >
        <div>
          <div className="caption" style={{ marginBottom: '8px' }}>
            YOUR COLLECTION
          </div>

          <h1 className="h1" style={{ marginBottom: '8px' }}>
            Library
          </h1>

          {/* Stat line in Inter 13px muted */}
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
            }}
          >
            {likedSongs.length} songs · {likedAlbums.length} albums · {likedArtists.length} artists · {totalMins} min
          </p>
        </div>

        {/* 2x2 Scrapbook Artwork Mosaic */}
        <div
          onMouseEnter={() => setIsMosaicHovered(true)}
          onMouseLeave={() => setIsMosaicHovered(false)}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 56px)',
            gap: '4px',
            cursor: 'pointer',
            padding: '12px',
            position: 'relative',
          }}
          title="Your recent collection artwork"
          onClick={() => setActiveTab('albums')}
        >
          {recentAlbums.map((album, idx) => {
            const defaultRotations = [-4, 2, -2, 3];
            const fanRotations = [-12, 10, -8, 14];
            const rot = isMosaicHovered ? fanRotations[idx] : defaultRotations[idx];

            return (
              <GeneratedCover
                key={idx}
                seed={album.id}
                image={album.coverArt}
                alt={`${album.title} artwork`}
                width="56px"
                height="56px"
                borderRadius="var(--radius-md)"
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  transform: `rotate(${rot}deg) scale(${isMosaicHovered ? 1.08 : 1})`,
                  transition: 'transform 240ms cubic-bezier(0.32, 0.72, 0, 1)',
                  zIndex: 4 - idx,
                }}
              />
            );
          })}
        </div>
      </header>

      {/* Sliding Gold Indicator Tab Switcher */}
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            backgroundColor: 'var(--color-surface)',
            padding: '6px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-divider)',
          }}
        >
          {/* Animated Gold Indicator background slider */}
          <div
            style={{
              position: 'absolute',
              top: '6px',
              bottom: '6px',
              width: 'calc(33.33% - 4px)',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid rgba(232, 182, 90, 0.3)',
              borderRadius: 'var(--radius-full)',
              transform: `translateX(${tabIndexMap[activeTab] * 100}%)`,
              transition: 'transform 240ms cubic-bezier(0.32, 0.72, 0, 1)',
              pointerEvents: 'none',
            }}
          />

          <button
            onClick={() => setActiveTab('songs')}
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '8px 24px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'transparent',
              color: activeTab === 'songs' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              border: 'none',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color var(--transition-fast)',
            }}
          >
            Liked Songs ({likedSongs.length})
          </button>

          <button
            onClick={() => setActiveTab('albums')}
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '8px 24px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'transparent',
              color: activeTab === 'albums' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              border: 'none',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color var(--transition-fast)',
            }}
          >
            Albums ({likedAlbums.length})
          </button>

          <button
            onClick={() => setActiveTab('artists')}
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '8px 24px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'transparent',
              color: activeTab === 'artists' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              border: 'none',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color var(--transition-fast)',
            }}
          >
            Artists ({likedArtists.length})
          </button>
        </div>
      </div>

      {/* Tab Content: Songs Tab */}
      {activeTab === 'songs' && (
        likedSongs.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nothing here yet"
            description="Explore our catalogue and double tap the gold heart icon to love your favorite midnight tracks."
            actionText="Discover Songs"
            onAction={() => navigateTo('discover')}
          />
        ) : (
          <div>
            {/* Feature 8: "Loved" Pinned Section when tracks are double-tap loved */}
            {lovedSongs.length > 0 && (
              <section style={{ marginBottom: '32px' }}>
                <div
                  className="caption"
                  style={{
                    color: 'var(--color-accent)',
                    marginBottom: '16px',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                  }}
                >
                  LOVED SELECTIONS ({lovedSongs.length})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {lovedSongs.map((song, index) => (
                    <TrackRow
                      key={`loved-${song.id}`}
                      track={song}
                      index={index}
                      playlist={lovedSongs}
                    />
                  ))}
                </div>

                {/* Section Hairline Divider */}
                <div style={{ borderBottom: '1px solid var(--color-divider)', margin: '24px 0' }} />
              </section>
            )}

            {/* Standard Liked Songs */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {likedSongs.map((song, index) => (
                <TrackRow
                  key={song.id}
                  track={song}
                  index={index}
                  playlist={likedSongs}
                />
              ))}
            </div>
          </div>
        )
      )}

      {/* Tab Content: Albums Tab */}
      {activeTab === 'albums' && (
        likedAlbums.length === 0 ? (
          <EmptyState
            icon={Disc}
            title="Nothing here yet"
            description="You haven't saved any full length albums to your collection."
            actionText="Discover Albums"
            onAction={() => navigateTo('discover')}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            {likedAlbums.map((album) => (
              <MediaCard key={album.id} item={album} variant="album" />
            ))}
          </div>
        )
      )}

      {/* Tab Content: Artists Tab */}
      {activeTab === 'artists' && (
        likedArtists.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nothing here yet"
            description="Follow performers to save them in your personal collection."
            actionText="Explore Artists"
            onAction={() => navigateTo('search')}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            {likedArtists.map((artist) => (
              <MediaCard key={artist.id} item={artist} variant="artist" />
            ))}
          </div>
        )
      )}
    </div>
  );
}
