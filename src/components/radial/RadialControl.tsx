import React, { useState, useRef, useEffect } from 'react';
import { Bug, Sprout, CloudSun, ChevronRight, Radio, MapPin, Sparkles } from 'lucide-react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { RADIAL_SEGMENTS } from '../../data/mockData';
import { SceneSection, RiskLevel } from '../../types';

interface RadialControlProps {
  activeSection: SceneSection;
  onSelectSection: (section: SceneSection) => void;
  currentRisk: RiskLevel;
}

export const RadialControl: React.FC<RadialControlProps> = ({
  activeSection,
  onSelectSection,
  currentRisk
}) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startDragAngle = useRef(0);
  const dialRef = useRef<HTMLDivElement | null>(null);
  // Motion value drives the visual rotation — supports smooth animation
  const motionRotation = useMotionValue(0);

  // Keep rotationAngle state in sync with motionRotation for node position calculations
  useEffect(() => {
    const unsubscribe = motionRotation.on('change', (v) => setRotationAngle(v));
    return unsubscribe;
  }, [motionRotation]);

  // Smoothly animate dial to target angle
  const animateTo = (targetAngle: number) => {
    const current = motionRotation.get();
    // Find shortest path (avoid spinning 270° when -90° works)
    let delta = (targetAngle - current) % 360;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const destination = current + delta;
    animate(motionRotation, destination, {
      type: 'spring',
      stiffness: 160,
      damping: 22,
      mass: 0.8
    });
  };

  const getIcon = (name: string, size = 18) => {
    switch (name) {
      case 'Bug':      return <Bug size={size} />;
      case 'Sprout':   return <Sprout size={size} />;
      case 'CloudSun': return <CloudSun size={size} />;
      case 'MapPin':   return <MapPin size={size} />;
      default:         return <Bug size={size} />;
    }
  };

  // Sync dial rotation when activeSection changes externally
  useEffect(() => {
    const seg = RADIAL_SEGMENTS.find(s => s.id === activeSection);
    if (seg) animateTo(-seg.angle);
  }, [activeSection]);

  const getCenter = () => {
    const rect = dialRef.current!.getBoundingClientRect();
    return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!dialRef.current) return;
    setIsDragging(true);
    const { cx, cy } = getCenter();
    startDragAngle.current = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI - motionRotation.get();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dialRef.current) return;
    const { cx, cy } = getCenter();
    const newAngle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI - startDragAngle.current;
    motionRotation.set(newAngle);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to nearest of 4 segments (0°, 90°, 180°, 270°)
    const norm = ((-motionRotation.get() % 360) + 360) % 360;
    let closest = RADIAL_SEGMENTS[0];
    let minDiff = 360;
    RADIAL_SEGMENTS.forEach(seg => {
      const diff = Math.min(Math.abs(seg.angle - norm), 360 - Math.abs(seg.angle - norm));
      if (diff < minDiff) { minDiff = diff; closest = seg; }
    });
    animateTo(-closest.angle);
    onSelectSection(closest.id);
  };

  const activeSegmentData = RADIAL_SEGMENTS.find(s => s.id === activeSection) || RADIAL_SEGMENTS[0];

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH':     return '#f59e0b';
      case 'MODERATE': return '#fbbf24';
      default:         return '#10b981';
    }
  };

  return (
    <div className="radial-container">
      {/* Background glow */}
      <div className="radial-halo" style={{
        background: `radial-gradient(circle, ${getRiskColor(currentRisk)}25 0%, rgba(6,182,212,0.08) 45%, transparent 70%)`
      }} />

      {/* Dial */}
      <div
        ref={dialRef}
        className="radial-dial-base"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <motion.div
          className="radial-outer-track"
          style={{ rotate: motionRotation }}
        />
        <div className="radial-stepped-bezel" />
        <motion.div
          className="radial-active-arc"
          style={{
            rotate: motionRotation,
            borderColor: activeSegmentData.accentColor
          }}
        />

        {/* 4 symmetrical orbital nodes — all rotate together with the dial */}
        {RADIAL_SEGMENTS.map((segment) => {
          const isActive = segment.id === activeSection;
          // Derive position from motionRotation via a subscribe — use state for render
          const rad = ((segment.angle + rotationAngle - 90) * Math.PI) / 180;
          const radius = 135;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          return (
            <button
              key={segment.id}
              onClick={(e) => {
                e.stopPropagation();
                animateTo(-segment.angle);
                onSelectSection(segment.id);
              }}
              className={`radial-node-button ${isActive ? 'active' : ''}`}
              title={segment.label}
              style={{
                transform: `translate(${x}px, ${y}px) ${isActive ? 'scale(1.2)' : ''}`,
                borderColor: isActive ? segment.accentColor : 'rgba(255,255,255,0.14)',
                background: isActive
                  ? `linear-gradient(135deg, ${segment.accentColor}40 0%, ${segment.accentColor}15 100%)`
                  : 'rgba(14,26,18,0.9)',
                boxShadow: isActive ? `0 0 20px ${segment.accentColor}60` : undefined,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                transition: 'box-shadow 0.3s, border-color 0.3s, background 0.3s, color 0.3s'
              }}
            >
              {getIcon(segment.iconName, isActive ? 20 : 17)}
            </button>
          );
        })}

        {/* Center knob — cycles through all 4 segments */}
        <div
          className="radial-center-knob"
          onClick={() => {
            const idx = RADIAL_SEGMENTS.findIndex(s => s.id === activeSection);
            onSelectSection(RADIAL_SEGMENTS[(idx + 1) % RADIAL_SEGMENTS.length].id);
          }}
        >
          <div className="radial-knob-grooves">
            <div className="radial-groove-bar" />
            <div className="radial-groove-bar" />
            <div className="radial-groove-bar" />
          </div>
          <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '2px' }}>
            Active Alert
          </div>
          <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: getRiskColor(currentRisk), display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: getRiskColor(currentRisk), boxShadow: `0 0 8px ${getRiskColor(currentRisk)}` }} />
            {currentRisk}
          </div>
        </div>
      </div>

      {/* Callout stack — 4 segments + divider + LLM */}
      <div className="radial-callout-stack">
        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#6ee7b7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', paddingLeft: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Radio size={12} color="#10b981" />
          <span>Active Alerts Matrix</span>
        </div>

        {/* All 4 rotating segments */}
        {RADIAL_SEGMENTS.map((seg) => {
          const isActive = seg.id === activeSection;
          return (
            <div
              key={seg.id}
              onClick={() => onSelectSection(seg.id)}
              className={`radial-callout-item ${isActive ? 'active' : ''}`}
              style={{
                borderColor: isActive ? seg.accentColor : undefined,
                background: isActive ? `linear-gradient(90deg, ${seg.accentColor}25 0%, rgba(13,24,16,0.95) 100%)` : undefined
              }}
            >
              <div className="radial-callout-line" style={{ background: seg.accentColor }} />
              <div style={{ color: isActive ? seg.accentColor : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '8px', background: isActive ? `${seg.accentColor}20` : 'rgba(255,255,255,0.05)' }}>
                {getIcon(seg.iconName, 16)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.86rem', fontFamily: 'var(--font-display)', fontWeight: isActive ? 700 : 500, color: isActive ? '#f8fafc' : 'var(--text-secondary)', marginBottom: '2px' }}>{seg.label}</div>
                <div style={{ fontSize: '0.68rem', color: isActive ? '#f8fafc' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seg.sublabel}</div>
                <div style={{ marginTop: '4px', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: seg.accentColor, fontWeight: 600, letterSpacing: '0.04em' }}>● {seg.statusTag}</div>
              </div>
              <ChevronRight size={14} color={isActive ? seg.accentColor : 'rgba(255,255,255,0.2)'} />
            </div>
          );
        })}

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

        {/* LLM Intelligence — callout only, not on dial */}
        <div
          onClick={() => onSelectSection('llm')}
          className={`radial-callout-item ${activeSection === 'llm' ? 'active' : ''}`}
          style={{
            borderColor: activeSection === 'llm' ? '#f59e0b' : 'rgba(245,158,11,0.2)',
            background: activeSection === 'llm'
              ? 'linear-gradient(90deg, rgba(245,158,11,0.25) 0%, rgba(13,24,16,0.95) 100%)'
              : 'linear-gradient(90deg, rgba(245,158,11,0.06) 0%, transparent 100%)'
          }}
        >
          <div className="radial-callout-line" style={{ background: '#f59e0b' }} />
          <div style={{ color: activeSection === 'llm' ? '#f59e0b' : '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '8px', background: activeSection === 'llm' ? 'rgba(245,158,11,0.2)' : 'rgba(245,158,11,0.1)' }}>
            <Sparkles size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.86rem', fontFamily: 'var(--font-display)', fontWeight: activeSection === 'llm' ? 700 : 500, color: activeSection === 'llm' ? '#f8fafc' : '#fbbf24', marginBottom: '2px' }}>LLM Intelligence</div>
            <div style={{ fontSize: '0.68rem', color: activeSection === 'llm' ? '#fde68a' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>AI-fused field summary</div>
            <div style={{ marginTop: '4px', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: '#f59e0b', fontWeight: 600, letterSpacing: '0.04em' }}>● GENERATE REPORT</div>
          </div>
          <ChevronRight size={14} color={activeSection === 'llm' ? '#f59e0b' : 'rgba(245,158,11,0.4)'} />
        </div>
      </div>
    </div>
  );
};
