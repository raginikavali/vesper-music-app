import React from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { X, Sparkles } from './Icons';

export default function ListeningReceipt() {
  const { sessionHistory, isReceiptModalOpen, setReceiptModalOpen } = usePlayer();

  if (!isReceiptModalOpen) return null;

  // Compute metrics
  const totalTrackCount = sessionHistory.length;
  const totalSeconds = sessionHistory.reduce((acc, t) => acc + (t.durationSec || 240), 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  // Top Artist
  const artistCounts = {};
  sessionHistory.forEach(t => {
    artistCounts[t.artist] = (artistCounts[t.artist] || 0) + 1;
  });
  let topArtist = "Nocturne Society";
  let maxCount = 0;
  Object.keys(artistCounts).forEach(artist => {
    if (artistCounts[artist] > maxCount) {
      maxCount = artistCounts[artist];
      topArtist = artist;
    }
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(18, 16, 19, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={() => setReceiptModalOpen(false)}
    >
      {/* Paper Receipt Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#F4F1EC', // Receipt off-white paper color
          color: '#121013',
          fontFamily: "'Courier New', Courier, monospace",
          padding: '32px 24px',
          borderRadius: '4px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(232,182,90,0.15)',
          position: 'relative',
          userSelect: 'none',
          animation: 'receiptPop 300ms cubic-bezier(0.32, 0.72, 0, 1) forwards',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setReceiptModalOpen(false)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: '#121013',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <X size={20} />
        </button>

        {/* Receipt Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            VESPER
          </h2>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', marginTop: '2px' }}>
            MUSIC, AFTER HOURS — SESSION RECEIPT
          </p>
          <p style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
            ORDER #VS-{Math.floor(100000 + Math.random() * 900000)} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Dashed Line */}
        <div style={{ borderTop: '1px dashed #121013', margin: '16px 0' }} />

        {/* Tracks Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '11px' }}>
            <span>ITEM / TRACK</span>
            <span>TIME</span>
          </div>

          {sessionHistory.map((track, idx) => (
            <div key={`${track.id}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {idx + 1}. {track.title}
              </span>
              <span style={{ flexShrink: 0 }}>{track.duration}</span>
            </div>
          ))}
        </div>

        {/* Dashed Line */}
        <div style={{ borderTop: '1px dashed #121013', margin: '16px 0' }} />

        {/* Totals Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>TOTAL TRACKS:</span>
            <span>{totalTrackCount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>TOTAL LISTENED:</span>
            <span>{totalMinutes} MIN</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>TOP ARTIST:</span>
            <span style={{ fontWeight: 700 }}>{topArtist}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>DOMINANT MOOD:</span>
            <span style={{ fontWeight: 700 }}>Deep & Quiet</span>
          </div>
        </div>

        {/* Dashed Line */}
        <div style={{ borderTop: '1px dashed #121013', margin: '16px 0' }} />

        {/* Fake Barcode */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <div
            style={{
              height: '36px',
              background: 'repeating-linear-gradient(90deg, #121013 0px, #121013 2px, transparent 2px, transparent 4px, #121013 4px, #121013 7px, transparent 7px, transparent 9px)',
              margin: '0 auto 8px auto',
              width: '80%',
            }}
          />
          <p style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            *THANK YOU FOR LISTENING AFTER HOURS*
          </p>
        </div>

        {/* Save as Image Button */}
        <button
          onClick={() => alert("Receipt saved as image!")}
          style={{
            width: '100%',
            marginTop: '20px',
            backgroundColor: '#121013',
            color: '#F4F1EC',
            border: 'none',
            padding: '10px',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Save as Image
        </button>
      </div>

      <style>{`
        @keyframes receiptPop {
          from {
            transform: scale(0.92);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
