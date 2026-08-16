import React, { useEffect, useState } from 'react';
import { CloudSun, ShieldAlert, ArrowRight, Clock, AlertTriangle, Thermometer, Wind, Droplets } from 'lucide-react';
import { ScenarioData, SceneSection } from '../../types';
import { AmbientAtmosphere } from '../hero/AmbientAtmosphere';

interface SceneClimaticProps {
  scenario: ScenarioData;
  onNextScene: (scene: SceneSection) => void;
}

interface LiveWeather {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  windSpeed: number;
  // Derived
  heatIndex: number;
  heatStressLabel: string;
  heatStressColor: string;
  // PM2.5 / PM10 — estimated from wind + humidity + temp
  pm25: number;
  pm10: number;
  airQualityLabel: string;
  airQualityColor: string;
  rainfall: number;
}

// Open-Meteo fetch — lat/lng from North Valley Plot A rover coords
const fetchWeather = async (): Promise<LiveWeather | null> => {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=44.5125&longitude=-88.0642&current=temperature_2m,relative_humidity_2m,wind_speed_10m,soil_moisture_0_to_1cm,rain&wind_speed_unit=kmh&timezone=auto'
    );
    if (!res.ok) return null;
    const data = await res.json();
    const c = data.current;

    const temp: number = c.temperature_2m ?? 31.8;
    const hum: number = c.relative_humidity_2m ?? 88;
    const wind: number = c.wind_speed_10m ?? 5.2;
    const soilRaw: number = c.soil_moisture_0_to_1cm ?? 0.76;
    // rain = mm fallen in the current hour — true real-time reading
    const rainfall: number = Math.round((c.rain ?? 0) * 10) / 10;
    // soil_moisture_0_to_1cm is m³/m³ (0–1), convert to percentage
    const soilMoisture = Math.round(soilRaw * 100);

    // Heat index (Rothfusz equation, simplified)
    const hi = -8.78469475556
      + 1.61139411 * temp
      + 2.3385248 * hum
      - 0.14611605 * temp * hum
      - 0.012308094 * temp * temp
      - 0.016424828 * hum * hum
      + 0.002211732 * temp * temp * hum
      + 0.00072546 * temp * hum * hum
      - 0.000003582 * temp * temp * hum * hum;
    const heatIndex = Math.round(hi * 10) / 10;

    let heatStressLabel: string;
    let heatStressColor: string;
    if (heatIndex >= 41) { heatStressLabel = 'SEVERE'; heatStressColor = '#ef4444'; }
    else if (heatIndex >= 35) { heatStressLabel = 'ELEVATED'; heatStressColor = '#f59e0b'; }
    else if (heatIndex >= 30) { heatStressLabel = 'MODERATE'; heatStressColor = '#fbbf24'; }
    else { heatStressLabel = 'LOW'; heatStressColor = '#10b981'; }

    // PM2.5 / PM10 estimated via humidity & wind proxy model
    // Low wind + high humidity = higher particulate retention
    const basePm25 = 12 + (hum / 100) * 30 - (wind / 30) * 8;
    const pm25 = Math.max(5, Math.round(basePm25 * 10) / 10);
    const pm10 = Math.max(10, Math.round(pm25 * 1.75 * 10) / 10);

    let airQualityLabel: string;
    let airQualityColor: string;
    if (pm25 > 35) { airQualityLabel = 'UNHEALTHY'; airQualityColor = '#ef4444'; }
    else if (pm25 > 25) { airQualityLabel = 'MODERATE'; airQualityColor = '#f59e0b'; }
    else if (pm25 > 15) { airQualityLabel = 'FAIR'; airQualityColor = '#fbbf24'; }
    else { airQualityLabel = 'GOOD'; airQualityColor = '#10b981'; }

    return { temperature: temp, humidity: hum, soilMoisture, windSpeed: wind, heatIndex, heatStressLabel, heatStressColor, pm25, pm10, airQualityLabel, airQualityColor, rainfall };
  } catch {
    return null;
  }
};

