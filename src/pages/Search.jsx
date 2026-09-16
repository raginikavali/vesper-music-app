import React, { useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import Chip from '../components/ui/Chip';
import MediaCard from '../components/cards/MediaCard';
import TrackRow from '../components/cards/TrackRow';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import { Search as SearchIcon, X } from '../components/ui/Icons';

export default function Search() {
  const { query, setQuery, selectedGenre, setSelectedGenre, genres, results } = useSearch();
  const [isFocused, setIsFocused] = useState(false);

  const hasSearch = query.trim().length > 0 || selectedGenre !== 'All';

  return (
    <div className="page-enter" style={{ paddingBottom: '180px' }}>
      {/* Header & Large Borderless Input */}
      <section style={{ marginBottom: '40px', paddingTop: '16px' }}>
        <div className="caption" style={{ marginBottom: '12px' }}>
          EXPLORE CATALOGUE
        </div>

        {/* Serif Input Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 0',
            }}
          >
            <SearchIcon
              size={28}
              style={{
                color: isFocused ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                transition: 'color var(--transition-fast)',
                flexShrink: 0,
              }}
            />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search songs, albums, artists..."
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            />

            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                }}
              >
                <X size={24} />
              </button>
            )}
          </div>

          {/* Static Divider Base Line */}
          <div
            style={{
              width: '100%',
              height: '1px',
              backgroundColor: 'var(--color-divider)',
            }}
          />

          {/* Animated Gold Focus Line (Expands Outward) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '2px',
              backgroundColor: 'var(--color-accent)',
              transform: isFocused ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'center',
              transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          />
        </div>

        {/* Genre Chips Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            overflowX: 'auto',
            paddingTop: '24px',
            paddingBottom: '8px',
            scrollbarWidth: 'none',
          }}
        >
          {genres.map((g) => (
            <Chip
              key={g}
              label={g}
              isActive={selectedGenre === g}
              onClick={() => setSelectedGenre(g)}
            />
          ))}
        </div>
      </section>

      {/* Results View */}
      {hasSearch && results.totalCount === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No Matching Music Found"
          description={`We couldn't find any results for "${query}". Try searching for another artist, track name, or genre.`}
          actionText="Clear Search"
          onAction={() => {
            setQuery('');
            setSelectedGenre('All');
          }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-rhythm)' }}>
          {/* Songs Group */}
          {results.songs.length > 0 && (
            <section>
              <SectionHeader
                label="TRACKS"
                title="Songs"
                subtitle={`Found ${results.songs.length} song matches`}
              />

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-divider)',
                  overflow: 'hidden',
                }}
              >
                {results.songs.map((song, index) => (
                  <TrackRow
                    key={song.id}
                    track={song}
                    index={index}
                    playlist={results.songs}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Albums Group */}
          {results.albums.length > 0 && (
            <section>
              <SectionHeader
                label="DISCOGRAPHY"
                title="Albums"
                subtitle={`Found ${results.albums.length} album matches`}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '20px',
                }}
              >
                {results.albums.map((album) => (
                  <MediaCard key={album.id} item={album} variant="album" />
                ))}
              </div>
            </section>
          )}

          {/* Artists Group */}
          {results.artists.length > 0 && (
            <section>
              <SectionHeader
                label="CREATORS"
                title="Artists"
                subtitle={`Found ${results.artists.length} artist matches`}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '20px',
                }}
              >
                {results.artists.map((artist) => (
                  <MediaCard key={artist.id} item={artist} variant="artist" />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
