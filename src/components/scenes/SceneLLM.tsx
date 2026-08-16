import React, { useState } from 'react';
import { Sparkles, ArrowRight, RefreshCw, AlertTriangle, Leaf, CloudSun, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScenarioData, SceneSection } from '../../types';

interface SceneLLMProps {
  scenario: ScenarioData;
  onNextScene: (scene: SceneSection) => void;
}

interface LLMReport {
  summary: string;
  reasoning: string;
  recommended_action: string;
  secondary_note: string;
}

// Generates a deterministic, data-fused LLM-style report from real scenario values
const generateReport = (scenario: ScenarioData): LLMReport => {
  const { pests, weeds, climatic, field, riskLevel } = scenario;

  const riskWord = riskLevel === 'CRITICAL' ? 'critical' : riskLevel === 'HIGH' ? 'high' : riskLevel === 'MODERATE' ? 'moderate' : 'low';

  const summary =
    `${field.name} is under ${riskWord} threat. ` +
    `Optical rover imaging confirmed active ${pests.pestName.split('(')[0].trim()} infestation across ${pests.affectedCanopyZone.split('(')[0].trim()}, ` +
    `with ${weeds.weedCoveragePercent}% weed density (${weeds.weedType.split('(')[0].trim()}) competing for root-zone moisture. ` +
    `Ambient conditions — ${climatic.temperature}°C, ${climatic.humidity}% humidity — are sustaining pest reproduction and spore germination risk simultaneously.`;

  const reasoning =
    `The convergence of three independent stress vectors is what elevates this beyond a routine alert. ` +
    `Computer vision detected ${pests.detectionConfidence}% confidence bore-entry lesions on developing fruit — ` +
    `a pattern that only appears when larval population density exceeds economic threshold. ` +
    `Simultaneously, ${climatic.humidity}% relative humidity over ${climatic.leafWetnessHours} hours of leaf wetness ` +
    `creates the exact moisture envelope that accelerates fungal secondary infection on already-damaged tissue. ` +
    `The ${weeds.weedType.split('(')[0].trim()} cluster (${weeds.weedCoveragePercent}% coverage) acts as a vector reservoir — ` +
    `not just a moisture competitor — which means even after pest treatment, re-infestation risk remains elevated without weed removal. ` +
    `These three factors are fused, not independent.`;

  const recommended_action =
    `Within the next 48 hours: (1) Verify rover spray coverage on ${pests.roverActionTaken.rowsTreated} — ` +
    `walk rows 8–14 and confirm zero live larvae before 6 AM tomorrow. ` +
    `(2) Raise tunnel side curtains or activate boundary fans to bring canopy humidity below 75% — ` +
    `this single action reduces secondary fungal infection probability by an estimated 60%. ` +
    `(3) Hand-pull or confirm weedicide die-back on ${weeds.affectedRows} within 48 hours ` +
    `to eliminate the vector reservoir before the next pest generation hatches (72–96h window). ` +
    `Do not delay — ${climatic.farmerActionRequired.lossPreventionImpact}.`;

  const secondary_note =
    `${weeds.weedType.split('(')[0].trim()} is not yet the primary yield driver in this cycle, ` +
    `but its ${weeds.weedCoveragePercent}% field density is above the 5% threshold where root-zone water competition ` +
    `measurably stresses tomato fruit set. During the current ${climatic.heatStressIndex.toLowerCase()} heat stress period ` +
    `(${climatic.temperature}°C), this secondary pressure compounds blossom drop risk. ` +
    `Monitor weed re-emergence within 5–7 days post-weedicide application.`;

  return { summary, reasoning, recommended_action, secondary_note };
};

