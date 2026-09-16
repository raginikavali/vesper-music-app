import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

export default function ScrollRail({
  label,
  title,
  subtitle,
  children,
  actionText,
  onAction,
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const amount = containerRef.current.clientWidth * 0.75;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        marginBottom: 'var(--section-rhythm)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <SectionHeader
        label={label}
        title={title}
        subtitle={subtitle}
        actionText={actionText}
        onAction={onAction}
      />

      {/* Rail Wrapper */}
      <div style={{ position: 'relative' }}>
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          style={{
            position: 'absolute',
            left: '-16px',
            top: '40%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-surface-elevated)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-divider)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? 'auto' : 'none',
            transition: 'opacity 200ms ease, transform 200ms ease, background-color 200ms ease',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent)';
            e.currentTarget.style.color = '#121013';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
        >
          <ChevronLeft size={20} strokeWidth={1.5} color="var(--color-text-primary)" />
        </button>

        {/* Scroll Container (Peeks next card at edge) */}
        <div
          ref={containerRef}
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'calc(20% - 16px)', // 5 visible cards + peek on wide screens
            gap: '20px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            paddingBottom: '16px',
            paddingRight: '48px', // Peek padding
            scrollbarWidth: 'none', // Hide scrollbar Firefox
            msOverflowStyle: 'none', // Hide scrollbar IE/Edge
          }}
          className="scroll-rail-container"
        >
          {React.Children.map(children, (child) => (
            <div style={{ scrollSnapAlign: 'start' }}>{child}</div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          style={{
            position: 'absolute',
            right: '-16px',
            top: '40%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-surface-elevated)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-divider)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? 'auto' : 'none',
            transition: 'opacity 200ms ease, transform 200ms ease, background-color 200ms ease',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent)';
            e.currentTarget.style.color = '#121013';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
        >
            <ChevronRight size={20} strokeWidth={1.5} color="var(--color-text-primary)" />
        </button>
      </div>

      <style>{`
        .scroll-rail-container::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 1024px) {
          .scroll-rail-container {
            grid-auto-columns: calc(30% - 16px) !important;
          }
        }
        @media (max-width: 767px) {
          .scroll-rail-container {
            grid-auto-columns: calc(45% - 12px) !important;
          }
        }
      `}</style>
    </section>
  );
}
