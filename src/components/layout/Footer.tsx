import React from 'react';
import { Shield, Cpu, Activity, Dna, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: '#020604',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '60px 0 100px 0',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="max-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Column 1: Brand & Philosophy */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={16} color="#030805" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem' }}>
                AgriShield
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '320px' }}>
              Agricultural intelligence presented through cinematic, immersive technology. Transform raw rover data and microclimate telemetry into proactive field protection.
            </p>
          </div>

          {/* Column 2: System Architecture */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc', marginBottom: '14px', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
              System Pipeline
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={13} color="#10b981" />
                <span>Autonomous Field Rover (ESP32)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={13} color="#06b6d4" />
                <span>Observation → Polygon → Owner Routing</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Dna size={13} color="#ec4899" />
                <span>Computer Vision Pathogen Diagnostics</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={13} color="#f59e0b" />
                <span>TomCast Risk Fusion & Action Engine</span>
              </div>
            </div>
          </div>

          {/* Column 3: Tech Stack */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc', marginBottom: '14px', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
              Built With
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['TypeScript', 'React 19', 'Vite', 'Framer Motion', 'Canvas Shaders', 'Glassmorphism'].map((tech) => (
                <span
                  key={tech}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '9999px',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} AgriShield Ecosystem. Designed for autonomous crop resilience.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>ALL SYSTEMS OPERATIONAL (4 PLOTS ACTIVE)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
