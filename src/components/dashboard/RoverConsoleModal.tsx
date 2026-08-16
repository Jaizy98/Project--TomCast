import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Radio, Battery, Wifi, Navigation, Video, Terminal } from 'lucide-react';
import { ScenarioData } from '../../types';

interface RoverConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: ScenarioData;
}

export const RoverConsoleModal: React.FC<RoverConsoleModalProps> = ({
  isOpen,
  onClose,
  scenario
}) => {
  if (!isOpen) return null;

  const { rover, climatic, field } = scenario;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '920px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'rgba(8, 20, 13, 0.95)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '32px',
            borderRadius: '24px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.9)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.4)' }}>
                <Radio size={22} color="#10b981" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc' }}>
                  {rover.name} Telemetry Console
                </h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  HARDWARE ID: {rover.id} • ESP32 S3 DUAL CORE • FIRMWARE v4.18
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fafc',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Grid Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            
            {/* Live Camera Stream Mock */}
            <div style={{ background: '#030805', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                  <Video size={14} color="#ef4444" />
                  <span>OPTICAL CANOPY CAM</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#ef4444', background: 'rgba(239,68,68,0.15)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                  LIVE 30 FPS
                </span>
              </div>

              <div style={{ height: '160px', backgroundImage: `url('/src/assets/field_hero.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                <div className="hud-grid" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
                <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', color: '#6ee7b7' }}>
                  EXP: AUTO | ISO: 200 | DISP: 4K
                </div>
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', color: '#f8fafc' }}>
                  TARGET: TOMATO FOLIAGE
                </div>
              </div>
            </div>

            {/* Hardware & Battery Status */}
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Power & Communication
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Battery size={14} color="#10b981" />
                      Lithium-Iron Battery
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f8fafc' }}>{rover.batteryPercent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${rover.batteryPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wifi size={14} color="#06b6d4" />
                    LoRa / 4G Uplink
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#22d3ee' }}>{rover.signalStrengthDbm} dBm (Strong)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Navigation size={14} color="#f59e0b" />
                    RTK GNSS Fix
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>{rover.satellitesLocked} Satellites</span>
                </div>
              </div>
            </div>
          </div>

          {/* Raw ESP32 JSON Stream Viewer */}
          <div style={{ background: '#020604', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#6ee7b7', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              <Terminal size={14} />
              <span>LIVE ESP32 JSON PACKET STREAM (OBSERVATION → BACKEND)</span>
            </div>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: '#34d399',
              background: 'rgba(0,0,0,0.5)',
              padding: '12px',
              borderRadius: '8px',
              overflowX: 'auto',
              lineHeight: 1.5
            }}>
{JSON.stringify({
  device_id: rover.id,
  timestamp: new Date().toISOString(),
  gps: {
    lat: rover.gpsCoordinates.lat,
    lng: rover.gpsCoordinates.lng,
    altitude_m: 142.5,
    rtk_status: "FIXED_HIGH_PRECISION"
  },
  sensors: {
    ambient_temp_c: climatic.temperature,
    relative_humidity_pct: climatic.humidity,
    leaf_wetness_volts: 2.84,
    soil_moisture_pct: climatic.soilMoisture,
    soil_ec_ms_cm: climatic.soilEc,
    soil_ph: climatic.soilPh
  },
  resolved_field: {
    polygon_id: field.code,
    owner_id: field.ownerName
  }
}, null, 2)}
            </pre>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
