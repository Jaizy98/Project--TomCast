import React from 'react';
import { Sprout, Droplets, ArrowRight, MapPin } from 'lucide-react';
import { ScenarioData, SceneSection } from '../../types';

interface SceneWeedsProps {
  scenario: ScenarioData;
  onNextScene: (scene: SceneSection) => void;
  onOpenRoverModal: () => void;
}

export const SceneWeeds: React.FC<SceneWeedsProps> = ({
  scenario,
  onNextScene
}) => {
  const { weeds, field } = scenario;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 0 80px 0' }}>
      
      {/* Background Image Layer */}
      <div 
        className="scene-bg-layer"
        style={{
          backgroundImage: `url('/src/assets/field_hero.jpg')`,
          filter: 'brightness(35%) contrast(110%)'
        }}
      />
      <div className="scene-vignette" />

      <div className="max-container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        
        {/* Two-column layout: heading left, card right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>

        {/* LEFT: Section Header */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '20px' }}>
            <Sprout size={14} color="#10b981" />
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ACTIVE ALERT • WEEDS DETECTION & ERADICATION
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 3.5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '20px'
          }}>
            Weeds Detected & <br />
            <span style={{
              background: 'linear-gradient(135deg, #ffffff 40%, #6ee7b7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Weedicide Sprayed.
            </span>
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '460px' }}>
            Precision optical sensors classified invasive weed species competing for root-zone moisture, and autonomous micro-nozzles delivered targeted weedicide spot-spraying.
          </p>
        </div>

        {/* RIGHT: Single Full-Detail Card */}
        <div className="glass-panel" style={{ padding: '36px', border: '1px solid rgba(16,185,129,0.35)', background: 'linear-gradient(145deg, rgba(12,24,16,0.92) 0%, rgba(6,16,10,0.96) 100%)' }}>
          
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.4)' }}>
              <Sprout size={22} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                Black Nightshade
              </h3>
            </div>
          </div>

          {/* Section 1: Weed Analysis */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.06em' }}>
              Weed Analysis
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '14px', padding: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600, marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <MapPin size={13} color="#10b981" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#6ee7b7' }}>{weeds.affectedRows} (Local Density: {weeds.weedCoveragePercent}%)</span>
              </div>

              {/* 2 farmer-readable points */}
              {[
                'These weeds grow fast and steal water from your tomato roots — the longer they stay, the more your plants will struggle, especially during dry spells.',
                'Black nightshade also attracts insects that spread disease to tomatoes nearby — pull out any remaining plants by hand after the rover spray takes effect in 48 hours.'
              ].map((pt, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  paddingBlock: '9px',
                  borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                }}>
                  <div style={{
                    marginTop: '2px', flexShrink: 0,
                    width: '17px', height: '17px', borderRadius: '50%',
                    background: 'rgba(16,185,129,0.18)',
                    border: '1px solid rgba(16,185,129,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Sprout size={9} color="#10b981" />
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'rgba(248,250,252,0.9)', lineHeight: 1.5, margin: 0 }}>{pt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Rover Intervention */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '0.72rem', color: '#34d399', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Droplets size={13} />
              <span>Rover Intervention</span>
            </div>

            <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(16,185,129,0.25)' }}>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Dosage Protocol</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{weeds.roverActionTaken.dosage}</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Treated Furrows</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#6ee7b7', fontFamily: 'var(--font-mono)' }}>{weeds.roverActionTaken.rowsTreated}</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Application Time</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{weeds.roverActionTaken.completedAt}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Button */}
          <button 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'space-between', padding: '14px 24px' }}
            onClick={() => onNextScene('climatic')}
          >
            <span>Inspect Climatic Factors Alert</span>
            <ArrowRight size={18} />
          </button>
        </div>

        </div>{/* end grid */}
      </div>
    </div>
  );
};
