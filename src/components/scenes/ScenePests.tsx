import React from 'react';
import { Bug, CheckCircle2, Droplets, ArrowRight, MapPin, AlertTriangle, Navigation } from 'lucide-react';
import { ScenarioData, SceneSection } from '../../types';

interface ScenePestsProps {
  scenario: ScenarioData;
  onNextScene: (scene: SceneSection) => void;
  onOpenRoverModal: () => void;
}

// Seeded pseudo-random — same result every render, no Math.random drift
const seededRand = (seed: number) => {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
};

// Crop row field map — scattered affected plants across whole field
const RoverFieldMap: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const numRows = 14;
  const plantsPerRow = 9;
  const roverRow = 9;
  const roverPlant = 4;

  // Core affected zone rows 8–14 (idx 7–13) have high infection probability,
  // surrounding rows have a low spillover chance so infection looks scattered field-wide
  const isPlantAffected = (rowIdx: number, pIdx: number): boolean => {
    const seed = rowIdx * 100 + pIdx;
    const r = seededRand(seed);
    const coreZone = rowIdx >= 7 && rowIdx <= 13;
    // core rows: ~30% chance per plant, outer rows: ~5% spillover — looks clean & sparse
    return coreZone ? r < 0.30 : r < 0.05;
  };

  return (
    <div style={{
      marginTop: '16px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div style={{
        fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase', letterSpacing: '0.06em',
        marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px'
      }}>
        <Navigation size={11} color={accentColor} />
        <span>Rover Field Coverage Map</span>
      </div>

      {/* Field rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {Array.from({ length: numRows }).map((_, rowIdx) => {
          const rowHasAny = Array.from({ length: plantsPerRow }).some((_, pIdx) => isPlantAffected(rowIdx, pIdx));
          return (
            <div key={rowIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Row label */}
              <span style={{
                fontSize: '0.6rem',
                color: rowHasAny ? `${accentColor}cc` : 'rgba(255,255,255,0.18)',
                fontFamily: 'var(--font-mono)', width: '28px', textAlign: 'right', flexShrink: 0
              }}>
                R{rowIdx + 1}
              </span>

              {/* Row line */}
              <div style={{
                flex: 1, height: '1px',
                background: rowHasAny
                  ? `linear-gradient(90deg, ${accentColor}40, ${accentColor}10)`
                  : 'rgba(255,255,255,0.06)',
                position: 'relative'
              }}>
                {/* Plant dots */}
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  width: '100%', display: 'flex', justifyContent: 'space-between', paddingInline: '2px'
                }}>
                  {Array.from({ length: plantsPerRow }).map((_, pIdx) => {
                    const isRover = rowIdx === roverRow && pIdx === roverPlant;
                    const infected = !isRover && isPlantAffected(rowIdx, pIdx);
                    return (
                      <div key={pIdx} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Glow ring for infected plants */}
                        {infected && (
                          <div style={{
                            position: 'absolute',
                            width: '13px', height: '13px', borderRadius: '50%',
                            border: `1px solid ${accentColor}45`,
                            background: `${accentColor}12`
                          }} />
                        )}
                        <div style={{
                          width: isRover ? '10px' : infected ? '7px' : '5px',
                          height: isRover ? '10px' : infected ? '7px' : '5px',
                          borderRadius: '50%',
                          background: isRover
                            ? '#ffffff'
                            : infected
                              ? accentColor
                              : 'rgba(255,255,255,0.16)',
                          boxShadow: isRover
                            ? `0 0 10px #ffffff, 0 0 4px ${accentColor}`
                            : infected
                              ? `0 0 5px ${accentColor}90`
                              : 'none',
                          position: 'relative', zIndex: 1
                        }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor, boxShadow: `0 0 5px ${accentColor}` }} />
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Affected crops</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 6px #fff' }} />
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Rover position</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Healthy crops</span>
        </div>
      </div>
    </div>
  );
};

