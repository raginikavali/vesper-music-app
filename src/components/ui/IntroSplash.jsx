import React, { useState, useEffect } from 'react';
import GeneratedCover from './GeneratedCover';

export default function IntroSplash({ onComplete }) {
  const [stage, setStage] = useState('drawing'); // 'drawing' | 'text' | 'resolving' | 'done'
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    // 0 -> 400ms: SVG stroke-dashoffset animation
    const timer1 = setTimeout(() => setStage('text'), 450);
    // 450ms -> 1000ms: Wordmark fades up
    const timer2 = setTimeout(() => setStage('resolving'), 1000);
    // 1000ms -> 1400ms: Scale down & slide into top-left nav rail position
    const timer3 = setTimeout(() => {
      setStage('done');
      onComplete && onComplete();
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (stage === 'done') return null;

  const isResolving = stage === 'resolving';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--color-base)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isResolving ? 0 : 1,
        transition: 'opacity 400ms cubic-bezier(0.32, 0.72, 0, 1)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transform: isResolving
            ? 'translate(-42vw, -44vh) scale(0.6)'
            : 'translate(0, 0) scale(1.2)',
          transition: 'transform 400ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {imageFailed ? (
          <GeneratedCover seed="vesper-intro" width="48px" height="48px" borderRadius="var(--radius-full)" />
        ) : (
          <img
            src="/vesper-mark.svg"
            alt=""
            width="48"
            height="48"
            onError={() => setImageFailed(true)}
            className={stage === 'drawing' ? 'intro-mark-drawing' : ''}
          />
        )}

        {/* Wordmark Fades Up */}
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: '32px',
            letterSpacing: '0.25em',
            color: 'var(--color-text-primary)',
            textTransform: 'uppercase',
            opacity: stage !== 'drawing' ? 1 : 0,
            transform: stage !== 'drawing' ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 300ms ease, transform 300ms ease',
          }}
        >
          VESPER
        </span>
      </div>
      <style>{`
        .intro-mark-drawing {
          clip-path: inset(100% 0 0 0);
          animation: introMarkReveal 450ms ease forwards;
        }
        @keyframes introMarkReveal {
          to { clip-path: inset(0 0 0 0); }
        }
      `}</style>
    </div>
  );
}