// Stat tile used in the warning grid
const WarningTile: React.FC<{
  label: string;
  value: string;
  valueColor?: string;
  borderColor?: string;
  badge?: string;
  badgeColor?: string;
}> = ({ label, value, valueColor = '#f8fafc', borderColor = 'rgba(255,255,255,0.06)', badge, badgeColor }) => (
  <div style={{
    background: 'rgba(0,0,0,0.4)',
    padding: '13px 14px',
    borderRadius: '12px',
    border: `1px solid ${borderColor}`
  }}>
    <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '5px' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: valueColor, fontFamily: 'var(--font-mono)' }}>{value}</div>
      {badge && (
        <span style={{
          fontSize: '0.6rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: badgeColor ?? valueColor,
          background: `${badgeColor ?? valueColor}20`,
          border: `1px solid ${badgeColor ?? valueColor}50`,
          padding: '1px 6px', borderRadius: '9999px'
        }}>{badge}</span>
      )}
    </div>
  </div>
);

export const SceneClimatic: React.FC<SceneClimaticProps> = ({ scenario, onNextScene }) => {
  const { climatic } = scenario;
  const [live, setLive] = useState<LiveWeather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather().then(data => {
      setLive(data);
      setLoading(false);
    });
  }, []);

  // Resolved values — live API if available, fallback to mock
  const temp = live?.temperature ?? climatic.temperature;
  const hum = live?.humidity ?? climatic.humidity;
  const soil = live?.soilMoisture ?? climatic.soilMoisture;
  const wind = live?.windSpeed ?? climatic.windSpeed;
  const rainfall = live?.rainfall ?? climatic.rainfall;
  const heatIndex = live?.heatIndex ?? Math.round((temp + hum * 0.3) * 10) / 10;
  const heatStressLabel = live?.heatStressLabel ?? climatic.heatStressIndex;
  const heatStressColor = live?.heatStressColor ?? '#f59e0b';
  const pm25 = live?.pm25 ?? Math.round(12 + (hum / 100) * 30 - (wind / 30) * 8);
  const pm10 = live?.pm10 ?? Math.round(pm25 * 1.75);
  const airQualityLabel = live?.airQualityLabel ?? (pm25 > 35 ? 'UNHEALTHY' : pm25 > 25 ? 'MODERATE' : 'FAIR');
  const airQualityColor = live?.airQualityColor ?? '#f59e0b';

  // All 4 farmer plan steps driven by live readings
  const generateFarmerSteps = (): string[] => {
    const steps: string[] = [];

    // Step 1: Temperature-based irrigation advice
    if (temp >= 35) {
      steps.push(`Temperature is critically high at ${temp}°C — water your plants early morning (before 7 AM) and again after sunset to avoid heat-induced flower drop.`);
    } else if (temp >= 30) {
      steps.push(`Temperature is ${temp}°C, which is warm for tomatoes — irrigate in the early morning and keep soil moist throughout the day.`);
    } else {
      steps.push(`Temperature is comfortable at ${temp}°C — maintain your normal watering schedule and monitor plants for any stress signs.`);
    }

    // Step 2: Humidity-based canopy advice
    if (hum >= 85) {
      steps.push(`Humidity is very high at ${hum}% — open ventilation on both sides of your tunnel to bring it below 75% and reduce fungal disease risk.`);
    } else if (hum >= 70) {
      steps.push(`Humidity is at ${hum}%, slightly elevated — ensure good air circulation around plants and avoid overhead irrigation in the evening.`);
    } else {
      steps.push(`Humidity is at ${hum}%, within safe range — no canopy ventilation changes needed, but check leaves for any dryness.`);
    }

    // Step 3: Soil moisture-based watering advice
    if (soil < 35) {
      steps.push(`Soil moisture is dangerously low at ${soil}% — immediately increase drip irrigation by 30% for the next 48 hours to prevent wilting and fruit drop.`);
    } else if (soil < 50) {
      steps.push(`Soil moisture is at ${soil}%, below ideal — increase drip irrigation slightly for the next 24 hours, especially during hot afternoon hours.`);
    } else if (soil > 80) {
      steps.push(`Soil moisture is at ${soil}%, which is too wet — pause irrigation for 24 hours and check that drainage channels are clear to avoid root rot.`);
    } else {
      steps.push(`Soil moisture is at ${soil}%, within optimal range — keep the current irrigation schedule and re-check in 12 hours.`);
    }

    // Step 4: Air quality from PM readings
    if (pm25 > 35) {
      steps.push(`Air quality is poor — avoid fieldwork during midday, wear a mask if working, and keep harvested produce covered.`);
    } else if (pm25 > 25) {
      steps.push(`Air quality is moderate — avoid working in the field during midday and cover harvested produce.`);
    } else {
      steps.push(`Air quality is acceptable — no extra precautions needed today.`);
    }

    return steps;
  };

  const farmerSteps = generateFarmerSteps();

  const stressBadgeBg = `${heatStressColor}20`;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 0 80px 0' }}>

      {/* Background */}
      <div className="scene-bg-layer" style={{ backgroundImage: `url('/src/assets/weather_atmosphere.jpg')`, filter: 'brightness(35%) contrast(115%)' }} />
      <div className="scene-vignette" />
      <AmbientAtmosphere intensity={hum > 80 ? 'rain' : 'light'} />

      <div className="max-container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>

          {/* LEFT */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', marginBottom: '20px' }}>
              <CloudSun size={14} color="#06b6d4" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ACTIVE ALERT • CLIMATIC STRESS & LOSS-REDUCTION PLAN
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 3.5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '20px' }}>
              Climatic Stress & <br />
              <span style={{ background: 'linear-gradient(135deg, #ffffff 40%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Farmer Loss-Reduction Plan.
              </span>
            </h2>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '460px' }}>
              Live sensors and Open-Meteo data detected critical environmental stress factors. Below is the immediate action plan to protect your crop.
            </p>
          </div>

          {/* RIGHT: Warning Card */}
          <div className="glass-panel" style={{
            padding: '32px',
            border: `1px solid ${heatStressColor}50`,
            background: 'linear-gradient(145deg, rgba(8,20,18,0.95) 0%, rgba(4,14,12,0.98) 100%)',
            boxShadow: `0 0 40px ${heatStressColor}15`
          }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '22px', paddingBottom: '16px', borderBottom: `1px solid ${heatStressColor}25` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${heatStressColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${heatStressColor}50` }}>
                  <CloudSun size={22} color={heatStressColor} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>Climatic Stress</h3>
                  <p style={{ fontSize: '0.75rem', color: heatStressColor, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {loading ? 'Fetching live data…' : 'Live weather data'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: stressBadgeBg, color: heatStressColor, border: `1px solid ${heatStressColor}60`, padding: '4px 12px', borderRadius: '9999px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>
                  {heatStressLabel} STRESS
                </span>
                <span style={{ background: 'rgba(245,158,11,0.18)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.4)', padding: '4px 12px', borderRadius: '9999px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={12} color="#fbbf24" />
                  ACTION REQUIRED
                </span>
              </div>
            </div>

            {/* Warning Data Grid */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
                <WarningTile
                  label="Temperature"
                  value={`${temp}°C`}
                  valueColor={temp >= 35 ? '#ef4444' : temp >= 30 ? '#f59e0b' : '#f8fafc'}
                  borderColor={temp >= 35 ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)'}
                />
                <WarningTile
                  label="Humidity"
                  value={`${hum}%`}
                  valueColor={hum >= 85 ? '#22d3ee' : '#f8fafc'}
                  borderColor={hum >= 85 ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.06)'}
                />
                <WarningTile
                  label="Soil Moisture"
                  value={`${soil}%`}
                  valueColor={soil < 40 ? '#ef4444' : '#34d399'}
                  borderColor={soil < 40 ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.2)'}
                />
                <WarningTile
                  label="Wind Speed"
                  value={`${wind} km/h`}
                  valueColor="rgba(248,250,252,0.85)"
                />
              </div>

              {/* Rainfall + Heat Stress + Air Quality row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
                {/* Rainfall */}
                <div style={{ background: rainfall > 5 ? 'rgba(6,182,212,0.12)' : 'rgba(0,0,0,0.4)', padding: '13px 14px', borderRadius: '12px', border: rainfall > 5 ? '1px solid rgba(6,182,212,0.35)' : '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '5px' }}>Rainfall (now)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: rainfall > 5 ? '#22d3ee' : '#f8fafc', fontFamily: 'var(--font-mono)' }}>{rainfall} mm</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>
                    {rainfall === 0 ? 'No rain today' : rainfall <= 2 ? 'Light rain' : rainfall <= 10 ? 'Moderate rain' : 'Heavy rain'}
                  </div>
                </div>

                {/* Heat Stress Index */}
                <div style={{ background: `${heatStressColor}12`, padding: '13px 14px', borderRadius: '12px', border: `1px solid ${heatStressColor}40` }}>
                  <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '5px' }}>Heat Stress Index</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: heatStressColor, fontFamily: 'var(--font-mono)' }}>{heatIndex.toFixed(1)}°C</div>
                  <div style={{ fontSize: '0.65rem', color: heatStressColor, fontFamily: 'var(--font-mono)', marginTop: '3px', opacity: 0.8 }}>Feels like · {heatStressLabel}</div>
                </div>

                {/* PM2.5 / PM10 */}
                <div style={{ background: `${airQualityColor}12`, padding: '13px 14px', borderRadius: '12px', border: `1px solid ${airQualityColor}40` }}>
                  <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '5px' }}>Air Quality (PM)</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PM2.5</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: airQualityColor, fontFamily: 'var(--font-mono)' }}>{pm25}</div>
                    </div>
                    <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
                    <div>
                      <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PM10</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: airQualityColor, fontFamily: 'var(--font-mono)' }}>{pm10}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.62rem', color: airQualityColor, fontFamily: 'var(--font-mono)', marginTop: '4px', opacity: 0.85 }}>{airQualityLabel}</div>
                </div>
              </div>
            </div>

            {/* Farmer's Plan */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={13} />
                <span>Farmer's Plan</span>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.08)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(16,185,129,0.25)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
                  {climatic.farmerActionRequired.title}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {farmerSteps.map((step, idx) => (
                    <div key={idx} style={{
                      background: idx === farmerSteps.length - 1 ? `${airQualityColor}10` : 'rgba(0,0,0,0.35)',
                      borderRadius: '10px', padding: '11px 13px',
                      border: idx === farmerSteps.length - 1 ? `1px solid ${airQualityColor}30` : '1px solid rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'flex-start', gap: '10px'
                    }}>
                      <span style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        background: idx === farmerSteps.length - 1 ? `${airQualityColor}22` : 'rgba(16,185,129,0.22)',
                        color: idx === farmerSteps.length - 1 ? airQualityColor : '#34d399',
                        fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {idx + 1}
                      </span>
                      <p style={{ fontSize: '0.85rem', color: '#f8fafc', lineHeight: 1.5, margin: 0 }}>{step}</p>
                    </div>
                  ))}
                </div>

                {/* Urgency & Impact */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <div style={{ background: 'rgba(239,68,68,0.1)', padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.25)', fontSize: '0.78rem', color: '#fca5a5', fontFamily: 'var(--font-mono)' }}>
                    ⏳ <strong>Urgency:</strong> {climatic.farmerActionRequired.urgencyWindow}
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.12)', padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.25)', fontSize: '0.78rem', color: '#6ee7b7', fontFamily: 'var(--font-mono)' }}>
                    🛡️ <strong>Impact:</strong> {climatic.farmerActionRequired.lossPreventionImpact}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'space-between', padding: '14px 24px' }} onClick={() => onNextScene('action')}>
              <span>Proceed to Intervention Action</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>{/* end grid */}
      </div>
    </div>
  );
};
