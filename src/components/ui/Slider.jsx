import React, { useState, useRef } from 'react';

export default function Slider({
  value = 0,
  min = 0,
  max = 100,
  onChange,
  onChangeEnd,
  formatTooltip,
  height = 4,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min || 1)) * 100));

  const calculateValueFromPointer = (e) => {
    if (!trackRef.current) return value;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    return min + ratio * (max - min);
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const newValue = calculateValueFromPointer(e);
    onChange && onChange(newValue);

    const handlePointerMove = (moveEv) => {
      const moveVal = calculateValueFromPointer(moveEv);
      onChange && onChange(moveVal);
    };

    const handlePointerUp = (upEv) => {
      const finalVal = calculateValueFromPointer(upEv);
      setIsDragging(false);
      onChangeEnd && onChangeEnd(finalVal);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div
      ref={trackRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      style={{
        position: 'relative',
        width: '100%',
        height: `${height * 3}px`,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        touchAction: 'none',
      }}
    >
      {/* Track background */}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'rgba(244, 241, 236, 0.12)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Track fill */}
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: isHovered || isDragging ? 'var(--color-accent-hover)' : 'var(--color-accent)',
            borderRadius: 'var(--radius-full)',
            transition: isDragging ? 'none' : 'width 100ms linear',
          }}
        />
      </div>

      {/* Thumb indicator on hover or drag */}
      <div
        style={{
          position: 'absolute',
          left: `${percentage}%`,
          top: '50%',
          width: '12px',
          height: '12px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-text-primary)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          transform: 'translate(-50%, -50%)',
          opacity: isHovered || isDragging ? 1 : 0,
          scale: isDragging ? 1.2 : 1,
          transition: 'opacity 150ms ease, transform 150ms ease, scale 150ms ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
