import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Bug, Sprout, CloudSun } from 'lucide-react';
import { AmbientAtmosphere } from './AmbientAtmosphere';
import { SceneSection, ScenarioData } from '../../types';

interface HeroSectionProps {
  onExplore: (section: SceneSection) => void;
  onOpenRoverModal: () => void;
  scenario: ScenarioData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore,
  onOpenRoverModal,
  scenario
}) => {
  return (
    <section className="cinematic-stage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', paddingTop: '100px', paddingBottom: '60px' }}>
      {/* Background Cinematic Image Layer */}
      <div 
        className="scene-bg-layer"
        style={{
          backgroundImage: `url('/src/assets/field_hero.jpg')`,
          transform: 'scale(1.03)',
          filter: 'brightness(80%) contrast(108%)'
        }}
      />

      {/* Atmospheric Vignette & Particles */}
      <div className="scene-vignette" />
      <div className="scene-gradient-bottom" />
      <AmbientAtmosphere intensity="light" />

      {/* Hero Content Container */}
      <div className="max-container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '960px' }}>
        
        {/* Central / Primary Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 10vw, 8rem)',
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            marginBottom: '20px',
            color: '#ffffff',
            textShadow: '0 8px 30px rgba(0,0,0,0.6)'
          }}
        >
          <span style={{
            background: 'linear-gradient(135deg, #ffffff 40%, #6ee7b7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            TomCast
          </span>
        </motion.h1>

        {/* Supporting Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.28rem)',
            color: 'rgba(240, 250, 244, 0.85)',
            maxWidth: '680px',
            lineHeight: 1.6,
            marginBottom: '36px',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}
        >
          Autonomous rover sensing and microclimate fusion detects active pests, invasive weeds, and climatic risks for immediate, actionable field intervention.
        </motion.p>

        {/* Live Active Alert Ribbon (3 Pillars) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            width: '100%',
            maxWidth: '860px',
            background: 'rgba(9, 20, 13, 0.72)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.5)'
          }}
        >
          {/* Pillar 1: Pests Alert */}
          <div 
            onClick={() => onExplore('pests')}
            style={{ textAlign: 'left', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'background 0.2s ease' }}
          >
            <div style={{ fontSize: '0.68rem', color: '#f87171', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bug size={11} />
              <span>1. Pests Alert</span>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {scenario.pests.pestName.split('(')[0]}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              ● Rover Spray Done
            </div>
          </div>

          {/* Pillar 2: Weeds Alert */}
          <div 
            onClick={() => onExplore('weeds')}
            style={{ textAlign: 'left', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'background 0.2s ease' }}
          >
            <div style={{ fontSize: '0.68rem', color: '#34d399', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sprout size={11} />
              <span>2. Weeds Alert</span>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {scenario.weeds.weedType.split('(')[0]}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#6ee7b7', fontFamily: 'var(--font-mono)' }}>
              ● Weedicide Sprayed
            </div>
          </div>

          {/* Pillar 3: Climatic Factors */}
          <div 
            onClick={() => onExplore('climatic')}
            style={{ textAlign: 'left', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'background 0.2s ease' }}
          >
            <div style={{ fontSize: '0.68rem', color: '#22d3ee', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CloudSun size={11} />
              <span>3. Climatic Factors</span>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>
              {scenario.climatic.temperature}°C • {scenario.climatic.humidity}% RH
            </div>
            <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              ● Farmer Action Req.
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          cursor: 'pointer'
        }}
        onClick={() => onExplore('pests')}
      >
        <div className="glass-pill" style={{ padding: '6px 16px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          <span>SCROLL TO ACTIVE ALERTS</span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};
