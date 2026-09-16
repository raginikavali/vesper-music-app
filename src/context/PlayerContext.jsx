import React, { createContext, useReducer, useEffect, useRef } from 'react';
import songsData from '../data/songs.json';
import albumsData from '../data/albums.json';
import artistsData from '../data/artists.json';

export const PlayerContext = createContext();

const initialTrack = songsData[0];

const initialState = {
  currentTrack: initialTrack,
  isPlaying: false,
  manualQueue: [], // User manually added items (left gold border)
  autoQueue: songsData.slice(1, 10), // Auto continued items
  likedSongIds: ['song-1', 'song-4', 'song-8'],
  lovedSongIds: ['song-1'], // Loved tracks (double tap)
  likedAlbumIds: ['album-1', 'album-3'],
  likedArtistIds: ['artist-1'],
  songNotes: {
    'song-1': 'Warm Rhodes and muted rain sounds',
    'song-4': 'Perfect for 3 AM late night coding'
  },
  volume: 0.8,
  savedVolumeBeforeFade: 0.8,
  progress: 0,
  duration: initialTrack.durationSec || 252,
  activeRoute: 'discover',
  routeParams: {},
  isQueueOpen: false,
  isNowPlayingExpanded: false,
  isMuted: false,
  focusMode: false,
  // Sleep Timer: { active, minutes, remainingSec, initialSec }
  sleepTimer: { active: false, minutes: null, remainingSec: null, initialSec: null },
  // Listening Session Receipt tracker
  sessionHistory: [songsData[0], songsData[1], songsData[2], songsData[3], songsData[4]],
  isReceiptModalOpen: false,
};

function playerReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_TRACK': {
      const track = action.payload;
      const history = state.sessionHistory.some(s => s.id === track.id)
        ? state.sessionHistory
        : [...state.sessionHistory, track];
      return {
        ...state,
        currentTrack: track,
        isPlaying: true,
        progress: 0,
        duration: track.durationSec || 240,
        sessionHistory: history,
      };
    }
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload, isMuted: action.payload === 0 };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    
    // Split Queue Actions
    case 'SET_MANUAL_QUEUE':
      return { ...state, manualQueue: action.payload };
    case 'SET_AUTO_QUEUE':
      return { ...state, autoQueue: action.payload };
    case 'ADD_TO_MANUAL_QUEUE':
      return { ...state, manualQueue: [...state.manualQueue, action.payload] };
    case 'REMOVE_FROM_MANUAL_QUEUE':
      return { ...state, manualQueue: state.manualQueue.filter((_, idx) => idx !== action.payload) };
    case 'REMOVE_FROM_AUTO_QUEUE':
      return { ...state, autoQueue: state.autoQueue.filter((_, idx) => idx !== action.payload) };
    case 'REORDER_MANUAL_QUEUE': {
      const { fromIndex, toIndex } = action.payload;
      if (toIndex < 0 || toIndex >= state.manualQueue.length) return state;
      const newQueue = [...state.manualQueue];
      const [moved] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, moved);
      return { ...state, manualQueue: newQueue };
    }
    case 'REORDER_AUTO_QUEUE': {
      const { fromIndex, toIndex } = action.payload;
      if (toIndex < 0 || toIndex >= state.autoQueue.length) return state;
      const newQueue = [...state.autoQueue];
      const [moved] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, moved);
      return { ...state, autoQueue: newQueue };
    }

    // Two-tap Like State (Empty -> Liked -> Loved -> Empty)
    case 'CYCLE_LIKE_SONG': {
      const id = action.payload;
      const isLiked = state.likedSongIds.includes(id);
      const isLoved = state.lovedSongIds.includes(id);

      if (!isLiked && !isLoved) {
        // Empty -> Liked
        return {
          ...state,
          likedSongIds: [...state.likedSongIds, id],
        };
      } else if (isLiked && !isLoved) {
        // Liked -> Loved
        return {
          ...state,
          lovedSongIds: [...state.lovedSongIds, id],
        };
      } else {
        // Loved -> Empty
        return {
          ...state,
          likedSongIds: state.likedSongIds.filter(i => i !== id),
          lovedSongIds: state.lovedSongIds.filter(i => i !== id),
        };
      }
    }

    // Song Notes
    case 'SET_SONG_NOTE':
      return {
        ...state,
        songNotes: {
          ...state.songNotes,
          [action.payload.songId]: action.payload.note,
        },
      };

    case 'TOGGLE_LIKE_ALBUM': {
      const id = action.payload;
      const exists = state.likedAlbumIds.includes(id);
      return {
        ...state,
        likedAlbumIds: exists
          ? state.likedAlbumIds.filter(i => i !== id)
          : [...state.likedAlbumIds, id],
      };
    }
    case 'TOGGLE_LIKE_ARTIST': {
      const id = action.payload;
      const exists = state.likedArtistIds.includes(id);
      return {
        ...state,
        likedArtistIds: exists
          ? state.likedArtistIds.filter(i => i !== id)
          : [...state.likedArtistIds, id],
      };
    }

    // Sleep Timer
    case 'START_SLEEP_TIMER': {
      const mins = action.payload;
      if (!mins) {
        return {
          ...state,
          sleepTimer: { active: false, minutes: null, remainingSec: null, initialSec: null },
        };
      }
      const totalSec = mins * 60;
      return {
        ...state,
        sleepTimer: { active: true, minutes: mins, remainingSec: totalSec, initialSec: totalSec },
        savedVolumeBeforeFade: state.volume > 0 ? state.volume : 0.8,
      };
    }
    case 'TICK_SLEEP_TIMER': {
      if (!state.sleepTimer.active || state.sleepTimer.remainingSec <= 0) return state;
      const nextSec = state.sleepTimer.remainingSec - 1;

      // Final 30 seconds volume fade down
      let nextVol = state.volume;
      if (nextSec <= 30 && nextSec > 0) {
        const factor = nextSec / 30;
        nextVol = state.savedVolumeBeforeFade * factor;
      }

      if (nextSec <= 0) {
        return {
          ...state,
          isPlaying: false,
          volume: state.savedVolumeBeforeFade,
          sleepTimer: { active: false, minutes: null, remainingSec: null, initialSec: null },
        };
      }

      return {
        ...state,
        volume: nextVol,
        sleepTimer: { ...state.sleepTimer, remainingSec: nextSec },
      };
    }
    case 'CANCEL_SLEEP_TIMER':
      return {
        ...state,
        volume: state.savedVolumeBeforeFade || state.volume,
        sleepTimer: { active: false, minutes: null, remainingSec: null, initialSec: null },
      };

    // Focus Mode
    case 'TOGGLE_FOCUS_MODE':
      return { ...state, focusMode: !state.focusMode };
    case 'SET_FOCUS_MODE':
      return { ...state, focusMode: action.payload };

    // Receipt Modal
    case 'SET_RECEIPT_MODAL_OPEN':
      return { ...state, isReceiptModalOpen: action.payload };

    case 'NAVIGATE':
      return {
        ...state,
        activeRoute: action.payload.route,
        routeParams: action.payload.params || {},
        isNowPlayingExpanded: false,
      };
    case 'TOGGLE_QUEUE_DRAWER':
      return { ...state, isQueueOpen: !state.isQueueOpen };
    case 'SET_NOW_PLAYING_EXPANDED':
      return { ...state, isNowPlayingExpanded: action.payload };
    case 'TOGGLE_NOW_PLAYING_EXPANDED':
      return { ...state, isNowPlayingExpanded: !state.isNowPlayingExpanded };
    default:
      return state;
  }
}

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef(null);
  const synthTimerRef = useRef(null);
  const sleepIntervalRef = useRef(null);

  // Audio setup
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_PROGRESS', payload: audio.currentTime });
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        dispatch({ type: 'SET_DURATION', payload: audio.duration });
      }
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  // Sync audio source when currentTrack changes
  useEffect(() => {
    if (!audioRef.current || !state.currentTrack) return;
    const audio = audioRef.current;
    if (state.currentTrack.audioUrl) {
      audio.src = state.currentTrack.audioUrl;
      audio.currentTime = 0;
      if (state.isPlaying) {
        audio.play().catch(() => startSynthTimer());
      }
    }
  }, [state.currentTrack?.id]);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    if (state.isPlaying) {
      if (audio.src) {
        audio.play().catch(() => startSynthTimer());
      } else {
        startSynthTimer();
      }
    } else {
      audio.pause();
      stopSynthTimer();
    }
  }, [state.isPlaying]);

  // Sync volume & mute
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = state.isMuted ? 0 : state.volume;
  }, [state.volume, state.isMuted]);

  // Sleep Timer countdown interval
  useEffect(() => {
    if (state.sleepTimer.active && state.isPlaying) {
      sleepIntervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK_SLEEP_TIMER' });
      }, 1000);
    } else {
      if (sleepIntervalRef.current) {
        clearInterval(sleepIntervalRef.current);
        sleepIntervalRef.current = null;
      }
    }
    return () => {
      if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);
    };
  }, [state.sleepTimer.active, state.isPlaying]);

  // ESC key for Focus Mode exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && state.focusMode) {
        dispatch({ type: 'SET_FOCUS_MODE', payload: false });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.focusMode]);

  // Synth timer simulation fallback
  const startSynthTimer = () => {
    stopSynthTimer();
    synthTimerRef.current = setInterval(() => {
      dispatch({
        type: 'SET_PROGRESS',
        payload: (audioRef.current?.currentTime || 0) + 1,
      });
    }, 1000);
  };

  const stopSynthTimer = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  // Track playback queue helper: manual items drain first!
  const playNext = () => {
    if (state.manualQueue.length > 0) {
      const nextTrack = state.manualQueue[0];
      dispatch({ type: 'REMOVE_FROM_MANUAL_QUEUE', payload: 0 });
      dispatch({ type: 'SET_CURRENT_TRACK', payload: nextTrack });
    } else if (state.autoQueue.length > 0) {
      const currentIndex = state.autoQueue.findIndex(t => t.id === state.currentTrack?.id);
      const nextIndex = (currentIndex + 1) % state.autoQueue.length;
      dispatch({ type: 'SET_CURRENT_TRACK', payload: state.autoQueue[nextIndex] });
    }
  };

  const playPrev = () => {
    if (state.autoQueue.length > 0) {
      const currentIndex = state.autoQueue.findIndex(t => t.id === state.currentTrack?.id);
      const prevIndex = (currentIndex - 1 + state.autoQueue.length) % state.autoQueue.length;
      dispatch({ type: 'SET_CURRENT_TRACK', payload: state.autoQueue[prevIndex] });
    }
  };

  const rewind15s = () => {
    const newTime = Math.max(0, (audioRef.current?.currentTime || state.progress) - 15);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    dispatch({ type: 'SET_PROGRESS', payload: newTime });
  };

  const playTrack = (track, newAutoQueue = null) => {
    if (newAutoQueue) {
      dispatch({ type: 'SET_AUTO_QUEUE', payload: newAutoQueue });
    }
    dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
  };

  const playAlbum = (album) => {
    const albumTracks = songsData.filter(s => s.albumId === album.id || album.trackIds?.includes(s.id));
    if (albumTracks.length > 0) {
      dispatch({ type: 'SET_AUTO_QUEUE', payload: albumTracks });
      dispatch({ type: 'SET_CURRENT_TRACK', payload: albumTracks[0] });
    }
  };

  const seekTo = (seconds) => {
    if (audioRef.current && !isNaN(seconds)) {
      audioRef.current.currentTime = seconds;
    }
    dispatch({ type: 'SET_PROGRESS', payload: seconds });
  };

  const navigateTo = (route, params = {}) => {
    dispatch({ type: 'NAVIGATE', payload: { route, params } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const value = {
    ...state,
    songs: songsData,
    albums: albumsData,
    artists: artistsData,
    dispatch,
    playTrack,
    playAlbum,
    playNext,
    playPrev,
    rewind15s,
    seekTo,
    navigateTo,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}
