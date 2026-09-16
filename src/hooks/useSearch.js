import { useState, useMemo } from 'react';
import songsData from '../data/songs.json';
import albumsData from '../data/albums.json';
import artistsData from '../data/artists.json';

const GENRES = [
  'All',
  'Ambient Jazz',
  'Neo-Classical',
  'Lo-Fi Soul',
  'Dark Electronic',
  'Chamber Pop',
  'Minimal Ambient'
];

export function useSearch() {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    let songs = songsData;
    let albums = albumsData;
    let artists = artistsData;

    // Filter by genre first if selected
    if (selectedGenre !== 'All') {
      songs = songs.filter(s => s.genre?.toLowerCase() === selectedGenre.toLowerCase());
      albums = albums.filter(a => a.genre?.toLowerCase() === selectedGenre.toLowerCase());
      artists = artists.filter(ar => ar.genre?.toLowerCase() === selectedGenre.toLowerCase());
    }

    // Then filter by text query if present
    if (q) {
      songs = songs.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          s.album.toLowerCase().includes(q)
      );
      albums = albums.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.artist.toLowerCase().includes(q) ||
          a.genre.toLowerCase().includes(q)
      );
      artists = artists.filter(
        ar =>
          ar.name.toLowerCase().includes(q) ||
          ar.genre.toLowerCase().includes(q) ||
          ar.bio.toLowerCase().includes(q)
      );
    }

    return {
      songs,
      albums,
      artists,
      totalCount: songs.length + albums.length + artists.length,
    };
  }, [query, selectedGenre]);

  return {
    query,
    setQuery,
    selectedGenre,
    setSelectedGenre,
    genres: GENRES,
    results: filteredResults,
  };
}