const Section: React.FC<{ icon: React.ReactNode; label: string; color: string; children: string; delay: number }> = ({ icon, label, color, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    style={{
      background: 'rgba(0,0,0,0.35)',
      borderRadius: '14px',
      padding: '20px 22px',
      border: `1px solid ${color}30`,
      marginBottom: '14px'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
      <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: `${color}20`, border: `1px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color, fontWeight: 700 }}>{label}</span>
    </div>
    <p style={{ fontSize: '0.9rem', color: 'rgba(248,250,252,0.92)', lineHeight: 1.7, margin: 0 }}>{children}</p>
  </motion.div>
);

export const SceneLLM: React.FC<SceneLLMProps> = ({ scenario, onNextScene }) => {
  const [report, setReport] = useState<LLMReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setReport(null);
    // Simulate a brief generation delay for effect
    setTimeout(() => {
      setReport(generateReport(scenario));
      setLoading(false);
      setGenerated(true);
    }, 1800);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 0 80px 0' }}>

      {/* Background */}
      <div
        className="scene-bg-layer"
        style={{
          backgroundImage: `url('/src/assets/llm_intelligence.jpg')`,
          filter: 'brightness(25%) contrast(120%) sepia(30%)'
        }}
      />
      <div className="scene-vignette" />

      <div className="max-container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>

          {/* LEFT */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '20px' }}>
              <Sparkles size={14} color="#f59e0b" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                LLM FIELD INTELLIGENCE
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 3.5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '20px' }}>
              Fused Intelligence <br />
              <span style={{ background: 'linear-gradient(135deg, #ffffff 40%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Field Report.
              </span>
            </h2>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '460px', marginBottom: '32px' }}>
              Cross-references rover optical data, environmental sensor readings, and weed detection vectors to generate a concise, actionable field briefing — not a generic template.
            </p>

            {/* What the report covers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { color: '#f59e0b', label: 'Summary', desc: 'What the dashboard shows at a glance' },
                { color: '#10b981', label: 'Reasoning', desc: 'Fused image + env + weed factor analysis' },
                { color: '#ef4444', label: 'Recommended Action', desc: 'Concrete, time-bound intervention steps' },
                { color: '#06b6d4', label: 'Secondary Note', desc: 'Secondary threats not to overlook' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}`, marginTop: '7px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f8fafc' }}>{item.label}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '6px' }}>— {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Report card */}
          <div className="glass-panel" style={{ padding: '36px', border: '1px solid rgba(245,158,11,0.35)', background: 'linear-gradient(145deg, rgba(16,14,8,0.95) 0%, rgba(8,8,4,0.98) 100%)' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245,158,11,0.4)' }}>
                  <Sparkles size={22} color="#f59e0b" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>Intelligence Report</h3>
                  <p style={{ fontSize: '0.75rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{scenario.field.name} · {scenario.field.code}</p>
                </div>
              </div>
              {generated && (
                <button
                  onClick={handleGenerate}
                  style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', borderRadius: '9999px', padding: '5px 12px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <RefreshCw size={11} />
                  Regenerate
                </button>
              )}
            </div>

            {/* Generate CTA or Loading or Report */}
            <AnimatePresence mode="wait">
              {!generated && !loading && (
                <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <Sparkles size={26} color="#f59e0b" />
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
                    Click to fuse rover optical data, live environmental readings, and weed vector analysis into a single actionable briefing.
                  </p>
                  <button
                    onClick={handleGenerate}
                    className="btn-primary"
                    style={{ justifyContent: 'center', padding: '14px 32px', background: 'linear-gradient(135deg, rgba(245,158,11,0.35) 0%, rgba(245,158,11,0.15) 100%)', border: '1px solid rgba(245,158,11,0.5)' }}
                  >
                    <Sparkles size={16} />
                    <span>Generate Intelligence Report</span>
                  </button>
                </motion.div>
              )}

              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>Fusing rover data · environmental sensors · weed vectors…</p>
                </motion.div>
              )}

              {report && !loading && (
                <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Section icon={<Zap size={13} color="#f59e0b" />} label="Summary" color="#f59e0b" delay={0.1}>
                    {report.summary}
                  </Section>
                  <Section icon={<Sparkles size={13} color="#10b981" />} label="Reasoning" color="#10b981" delay={0.25}>
                    {report.reasoning}
                  </Section>
                  <Section icon={<AlertTriangle size={13} color="#ef4444" />} label="Recommended Action" color="#ef4444" delay={0.4}>
                    {report.recommended_action}
                  </Section>
                  <Section icon={<Leaf size={13} color="#06b6d4" />} label="Secondary Note" color="#06b6d4" delay={0.55}>
                    {report.secondary_note}
                  </Section>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '20px', marginTop: '8px' }}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'space-between', padding: '13px 22px' }} onClick={() => onNextScene('pests')}>
                <span>Back to Pests Alert</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
