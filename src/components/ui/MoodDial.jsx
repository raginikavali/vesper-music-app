import React, { useState, useRef, useEffect } from 'react';
import { useMoodMatch } from '../../hooks/useMoodMatch';
import { usePlayer } from '../../hooks/usePlayer';
import PlayButton from './PlayButton';
import { Sparkles } from './Icons';

export default function MoodDial({ songs }) {
  const [handlePos, setHandlePos] = useState({ x: 0.35, y: 0.35 });
  const [isDragging, setIsDragging] = useState(false);
  const [animatedLabel, setAnimatedLabel] = useState("Deep & Quiet");
  const [isLabelAnimating, setIsLabelAnimating] = useState(false);
  const dialRef = useRef(null);

  const { nearestSongs, moodLabel } = useMoodMatch(songs, handlePos);
  const { playTrack, dispatch } = usePlayer();

  // Feature F: Animate mood label with blur-in & letter fade when quadrant label changes
  useEffect(() => {
    if (moodLabel !== animatedLabel) {
      setIsLabelAnimating(true);
      const timer = setTimeout(() => {
        setAnimatedLabel(moodLabel);
        setIsLabelAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [moodLabel, animatedLabel]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosFromEvent(e);

    const handlePointerMove = (moveEv) => {
      updatePosFromEvent(moveEv);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const updatePosFromEvent = (e) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = cy - e.clientY;
    const radius = rect.width / 2 - 16;

    const distance = Math.min(radius, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);

    const handlePxX = Math.cos(angle) * distance;
    const handlePxY = Math.sin(angle) * distance;

    const normX = Math.max(0, Math.min(1, 0.5 + handlePxX / (2 * radius)));
    const normY = Math.max(0, Math.min(1, 0.5 + handlePxY / (2 * radius)));

    setHandlePos({ x: normX, y: normY });
  };

  const handlePlayMoodQueue = () => {
    if (nearestSongs.length > 0) {
      dispatch({ type: 'SET_AUTO_QUEUE', payload: nearestSongs });
      playTrack(nearestSongs[0]);
    }
  };

  const ringSize = 220;
  const ringRadius = 90;
  const handleAngle = Math.atan2((handlePos.y - 0.5), (handlePos.x - 0.5));
  const distRatio = Math.sqrt(Math.pow(handlePos.x - 0.5, 2) + Math.pow(handlePos.y - 0.5, 2)) * 2;
  const handleX = ringSize / 2 + Math.cos(handleAngle) * ringRadius * distRatio;
  const handleY = ringSize / 2 - Math.sin(handleAngle) * ringRadius * distRatio;

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '24px',
        border: '1px solid var(--color-divider)',
        padding: '32px',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Feature F: Faint Animated Gradient Mesh behind dial shifting toward active quadrant */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${handlePos.x * 100}% ${(1 - handlePos.y) * 100}%, rgba(232, 182, 90, ${0.12 + handlePos.x * 0.08}), rgba(140, 59, 43, ${0.08 + (1 - handlePos.y) * 0.08}) 50%, transparent 80%)`,
          pointerEvents: 'none',
          transition: isDragging ? 'none' : 'background 320ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '32px',
          alignItems: 'center',
        }}
        className="mood-dial-layout"
      >
        {/* Interactive Draggable Dial */}
        <div
          ref={dialRef}
          onPointerDown={handlePointerDown}
          style={{
            position: 'relative',
            width: `${ringSize}px`,
            height: `${ringSize}px`,
            cursor: 'grab',
            touchAction: 'none',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={ringSize} height={ringSize} style={{ position: 'absolute', inset: 0 }}>
            {/* Feature F: Idle-rotate tick marks 2° drift over 20s */}
            <g className="mood-dial-idle-drift">
              <circle cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="rgba(38,34,39,0.7)" stroke="var(--color-divider)" strokeWidth="2" />
              <line x1={ringSize / 2} y1="20" x2={ringSize / 2} y2={ringSize - 20} stroke="rgba(244,241,236,0.08)" strokeDasharray="4 4" />
              <line x1="20" y1={ringSize / 2} x2={ringSize - 20} y2={ringSize / 2} stroke="rgba(244,241,236,0.08)" strokeDasharray="4 4" />
            </g>

            {/* Glowing Accent Ring */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringRadius}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeDasharray={`${ringRadius * 2 * Math.PI}`}
              strokeDashoffset={`${ringRadius * 2 * Math.PI * (1 - (handlePos.x + handlePos.y) / 2)}`}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 8px rgba(232,182,90,0.5))' }}
            />

            {/* Feature F: Connecting line from center to handle with soft gold trailing glow */}
            <line
              x1={ringSize / 2}
              y1={ringSize / 2}
              x2={handleX}
              y2={handleY}
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeOpacity="0.8"
              style={{ filter: 'drop-shadow(0 0 6px rgba(232,182,90,0.6))' }}
            />
          </svg>

          {/* Draggable Handle */}
          <div
            style={{
              position: 'absolute',
              left: `${handleX}px`,
              top: `${handleY}px`,
              width: '24px',
              height: '24px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-accent)',
              border: '3px solid var(--color-base)',
              boxShadow: '0 0 16px var(--color-accent), 0 4px 12px rgba(0,0,0,0.5)',
              transform: 'translate(-50%, -50%)',
              scale: isDragging ? 1.25 : 1,
              transition: isDragging ? 'scale 150ms ease' : 'all 150ms ease',
            }}
          />

          {/* Quadrant Axis Labels */}
          <span style={{ position: 'absolute', top: '6px', fontSize: '10px', fontFamily: 'var(--font-ui)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Uplifting
          </span>
          <span style={{ position: 'absolute', bottom: '6px', fontSize: '10px', fontFamily: 'var(--font-ui)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Melancholy
          </span>
          <span style={{ position: 'absolute', left: '6px', fontSize: '10px', fontFamily: 'var(--font-ui)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Calm
          </span>
          <span style={{ position: 'absolute', right: '6px', fontSize: '10px', fontFamily: 'var(--font-ui)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Intense
          </span>
        </div>

        {/* Right Info & Live Matched Tracks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)' }}>
            <Sparkles size={16} />
            <span className="caption">ATMOSPHERIC MOOD DIAL</span>
          </div>

          {/* Feature F: Animated Mood Label with Blur-In & Letter Fade */}
          <h2
            className="font-display"
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              filter: isLabelAnimating ? 'blur(6px)' : 'blur(0px)',
              opacity: isLabelAnimating ? 0.2 : 1,
              transform: isLabelAnimating ? 'translateY(4px)' : 'translateY(0)',
              transition: 'filter 150ms ease, opacity 150ms ease, transform 150ms ease',
            }}
          >
            {animatedLabel}
          </h2>

          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Drag handle to recompute queue by live energy and valence.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <PlayButton size="md" variant="gold" onClick={handlePlayMoodQueue} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                PLAY MOOD QUEUE ({nearestSongs.length})
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes moodDrift {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
          100% { transform: rotate(0deg); }
        }
        .mood-dial-idle-drift {
          animation: moodDrift 20s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
