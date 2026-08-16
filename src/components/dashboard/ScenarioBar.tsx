import React from 'react';
import { SCENARIOS } from '../../data/mockData';
import { RiskLevel } from '../../types';
import { Sparkles, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ScenarioBarProps {
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
}

export const ScenarioBar: React.FC<ScenarioBarProps> = ({
  activeScenarioId,
  onSelectScenario
}) => {
  const getBadgeIcon = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL': return <ShieldAlert size={14} color="#ef4444" />;
      case 'HIGH': return <AlertTriangle size={14} color="#f59e0b" />;
      case 'MODERATE': return <AlertTriangle size={14} color="#fbbf24" />;
      default: return <CheckCircle2 size={14} color="#10b981" />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 40,
      background: 'rgba(8, 18, 12, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '9999px',
      padding: '6px 10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
      maxWidth: '94vw',
      overflowX: 'auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        paddingLeft: '10px',
        paddingRight: '6px',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Sparkles size={14} color="#10b981" />
        <span style={{
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap'
        }}>
          Live Scenarios
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {Object.values(SCENARIOS).map((scen) => {
          const isActive = scen.id === activeScenarioId;
          return (
            <button
              key={scen.id}
              onClick={() => onSelectScenario(scen.id)}
              style={{
                background: isActive ? 'rgba(16, 185, 129, 0.22)' : 'transparent',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid transparent',
                borderRadius: '9999px',
                padding: '6px 14px',
                color: isActive ? '#f8fafc' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-display)',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {getBadgeIcon(scen.riskLevel)}
              <span>{scen.label.split(':')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
