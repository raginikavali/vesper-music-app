import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }

  const {
    currentTrack,
    isPlaying,
    manualQueue,
    autoQueue,
    likedSongIds,
    lovedSongIds,
    likedAlbumIds,
    likedArtistIds,
    songNotes,
    volume,
    isMuted,
    progress,
    duration,
    activeRoute,
    routeParams,
    isQueueOpen,
    isNowPlayingExpanded,
    focusMode,
    sleepTimer,
    sessionHistory,
    isReceiptModalOpen,
    songs,
    albums,
    artists,
    dispatch,
    playTrack,
    playAlbum,
    playNext,
    playPrev,
    rewind15s,
    seekTo,
    navigateTo,
  } = context;

  const togglePlay = () => dispatch({ type: 'TOGGLE_PLAY' });
  const setVolume = (val) => dispatch({ type: 'SET_VOLUME', payload: val });
  const toggleMute = () => dispatch({ type: 'TOGGLE_MUTE' });

  // Two-Tap Like
  const cycleLikeSong = (songId) => dispatch({ type: 'CYCLE_LIKE_SONG', payload: songId });
  const isSongLiked = (songId) => likedSongIds.includes(songId);
  const isSongLoved = (songId) => lovedSongIds.includes(songId);

  const toggleLikeAlbum = (albumId) => dispatch({ type: 'TOGGLE_LIKE_ALBUM', payload: albumId });
  const toggleLikeArtist = (artistId) => dispatch({ type: 'TOGGLE_LIKE_ARTIST', payload: artistId });

  const isAlbumLiked = (albumId) => likedAlbumIds.includes(albumId);
  const isArtistLiked = (artistId) => likedArtistIds.includes(artistId);

  // Song Notes
  const setSongNote = (songId, note) => dispatch({ type: 'SET_SONG_NOTE', payload: { songId, note } });

  // Queue actions
  const addToManualQueue = (track) => dispatch({ type: 'ADD_TO_MANUAL_QUEUE', payload: track });
  const removeFromManualQueue = (index) => dispatch({ type: 'REMOVE_FROM_MANUAL_QUEUE', payload: index });
  const removeFromAutoQueue = (index) => dispatch({ type: 'REMOVE_FROM_AUTO_QUEUE', payload: index });
  const reorderManualQueue = (fromIndex, toIndex) => dispatch({ type: 'REORDER_MANUAL_QUEUE', payload: { fromIndex, toIndex } });
  const reorderAutoQueue = (fromIndex, toIndex) => dispatch({ type: 'REORDER_AUTO_QUEUE', payload: { fromIndex, toIndex } });

  const toggleQueue = () => dispatch({ type: 'TOGGLE_QUEUE_DRAWER' });
  const setNowPlayingExpanded = (expanded) => dispatch({ type: 'SET_NOW_PLAYING_EXPANDED', payload: expanded });
  const toggleNowPlayingExpanded = () => dispatch({ type: 'TOGGLE_NOW_PLAYING_EXPANDED' });

  // Sleep Timer
  const startSleepTimer = (minutes) => dispatch({ type: 'START_SLEEP_TIMER', payload: minutes });
  const cancelSleepTimer = () => dispatch({ type: 'CANCEL_SLEEP_TIMER' });

  // Focus Mode
  const toggleFocusMode = () => dispatch({ type: 'TOGGLE_FOCUS_MODE' });
  const setFocusMode = (val) => dispatch({ type: 'SET_FOCUS_MODE', payload: val });

  // Receipt Modal
  const setReceiptModalOpen = (val) => dispatch({ type: 'SET_RECEIPT_MODAL_OPEN', payload: val });

  return {
    currentTrack,
    isPlaying,
    manualQueue,
    autoQueue,
    likedSongIds,
    lovedSongIds,
    likedAlbumIds,
    likedArtistIds,
    songNotes,
    volume,
    isMuted,
    progress,
    duration,
    activeRoute,
    routeParams,
    isQueueOpen,
    isNowPlayingExpanded,
    focusMode,
    sleepTimer,
    sessionHistory,
    isReceiptModalOpen,
    songs,
    albums,
    artists,
    togglePlay,
    playTrack,
    playAlbum,
    playNext,
    playPrev,
    rewind15s,
    seekTo,
    setVolume,
    toggleMute,
    cycleLikeSong,
    isSongLiked,
    isSongLoved,
    toggleLikeAlbum,
    toggleLikeArtist,
    isAlbumLiked,
    isArtistLiked,
    setSongNote,
    addToManualQueue,
    removeFromManualQueue,
    removeFromAutoQueue,
    reorderManualQueue,
    reorderAutoQueue,
    navigateTo,
    toggleQueue,
    setNowPlayingExpanded,
    toggleNowPlayingExpanded,
    startSleepTimer,
    cancelSleepTimer,
    toggleFocusMode,
    setFocusMode,
    setReceiptModalOpen,
  };
}
