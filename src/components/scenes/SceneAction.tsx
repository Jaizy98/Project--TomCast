import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, ArrowRight, Zap, Clock, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScenarioData, SceneSection } from '../../types';

interface SceneActionProps {
  scenario: ScenarioData;
  onNextScene: (scene: SceneSection) => void;
}

export const SceneAction: React.FC<SceneActionProps> = ({
  scenario,
  onNextScene
}) => {
  const { field, pests, weeds, climatic, alertHeadline, actionTimeline } = scenario;
  const [isDispatched, setIsDispatched] = useState(false);
  const [dispatchType, setDispatchType] = useState<string>('');

  const handleDispatch = (type: string) => {
    setDispatchType(type);
    setIsDispatched(true);
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#10b981', '#34d399', '#06b6d4', '#ffffff']
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 0 80px 0' }}>
      
      {/* Background Image Layer */}
      <div 
        className="scene-bg-layer"
        style={{
          backgroundImage: `url('/src/assets/precision_action.jpg')`,
          filter: 'brightness(55%) contrast(115%)'
        }}
      />
      <div className="scene-vignette" />

      <div className="max-container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '14px' }}>
            <Zap size={14} color="#f59e0b" />
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SCENE 04 • RISK FUSION & ACTION ENGINE
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
            From Active Alerts <br />
            <span style={{
              background: 'linear-gradient(135deg, #ffffff 40%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              To Decisive Action.
            </span>
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '650px', lineHeight: 1.6 }}>
            "The farmer is not looking at data. The farmer is looking at the state of the field."
          </p>
        </div>

        {/* 5-Level Visual Hierarchy Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', alignItems: 'start' }}>
          
          {/* Left Column: The 5-Level Hierarchy Synthesis */}
          <div className="glass-panel" style={{ padding: '32px', border: '1px solid rgba(245,158,11,0.3)' }}>
            
            {/* Level 1: What is happening? (RISK) */}
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.08em' }}>
                Level 1 — What is happening?
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  background: scenario.riskLevel === 'CRITICAL' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)',
                  color: scenario.riskLevel === 'CRITICAL' ? '#f87171' : '#fbbf24',
                  border: `1px solid ${scenario.riskLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b'}`
                }}>
                  {scenario.riskLevel}
                </span>
                <span>{scenario.alertHeadline}</span>
              </div>
            </div>

            {/* Level 2: Why? (EVIDENCE & REASONING) */}
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.7rem', color: '#6ee7b7', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.08em' }}>
                Level 2 — Why? (Active Alert Diagnostics)
              </div>
              <div style={{ fontSize: '0.92rem', color: 'rgba(240,250,244,0.9)', lineHeight: 1.6 }}>
                <strong>Pests:</strong> {pests.pestName} detected with {pests.detectionConfidence}% confidence. {pests.symptomsObserved}<br />
                <strong style={{ color: '#6ee7b7' }}>Weeds:</strong> {weeds.weedType} ({weeds.weedCoveragePercent}% density).<br />
                <strong style={{ color: '#22d3ee' }}>Climatic:</strong> {climatic.conditionSummary}
              </div>
            </div>

            {/* Level 3: What should I do? (ACTION) */}
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(16,185,129,0.12)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(16,185,129,0.3)' }}>
              <div style={{ fontSize: '0.7rem', color: '#34d399', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} />
                Level 3 — What should I do? (Prescribed Farmer Action)
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                {climatic.farmerActionRequired.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6ee7b7', fontFamily: 'var(--font-mono)' }}>
                ⏱️ {actionTimeline}
              </div>
            </div>

            {/* Level 4: Where? (FIELD / MAP) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="#10b981" />
                <span>Level 4 (Where): <strong>{field.name}</strong> ({field.code})</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>{field.acres} Acres</span>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch & Automation Command */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} color="#f59e0b" />
              <span>Intervention Command Center</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Authorize automated drone spraying or precision robotic intervention directly from the intelligence feed.
            </p>

            <AnimatePresence mode="wait">
              {isDispatched ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(16,185,129,0.4)',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    marginBottom: '24px'
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#10b981', color: '#030805', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                    <CheckCircle2 size={26} strokeWidth={2.5} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                    Mission Authorized & Dispatched!
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#6ee7b7', marginBottom: '14px' }}>
                    {dispatchType} is en-route to {field.name} coordinates (44.5124° N, 88.0642° W).
                  </p>
                  <button 
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '6px 16px' }}
                    onClick={() => setIsDispatched(false)}
                  >
                    Reset Dispatch
                  </button>
                </motion.div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  <button
                    className="btn-primary"
                    style={{ justifyContent: 'center', padding: '14px' }}
                    onClick={() => handleDispatch('Agri-Scan T40 Precision Sprayer Drone')}
                  >
                    <Send size={16} />
                    <span>Authorize Drone Bio-Fungicide Spraying</span>
                  </button>

                  <button
                    className="btn-secondary"
                    style={{ justifyContent: 'center', padding: '14px' }}
                    onClick={() => handleDispatch('Ground Precision Weeder Unit 04')}
                  >
                    <Zap size={16} />
                    <span>Dispatch Autonomous Ground Unit</span>
                  </button>

                  <button
                    className="btn-secondary"
                    style={{ justifyContent: 'center', padding: '14px' }}
                    onClick={() => handleDispatch('Automated SMS & Advisory to Agronomist')}
                  >
                    <Clock size={16} />
                    <span>Send SMS Warning to Farm Manager</span>
                  </button>
                </div>
              )}
            </AnimatePresence>

            {/* Next Story Scene Trigger Button */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
              <button 
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'space-between' }}
                onClick={() => onNextScene('map')}
              >
                <span>View Interactive Field Polygon Map</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
