import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneSection, ScenarioData } from '../../types';
import { ScenePests } from './ScenePests';
import { SceneWeeds } from './SceneWeeds';
import { SceneClimatic } from './SceneClimatic';
import { SceneAction } from './SceneAction';
import { FieldMap } from '../dashboard/FieldMap';
import { SceneLLM } from './SceneLLM';

interface SceneContainerProps {
  activeSection: SceneSection;
  scenario: ScenarioData;
  onSelectSection: (section: SceneSection) => void;
  onSelectField: (fieldId: string) => void;
  onOpenRoverModal: () => void;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({
  activeSection,
  scenario,
  onSelectSection,
  onSelectField,
  onOpenRoverModal
}) => {
  return (
    <section id="intelligence-scenes" style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeSection}-${scenario.id}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', minHeight: '100vh' }}
        >
          {activeSection === 'pests' && (
            <ScenePests 
              scenario={scenario} 
              onNextScene={onSelectSection} 
              onOpenRoverModal={onOpenRoverModal}
            />
          )}

          {activeSection === 'weeds' && (
            <SceneWeeds 
              scenario={scenario} 
              onNextScene={onSelectSection} 
              onOpenRoverModal={onOpenRoverModal}
            />
          )}

          {activeSection === 'climatic' && (
            <SceneClimatic 
              scenario={scenario} 
              onNextScene={onSelectSection} 
            />
          )}

          {activeSection === 'action' && (
            <SceneAction 
              scenario={scenario} 
              onNextScene={onSelectSection} 
            />
          )}

          {activeSection === 'map' && (
            <FieldMap 
              scenario={scenario} 
              onSelectField={onSelectField} 
            />
          )}

          {activeSection === 'llm' && (
            <SceneLLM
              scenario={scenario}
              onNextScene={onSelectSection}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
