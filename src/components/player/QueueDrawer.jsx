import React from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import PlayButton from '../ui/PlayButton';
import { X, ArrowUp, ArrowDown, Trash2, ListMusic, Sparkles } from '../ui/Icons';
import GeneratedCover from '../ui/GeneratedCover';

function formatEndTime(totalSeconds) {
  const now = new Date();
  const endTime = new Date(now.getTime() + totalSeconds * 1000);
  let hours = endTime.getHours();
  const minutes = endTime.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minsStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minsStr} ${ampm}`;
}

export default function QueueDrawer() {
  const {
    isQueueOpen,
    toggleQueue,
    manualQueue,
    autoQueue,
    currentTrack,
    isPlaying,
    togglePlay,
    playTrack,
    reorderManualQueue,
    reorderAutoQueue,
    removeFromManualQueue,
    removeFromAutoQueue,
  } = usePlayer();

  if (!isQueueOpen) return null;

  // Calculate total time budget
  const manualSeconds = manualQueue.reduce((acc, t) => acc + (t.durationSec || 240), 0);
  const autoSeconds = autoQueue.reduce((acc, t) => acc + (t.durationSec || 240), 0);
  const totalRemainingSec = manualSeconds + autoSeconds;
  const totalMins = Math.round(totalRemainingSec / 60);
  const computedEndTime = formatEndTime(totalRemainingSec);

  return (
    <>
      {/* Dim Backdrop */}
      <div
        onClick={toggleQueue}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(18, 16, 19, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 60,
        }}
      />

      {/* 380px Right-Side Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '380px',
          maxWidth: '100vw',
          backgroundColor: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-divider)',
          boxShadow: 'var(--shadow-drawer)',
          zIndex: 70,
          display: 'flex',
          flexDirection: 'column',
          animation: 'drawerSlideIn 350ms cubic-bezier(0.32, 0.72, 0, 1) forwards',
        }}
      >
        {/* Drawer Header with Time Budget */}
        <header
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '20px 20px',
            borderBottom: '1px solid var(--color-divider)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ListMusic size={20} style={{ color: 'var(--color-accent)' }} />
              <span className="caption" style={{ color: 'var(--color-text-primary)' }}>
                PLAY QUEUE
              </span>
            </div>

            <button
              onClick={toggleQueue}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                borderRadius: 'var(--radius-full)',
              }}
              aria-label="Close Queue"
            >
              <X size={20} />
            </button>
          </div>

          {/* Time Budget Sub-Header */}
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} />
            <span>{totalMins} min remaining · ends {computedEndTime}</span>
          </div>
        </header>

        {/* Pinned "Now Playing" Section */}
        {currentTrack && (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--color-surface-elevated)',
              borderBottom: '1px solid var(--color-divider)',
            }}
          >
            <div className="caption" style={{ fontSize: '11px', marginBottom: '10px', color: 'var(--color-accent)' }}>
              NOW PLAYING
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <GeneratedCover seed={currentTrack.albumId || currentTrack.id} width="44px" height="44px" borderRadius="var(--radius-sm)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  className="font-display"
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currentTrack.title}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currentTrack.artist}
                </span>
              </div>

              <PlayButton size="sm" isPlaying={isPlaying} onClick={togglePlay} />
            </div>
          </div>
        )}

        {/* Scrollable Split Queue Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          {/* SECTION 1: "PLAYING NEXT" (Manually added, Gold Left Border) */}
          <div style={{ marginBottom: '24px' }}>
            <div className="caption" style={{ padding: '0 8px 10px 8px', fontSize: '11px', color: 'var(--color-accent)' }}>
              PLAYING NEXT (MANUALLY QUEUED - {manualQueue.length})
            </div>

            {manualQueue.length === 0 ? (
              <div style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--color-text-secondary)', fontStyle: 'italic', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(244,241,236,0.02)' }}>
                No manual tracks queued. Add items to prioritize them!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {manualQueue.map((track, idx) => (
                  <div
                    key={`manual-${track.id}-${idx}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px 8px 12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-surface-elevated)',
                      borderLeft: '3px solid var(--color-accent)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                  >
                    <GeneratedCover seed={track.albumId || track.id} width="36px" height="36px" borderRadius="var(--radius-sm)" style={{ flexShrink: 0 }} />
                    <div onClick={() => playTrack(track)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {track.title}
                      </span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {track.artist}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <button onClick={() => reorderManualQueue(idx, idx - 1)} disabled={idx === 0} style={{ background: 'none', border: 'none', color: idx === 0 ? 'rgba(244,241,236,0.15)' : 'var(--color-text-secondary)', cursor: idx === 0 ? 'default' : 'pointer', padding: '4px', display: 'flex' }} aria-label="Move Up">
                        <ArrowUp size={14} />
                      </button>
                      <button onClick={() => reorderManualQueue(idx, idx + 1)} disabled={idx === manualQueue.length - 1} style={{ background: 'none', border: 'none', color: idx === manualQueue.length - 1 ? 'rgba(244,241,236,0.15)' : 'var(--color-text-secondary)', cursor: idx === manualQueue.length - 1 ? 'default' : 'pointer', padding: '4px', display: 'flex' }} aria-label="Move Down">
                        <ArrowDown size={14} />
                      </button>
                      <button onClick={() => removeFromManualQueue(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex' }} aria-label="Remove Track">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: "UP NEXT" (Auto-continued, Muted) */}
          <div>
            <div className="caption" style={{ padding: '0 8px 10px 8px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              UP NEXT (AUTO-CONTINUED - {autoQueue.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {autoQueue.map((track, idx) => {
                const isPlayingThis = currentTrack?.id === track.id;
                return (
                  <div
                    key={`auto-${track.id}-${idx}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isPlayingThis ? 'var(--color-surface-elevated)' : 'transparent',
                      opacity: isPlayingThis ? 1 : 0.75,
                      transition: 'background-color var(--transition-fast), opacity var(--transition-fast)',
                    }}
                  >
                    <GeneratedCover seed={track.albumId || track.id} width="36px" height="36px" borderRadius="var(--radius-sm)" style={{ flexShrink: 0 }} />
                    <div onClick={() => playTrack(track)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                      <span style={{ fontFamily: isPlayingThis ? 'var(--font-display)' : 'var(--font-ui)', fontSize: '14px', fontWeight: isPlayingThis ? 600 : 400, color: isPlayingThis ? 'var(--color-accent)' : 'var(--color-text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {track.title}
                      </span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {track.artist}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <button onClick={() => reorderAutoQueue(idx, idx - 1)} disabled={idx === 0} style={{ background: 'none', border: 'none', color: idx === 0 ? 'rgba(244,241,236,0.15)' : 'var(--color-text-secondary)', cursor: idx === 0 ? 'default' : 'pointer', padding: '4px', display: 'flex' }} aria-label="Move Up">
                        <ArrowUp size={14} />
                      </button>
                      <button onClick={() => reorderAutoQueue(idx, idx + 1)} disabled={idx === autoQueue.length - 1} style={{ background: 'none', border: 'none', color: idx === autoQueue.length - 1 ? 'rgba(244,241,236,0.15)' : 'var(--color-text-secondary)', cursor: idx === autoQueue.length - 1 ? 'default' : 'pointer', padding: '4px', display: 'flex' }} aria-label="Move Down">
                        <ArrowDown size={14} />
                      </button>
                      <button onClick={() => removeFromAutoQueue(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex' }} aria-label="Remove Track">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        @keyframes drawerSlideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