export const ScenePests: React.FC<ScenePestsProps> = ({
  scenario,
  onNextScene
}) => {
  const { pests, field } = scenario;

  // Farmer-readable, one-line symptom points
  const symptomPoints = [
    'Worms have bored into about 14 tomatoes in rows 8–14 — check these plants first.',
    'Dark droppings (frass) found inside the fruit, sign of active worm feeding inside.',
    'Some fruit near those rows is going black and rotting — needs to be removed quickly.',
  ];

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 0 80px 0' }}>
      
      {/* Background Image Layer */}
      <div 
        className="scene-bg-layer"
        style={{
          backgroundImage: `url('/src/assets/biological_leaf.jpg')`,
          filter: 'brightness(35%) contrast(115%)'
        }}
      />
      <div className="scene-vignette" />

      <div className="max-container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        
        {/* Two-column layout: heading left, card right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>

          {/* LEFT: Section Header */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '20px' }}>
              <Bug size={14} color="#ef4444" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ACTIVE ALERT • PESTS & PATHOGENS
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
              Pest Detected & <br />
              <span style={{
                background: 'linear-gradient(135deg, #ffffff 40%, #f87171 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Rover Spraying Executed.
              </span>
            </h2>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '460px' }}>
              Autonomous computer vision detected active pest infestation on the crop canopy, and immediate targeted precision bio-spraying was completed by the rover.
            </p>
          </div>

          {/* RIGHT: Detail Card */}
          <div className="glass-panel" style={{ padding: '36px', border: '1px solid rgba(239,68,68,0.35)', background: 'linear-gradient(145deg, rgba(16,24,18,0.92) 0%, rgba(8,16,11,0.96) 100%)' }}>
            
            {/* Card Header — name only, no badges, no scientific subtitle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239,68,68,0.4)', flexShrink: 0 }}>
                <Bug size={22} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                  Tomato Fruit Borer
                </h3>
              </div>
            </div>

            {/* Section 1: Observed Symptoms */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.06em' }}>
                Observed Symptoms
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '14px', padding: '16px 18px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0' }}>
                {/* Zone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#fca5a5', fontWeight: 600, paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <MapPin size={13} color="#ef4444" />
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{pests.affectedCanopyZone}</span>
                </div>

                {/* 3 farmer-readable points */}
                {symptomPoints.map((pt, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    paddingBlock: '9px',
                    borderBottom: i < symptomPoints.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                  }}>
                    <div style={{
                      marginTop: '2px', flexShrink: 0,
                      width: '17px', height: '17px', borderRadius: '50%',
                      background: 'rgba(239,68,68,0.18)',
                      border: '1px solid rgba(239,68,68,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <AlertTriangle size={9} color="#ef4444" />
                    </div>
                    <p style={{ fontSize: '0.86rem', color: 'rgba(248,250,252,0.9)', lineHeight: 1.5, margin: 0 }}>
                      {pt}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Rover Intervention */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '0.72rem', color: '#34d399', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Droplets size={13} />
                <span>Rover Intervention</span>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.08)', borderRadius: '14px', padding: '18px 20px', border: '1px solid rgba(16,185,129,0.22)' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '11px 13px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>Volume Applied</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{pests.roverActionTaken.sprayVolumeMl} mL</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '11px 13px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>Treated Furrows</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6ee7b7', fontFamily: 'var(--font-mono)' }}>{pests.roverActionTaken.rowsTreated}</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '11px 13px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>Timestamp</div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{pests.roverActionTaken.completedAt}</div>
                  </div>
                </div>

                {/* Crop field map */}
                <RoverFieldMap accentColor="#10b981" />
              </div>
            </div>

            {/* Navigation Button */}
            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'space-between', padding: '14px 24px' }}
              onClick={() => onNextScene('weeds')}
            >
              <span>Inspect Weeds Alert</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>{/* end grid */}
      </div>
    </div>
  );
};
