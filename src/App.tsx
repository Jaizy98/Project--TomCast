import React, { useState } from 'react';
import { SCENARIOS } from './data/mockData';
import { SceneSection } from './types';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { RadialControl } from './components/radial/RadialControl';
import { SceneContainer } from './components/scenes/SceneContainer';
import { RoverConsoleModal } from './components/dashboard/RoverConsoleModal';
import { Footer } from './components/layout/Footer';
import { Disc3 } from 'lucide-react';

export const App: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('field-alpha');
  const [activeSection, setActiveSection] = useState<SceneSection>('pests');
  const [isRoverModalOpen, setIsRoverModalOpen] = useState<boolean>(false);

  const currentScenario = SCENARIOS[activeScenarioId] || SCENARIOS['field-alpha'];

  const handleSelectField = (fieldId: string) => {
    if (SCENARIOS[fieldId]) {
      setActiveScenarioId(fieldId);
    }
  };

  const handleScrollToScenes = (section: SceneSection) => {
    setActiveSection(section);
    const element = document.getElementById('intelligence-scenes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#030805', color: '#f8fafc', overflowX: 'hidden' }}>
      
      {/* Top Floating Navbar */}
      <Navbar
        activeSection={activeSection}
        onSelectSection={handleScrollToScenes}
        overallRisk={currentScenario.riskLevel}
        onOpenRoverModal={() => setIsRoverModalOpen(true)}
      />

      {/* 1. Hero Section */}
      <HeroSection
        onExplore={handleScrollToScenes}
        onOpenRoverModal={() => setIsRoverModalOpen(true)}
        scenario={currentScenario}
      />

      {/* 2. Interactive 3-Axis Active Alerts Dial Section */}
      <section style={{
        position: 'relative',
        padding: '100px 0',
        background: 'radial-gradient(circle at 50% 50%, #07150c 0%, #030805 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div className="max-container" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '14px'
          }}>
            <Disc3 size={15} color="#10b981" />
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ACTIVE ALERTS DIAL CONTROLLER
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '14px'
          }}>
            Active Field Alerts.
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Interact with the circular dial to inspect real-time active alerts across <strong>Pests</strong> (rover sprayed), <strong>Weeds</strong> (weedicide applied), and <strong>Climatic Factors</strong> (farmer loss-reduction action).
          </p>
        </div>

        {/* The 3-Option Radial Control Mechanism */}
        <RadialControl
          activeSection={activeSection}
          onSelectSection={(sec) => {
            setActiveSection(sec);
            const el = document.getElementById('intelligence-scenes');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          currentRisk={currentScenario.riskLevel}
        />
      </section>

      {/* 3. Scene-Based Active Alerts Container */}
      <SceneContainer
        activeSection={activeSection}
        scenario={currentScenario}
        onSelectSection={(sec) => setActiveSection(sec)}
        onSelectField={handleSelectField}
        onOpenRoverModal={() => setIsRoverModalOpen(true)}
      />

      {/* 4. Rover ESP32 Telemetry Modal */}
      <RoverConsoleModal
        isOpen={isRoverModalOpen}
        onClose={() => setIsRoverModalOpen(false)}
        scenario={currentScenario}
      />

      {/* 6. Cinematic Environmental Intelligence Footer */}
      <Footer />
    </div>
  );
};

export default App;
