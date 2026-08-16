import React, { useState, useEffect } from 'react';
import { MapPin, Layers } from 'lucide-react';
import { FIELDS } from '../../data/mockData';
import { ScenarioData } from '../../types';

interface FieldMapProps {
  scenario: ScenarioData;
  onSelectField: (fieldId: string) => void;
}

export const FieldMap: React.FC<FieldMapProps> = ({
  scenario,
  onSelectField
}) => {
  const [roverPos, setRoverPos] = useState({ x: 30, y: 28 });

  // Animate rover along waypoints smoothly
  useEffect(() => {
    const waypoints = [
      { x: 30, y: 28 },
      { x: 38, y: 24 },
      { x: 42, y: 36 },
      { x: 26, y: 40 }
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % waypoints.length;
      setRoverPos(waypoints[idx]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const getRiskFill = (risk: string, isSelected: boolean) => {
    switch (risk) {
      case 'CRITICAL':
        return isSelected ? 'rgba(239, 68, 68, 0.45)' : 'rgba(239, 68, 68, 0.2)';
      case 'HIGH':
        return isSelected ? 'rgba(245, 158, 11, 0.45)' : 'rgba(245, 158, 11, 0.2)';
      case 'MODERATE':
        return isSelected ? 'rgba(251, 191, 36, 0.45)' : 'rgba(251, 191, 36, 0.2)';
      default:
        return isSelected ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.2)';
    }
  };

  const getRiskStroke = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f59e0b';
      case 'MODERATE': return '#fbbf24';
      default: return '#10b981';
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 0 80px 0' }}>
      
      {/* Dark Stage Background */}
      <div className="scene-vignette" />

      <div className="max-container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', marginBottom: '14px' }}>
            <MapPin size={14} color="#8b5cf6" />
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SCENE 05 • GPS FIELD POLYGONS & ROVER TELEMETRY
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '16px'
          }}>
            Multi-Plot Vector <br />
            <span style={{
              background: 'linear-gradient(135deg, #ffffff 40%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Field Intelligence Map.
            </span>
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '650px', lineHeight: 1.6 }}>
            GPS coordinate mapping automatically bounds observation telemetry to discrete cadastral plots, routing insights directly to authenticated field owners.
          </p>
        </div>

        {/* 2-Column Map Stage & Field Telemetry Inspector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', alignItems: 'start' }}>
          
          {/* Left Column: Vector Interactive SVG Polygon Map */}
          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            
            {/* Map HUD Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="#8b5cf6" />
                <span style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                  Agricultural Cadastral Grid (4 Plots)
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)' }}>
                COORDS: 44.512° N, 88.064° W
              </span>
            </div>

            {/* SVG Interactive Map Canvas */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '380px',
              background: 'radial-gradient(circle at 50% 50%, #0c1c14 0%, #060e0a 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden'
            }}>
              {/* Scanline Grid */}
              <div className="hud-grid" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />

              {/* Radar Sweep Effect */}
              <div className="radar-sweep" style={{ width: '400px', height: '400px', top: '-10px', left: '-10px', opacity: 0.15 }} />

              {/* SVG Polygons */}
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                {FIELDS.map((fld) => {
                  const isSelected = fld.id === scenario.field.id;
                  const pointsStr = fld.coordinates.map(p => `${p.x},${p.y}`).join(' ');

                  return (
                    <g key={fld.id} onClick={() => onSelectField(fld.id)} style={{ cursor: 'pointer' }}>
                      <polygon
                        points={pointsStr}
                        fill={getRiskFill(fld.overallRisk, isSelected)}
                        stroke={getRiskStroke(fld.overallRisk)}
                        strokeWidth={isSelected ? '0.8' : '0.4'}
                        strokeDasharray={isSelected ? 'none' : '1, 1'}
                        style={{
                          transition: 'all 0.3s ease',
                          filter: isSelected ? `drop-shadow(0 0 4px ${getRiskStroke(fld.overallRisk)})` : 'none'
                        }}
                      />
                      {/* Field Name Label */}
                      <text
                        x={(fld.coordinates[0].x + fld.coordinates[2].x) / 2}
                        y={(fld.coordinates[0].y + fld.coordinates[2].y) / 2}
                        fill="#ffffff"
                        fontSize="2.8"
                        fontFamily="var(--font-mono)"
                        fontWeight="600"
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {fld.code}
                      </text>
                    </g>
                  );
                })}

                {/* Animated Rover Position Pin */}
                <g style={{ transition: 'all 3s cubic-bezier(0.4, 0, 0.2, 1)' }} transform={`translate(${roverPos.x}, ${roverPos.y})`}>
                  <circle r="2.5" fill="#10b981" opacity="0.3" className="animate-ping" />
                  <circle r="1.5" fill="#10b981" />
                  <circle r="0.6" fill="#ffffff" />
                </g>
              </svg>

              {/* Map Legend Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(5,12,8,0.85)',
                backdropFilter: 'blur(8px)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                display: 'flex',
                gap: '12px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  Critical
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  High
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  Optimal
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Selected Field Telemetry Drilldown */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Selected Cadastral Parcel
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                  {scenario.field.name}
                </h3>
              </div>

              <div style={{
                background: scenario.field.overallRisk === 'CRITICAL' ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.2)',
                color: scenario.field.overallRisk === 'CRITICAL' ? '#f87171' : '#6ee7b7',
                border: `1px solid ${scenario.field.overallRisk === 'CRITICAL' ? '#ef4444' : '#10b981'}`,
                padding: '4px 10px',
                borderRadius: '9999px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 700
              }}>
                {scenario.field.overallRisk} RISK
              </div>
            </div>

            {/* Field Details List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Crop Type</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc' }}>{scenario.field.cropType}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Field Owner / Entity</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#6ee7b7' }}>{scenario.field.ownerName}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Primary Threat Vector</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f87171' }}>{scenario.field.primaryThreat}</div>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.1)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.25)' }}>
                <div style={{ fontSize: '0.7rem', color: '#34d399', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Farmer Action Required</div>
                <div style={{ fontSize: '0.88rem', color: '#f8fafc', lineHeight: 1.4 }}>{scenario.field.actionRequired || scenario.climatic.farmerActionRequired.title}</div>
              </div>
            </div>

            {/* Field Plot Switcher Buttons */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Switch Cadastral Sector:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {FIELDS.map((fld) => (
                  <button
                    key={fld.id}
                    onClick={() => onSelectField(fld.id)}
                    style={{
                      background: fld.id === scenario.field.id ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)',
                      border: fld.id === scenario.field.id ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)',
                      color: '#f8fafc',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {fld.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
