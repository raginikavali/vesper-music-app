import React, { useState } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { Check, Clock } from 'lucide-react';

export default function SleepTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const { sleepTimer, startSleepTimer, cancelSleepTimer } = usePlayer();

  const options = [
    { label: 'Off', mins: null },
    { label: '20 min', mins: 20 },
    { label: '45 min', mins: 45 },
    { label: '60 min', mins: 60 },
  ];

  const { active, minutes, remainingSec, initialSec } = sleepTimer;

  // Format remaining time MM:SS
  const formatRemaining = (sec) => {
    if (!sec) return '';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // SVG Depleting Ring stroke dash offset math
  const ringSize = 28;
  const stroke = 2;
  const radius = (ringSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = active && initialSec ? remainingSec / initialSec : 1;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sleep Fade Timer"
        title={active ? `Sleep timer active (${formatRemaining(remainingSec)})` : "Sleep Fade Timer"}
        style={{
          background: 'none',
          border: 'none',
          color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          cursor: 'pointer',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-full)',
          position: 'relative',
          transition: 'color var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.color = 'var(--color-text-primary)';
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.color = 'var(--color-text-secondary)';
        }}
      >
        {active ? (
          <div style={{ position: 'relative', width: `${ringSize}px`, height: `${ringSize}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Depleting Clockwise Gold SVG Ring */}
            <svg width={ringSize} height={ringSize} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                stroke="rgba(244,241,236,0.15)"
                strokeWidth={stroke}
              />
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>

            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', fontWeight: 600, color: 'var(--color-accent)' }}>
              {Math.ceil((remainingSec || 0) / 60)}m
            </span>
          </div>
        ) : (
          <Clock size={18} strokeWidth={1.5} color="var(--color-text-secondary)" />
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 80 }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: '120%',
              right: 0,
              width: '150px',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid rgba(244,241,236,0.12)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
              padding: '6px',
              zIndex: 90,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <div className="caption" style={{ padding: '6px 8px', fontSize: '10px', color: 'var(--color-accent)' }}>
              SLEEP FADE TIMER
            </div>

            {options.map((opt) => {
              const isSelected = active ? minutes === opt.mins : opt.mins === null;
              return (
                <button
                  key={opt.label}
                  onClick={() => {
                    if (opt.mins === null) {
                      cancelSleepTimer();
                    } else {
                      startSleepTimer(opt.mins);
                    }
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? 'rgba(232,182,90,0.12)' : 'transparent',
                    color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                    border: 'none',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={14} strokeWidth={1.5} color="var(--color-accent)" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
