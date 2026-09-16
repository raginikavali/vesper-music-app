import React, { useState, useRef } from 'react';

export default function MagneticButton({ children, onClick, style = {}, className = '', ...props }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const btnRef = useRef(null);

  const handlePointerMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = (e.clientX - cx) * 0.15; // 2-4px magnetic pull
    const dy = (e.clientY - cy) * 0.15;

    setOffset({ x: Math.max(-4, Math.min(4, dx)), y: Math.max(-4, Math.min(4, dy)) });
  };

  const handlePointerLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={className}
      style={{
        ...style,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 180ms cubic-bezier(0.32, 0.72, 0, 1), background-color 180ms ease',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
