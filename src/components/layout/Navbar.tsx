import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Bug, Sprout, CloudSun, MapPin, Radio,
  Activity, Sparkles, Menu, X, ChevronRight
} from 'lucide-react';
import { SceneSection, RiskLevel } from '../../types';

interface NavbarProps {
  activeSection: SceneSection;
  onSelectSection: (section: SceneSection) => void;
  overallRisk: RiskLevel;
  onOpenRoverModal: () => void;
}

const NAV_ITEMS: { id: SceneSection; label: string; sublabel: string; icon: React.ElementType; color: string }[] = [
  { id: 'pests',    label: 'Pests Alert',       sublabel: 'Rover spray executed',         icon: Bug,      color: '#ef4444' },
  { id: 'weeds',    label: 'Weeds Alert',        sublabel: 'Weedicide applied',            icon: Sprout,   color: '#10b981' },
  { id: 'climatic', label: 'Climatic Factors',   sublabel: 'Live weather & farmer plan',   icon: CloudSun, color: '#06b6d4' },
  { id: 'action',   label: 'Intervention',       sublabel: 'Dispatch & action engine',     icon: Activity, color: '#f59e0b' },
  { id: 'map',      label: 'Polygon Map',        sublabel: 'GPS field polygons',           icon: MapPin,   color: '#8b5cf6' },
  { id: 'llm',      label: 'LLM Intelligence',   sublabel: 'AI-fused field report',        icon: Sparkles, color: '#f59e0b' },
];

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'CRITICAL': return '#ef4444';
    case 'HIGH':     return '#f59e0b';
    case 'MODERATE': return '#fbbf24';
    default:         return '#10b981';
  }
};

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  overallRisk,
  onOpenRoverModal
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (id: SceneSection) => {
    onSelectSection(id);
    setOpen(false);
  };

  const riskColor = getRiskColor(overallRisk);

  return (
    <>
      {/* ── Hamburger trigger — top-left corner ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 200,
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'rgba(8,20,13,0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(16,185,129,0.25)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#f8fafc',
          transition: 'border-color 0.2s, box-shadow 0.2s'
        }}
      >
        <Menu size={20} />
      </button>

      {/* ── Rover pill — top-right corner ── */}
      <button
        onClick={onOpenRoverModal}
        title="Open Rover Telemetry Console"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 200,
          background: 'rgba(8,20,13,0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${riskColor}50`,
          color: '#f8fafc',
          borderRadius: '9999px',
          padding: '10px 18px',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 16px ${riskColor}20`,
          transition: 'all 0.2s ease'
        }}
      >
        <Radio size={13} color="#10b981" />
        <span>ROVER ONLINE</span>
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%',
          backgroundColor: riskColor,
          boxShadow: `0 0 8px ${riskColor}`
        }} />
      </button>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 300
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Side Drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, bottom: 0,
              width: '300px',
              zIndex: 400,
              background: 'rgba(6,14,9,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRight: '1px solid rgba(16,185,129,0.2)',
              boxShadow: '8px 0 48px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto'
            }}
          >
            {/* Drawer header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '24px 20px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.07)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(16,185,129,0.5)'
                }}>
                  <Shield size={18} color="#030805" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                      AgriShield
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '2px 6px', borderRadius: '9999px', fontFamily: 'var(--font-mono)' }}>
                      v2.4
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '1px' }}>
                    Field Intelligence Platform
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Risk status pill */}
            <div style={{ padding: '14px 20px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: `${riskColor}15`,
                border: `1px solid ${riskColor}40`,
                borderRadius: '10px',
                padding: '10px 14px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: riskColor, boxShadow: `0 0 8px ${riskColor}`, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Overall Field Risk</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: riskColor, fontFamily: 'var(--font-mono)' }}>{overallRisk}</div>
                </div>
              </div>
            </div>

            {/* Section label */}
            <div style={{ padding: '4px 20px 8px', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Navigation
            </div>

            {/* Nav items */}
            <nav style={{ padding: '0 12px', flex: 1 }}>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '11px 12px',
                      borderRadius: '12px',
                      marginBottom: '4px',
                      background: isActive ? `${item.color}18` : 'transparent',
                      border: `1px solid ${isActive ? item.color + '40' : 'transparent'}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                      background: isActive ? `${item.color}25` : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${isActive ? item.color + '50' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isActive ? item.color : 'var(--text-muted)'
                    }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#f8fafc' : 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: isActive ? item.color + 'cc' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.sublabel}
                      </div>
                    </div>
                    <ChevronRight size={14} color={isActive ? item.color : 'rgba(255,255,255,0.15)'} />
                  </button>
                );
              })}
            </nav>

            {/* Rover button at bottom */}
            <div style={{ padding: '16px 20px 28px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button
                onClick={() => { onOpenRoverModal(); setOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.12) 100%)',
                  border: '1px solid rgba(16,185,129,0.35)',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer'
                }}
              >
                <Radio size={14} color="#10b981" />
                <span>ROVER TELEMETRY CONSOLE</span>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: riskColor, boxShadow: `0 0 6px ${riskColor}` }} />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
