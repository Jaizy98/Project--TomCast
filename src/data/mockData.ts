import { ScenarioData, FieldPolygon, RadialSegment } from '../types';

export const FIELDS: FieldPolygon[] = [
  {
    id: 'field-alpha',
    name: 'North Valley Plot A',
    code: 'FLD-ALPHA-01',
    cropType: 'Roma Tomato (Determinate)',
    ownerName: 'Marcus Vance — Valley Agro',
    acres: 48.5,
    coordinates: [
      { x: 18, y: 15 },
      { x: 48, y: 12 },
      { x: 44, y: 46 },
      { x: 14, y: 42 }
    ],
    overallRisk: 'CRITICAL',
    primaryThreat: 'Tomato Fruit Borer (Helicoverpa armigera) & Early Blight'
  },
  {
    id: 'field-beta',
    name: 'River Basin Plot B',
    code: 'FLD-BETA-02',
    cropType: 'San Marzano Tomato',
    ownerName: 'Elena Rostova — GreenStream Farms',
    acres: 62.0,
    coordinates: [
      { x: 54, y: 14 },
      { x: 88, y: 22 },
      { x: 82, y: 52 },
      { x: 50, y: 48 }
    ],
    overallRisk: 'HIGH',
    primaryThreat: 'Extreme Humidity Saturation (94% RH) & Spore Germination'
  },
  {
    id: 'field-gamma',
    name: 'Highland Terrace Plot C',
    code: 'FLD-GAMMA-03',
    cropType: 'Beefsteak Tomato',
    ownerName: 'Dr. Arthur Pendelton — Solanaceae Research',
    acres: 35.2,
    coordinates: [
      { x: 12, y: 52 },
      { x: 46, y: 56 },
      { x: 40, y: 88 },
      { x: 10, y: 82 }
    ],
    overallRisk: 'LOW',
    primaryThreat: 'Routine maintenance: Microclimate optimal'
  },
  {
    id: 'field-delta',
    name: 'Ridge Grove Plot D',
    code: 'FLD-DELTA-04',
    cropType: 'Cherry Tomato (Campari)',
    ownerName: 'Kiran Patel — Ridgecrest Organics',
    acres: 54.8,
    coordinates: [
      { x: 52, y: 58 },
      { x: 86, y: 62 },
      { x: 80, y: 92 },
      { x: 48, y: 88 }
    ],
    overallRisk: 'MODERATE',
    primaryThreat: 'Invasive Black Nightshade & Pigweed Vector Cluster'
  }
];

export const RADIAL_SEGMENTS: RadialSegment[] = [
  {
    id: 'pests',
    label: 'Pests Alert',
    sublabel: 'Pest detected & Rover spray executed',
    iconName: 'Bug',
    angle: 0,
    accentColor: '#ef4444',
    statusTag: 'SPRAYED BY ROVER'
  },
  {
    id: 'weeds',
    label: 'Weeds Alert',
    sublabel: 'Weed species detected & Weedicide sprayed',
    iconName: 'Sprout',
    angle: 90,
    accentColor: '#10b981',
    statusTag: 'WEEDICIDE APPLIED'
  },
  {
    id: 'climatic',
    label: 'Climatic Factors',
    sublabel: 'Field conditions & Farmer action plan',
    iconName: 'CloudSun',
    angle: 180,
    accentColor: '#06b6d4',
    statusTag: 'FARMER ACTION REQ.'
  },
  {
    id: 'map',
    label: 'Polygon Map',
    sublabel: 'GPS field polygons & rover telemetry',
    iconName: 'MapPin',
    angle: 270,
    accentColor: '#8b5cf6',
    statusTag: '4 CADASTRAL PLOTS'
  }
];

export const SCENARIOS: Record<string, ScenarioData> = {
  'field-alpha': {
    id: 'field-alpha',
    label: 'Scenario Alpha: Fruit Borer Outbreak',
    subtitle: 'Tomato Fruit Borer detected on mid-canopy clusters; rover bio-spray dispatched',
    activeFieldId: 'field-alpha',
    riskLevel: 'CRITICAL',
    field: FIELDS[0],
    pests: {
      pestName: 'Tomato Fruit Borer (Helicoverpa armigera)',
      scientificName: 'Helicoverpa armigera / Noctuidae',
      detectionConfidence: 96.8,
      affectedCanopyZone: 'Mid-Canopy & Early Fruit Clusters (Furrow Rows 8–14)',
      severity: 'CRITICAL',
      symptomsObserved: 'Bore holes in developing green fruit, larval frass deposition, and early necrotic tissue decay.',
      roverActionTaken: {
        action: 'Automated Micro-Jet Bio-Pesticide Spraying',
        agentUsed: 'Bacillus thuringiensis (Bt kurstaki) + Organic Neem Extract',
        sprayVolumeMl: 480,
        rowsTreated: 'Furrow Rows 8, 9, 10, 11, 12, 13, 14',
        completedAt: 'Today at 06:14 AM (Rover Pass #03)',
        status: 'SPRAYING_COMPLETED'
      },
      boundingBoxes: [
        { id: 'p1', x: 28, y: 30, width: 24, height: 22, label: 'Fruit Borer Larva (Active)', confidence: 97.4, type: 'pest' },
        { id: 'p2', x: 54, y: 42, width: 20, height: 18, label: 'Bore Entry Lesion', confidence: 95.1, type: 'disease' },
        { id: 'p3', x: 40, y: 64, width: 18, height: 16, label: 'Secondary Necrosis', confidence: 92.3, type: 'disease' }
      ]
    },
    weeds: {
      weedType: 'Black Nightshade (Solanum nigrum)',
      scientificName: 'Solanum nigrum L.',
      detectionConfidence: 93.4,
      weedCoveragePercent: 8.5,
      affectedRows: 'Rows 10–12 Inter-Row Boundary',
      severity: 'MODERATE',
      threatDescription: 'Acts as primary alternate host reservoir for tomato mosaic virus and fruit borer pupation.',
      roverActionTaken: {
        action: 'Precision Targeted Spot Spraying',
        herbicideType: 'Pelargonic Acid (Organic Bio-Weedicide)',
        dosage: '12% v/v direct droplet application',
        rowsTreated: 'Rows 10–12',
        completedAt: 'Today at 06:22 AM',
        status: 'WEEDICIDE_SPRAYED'
      },
      boundingBoxes: [
        { id: 'w1', x: 30, y: 45, width: 26, height: 24, label: 'Black Nightshade Cluster', confidence: 94.2, type: 'weed' }
      ]
    },
    climatic: {
      temperature: 31.8,
      humidity: 88,
      heatStressIndex: 'ELEVATED',
      leafWetnessHours: 8.6,
      soilMoisture: 76,
      rainfall: 12.4,
      windSpeed: 5.2,
      soilPh: 6.3,
      soilEc: 1.45,
      conditionSummary: 'High ambient temperature (31.8°C) accompanied by saturated 88% humidity and 8.6 hours of continuous canopy leaf wetness.',
      cropLossRiskAssessment: 'Elevated temperature and persistent dew create an optimal incubation environment for rapid fungal secondary infection and rapid pest reproduction.',
      farmerActionRequired: {
        title: 'Canopy Aeration & Anti-Transpirant Action Plan',
        steps: [
          'Activate boundary ventilation fans / raise high-tunnel side curtains to reduce canopy humidity below 75%.',
          'Delay overhead irrigation; switch exclusively to sub-surface drip in the evening to prevent prolonged leaf wetness.',
          'Inspect treated rows 8–14 in 24 hours to confirm 100% larval mortality.'
        ],
        urgencyWindow: 'Execute within 12 hours to prevent yield loss',
        lossPreventionImpact: 'Prevents estimated 18% to 25% marketable tomato crop loss.'
      }
    },
    rover: {
      id: 'ROVER-SCAN-01',
      name: 'AgriRover Vanguard Alpha',
      status: 'SPRAYING_ACTIVE',
      batteryPercent: 84,
      gpsCoordinates: { lat: 44.51248, lng: -88.06421 },
      currentFieldId: 'field-alpha',
      speedMps: 1.2,
      satellitesLocked: 14,
      signalStrengthDbm: -62,
      lastPingTime: '10 seconds ago',
      temperatureCelsius: 29.4,
      opticalCameraFps: 30
    },
    alertHeadline: 'CRITICAL ALERT: Fruit Borer Outbreak Detected in North Valley',
    actionTimeline: 'Rover Spray: Completed • Farmer Aeration Action: Next 12h'
  },
  'field-beta': {
    id: 'field-beta',
    label: 'Scenario Beta: High Humidity & Spore Alert',
    subtitle: 'River Basin dew point spiked with standing fog; preventive bio-barrier applied',
    activeFieldId: 'field-beta',
    riskLevel: 'HIGH',
    field: FIELDS[1],
    pests: {
      pestName: 'Early Blight Fungal Spores (Alternaria solani)',
      scientificName: 'Alternaria solani',
      detectionConfidence: 94.2,
      affectedCanopyZone: 'Lower Foliage & Cuticle Droplets (Rows 4–18)',
      severity: 'HIGH',
      symptomsObserved: 'Micro-conidia attachment on moisture guttation droplets on lower leaf margins.',
      roverActionTaken: {
        action: 'Preventive Protective Fungicide Misting',
        agentUsed: 'Copper Octanoate (Low Dose Bio-Shield)',
        sprayVolumeMl: 620,
        rowsTreated: 'Rows 4 through 18',
        completedAt: 'Today at 05:48 AM',
        status: 'SPRAYING_COMPLETED'
      },
      boundingBoxes: [
        { id: 'p4', x: 32, y: 35, width: 22, height: 20, label: 'Spore Colony Attachment', confidence: 93.8, type: 'disease' }
      ]
    },
    weeds: {
      weedType: 'Redroot Pigweed (Amaranthus retroflexus)',
      scientificName: 'Amaranthus retroflexus',
      detectionConfidence: 91.5,
      weedCoveragePercent: 4.2,
      affectedRows: 'Rows 6–8 Edge Furrow',
      severity: 'LOW',
      threatDescription: 'Competes for root-zone moisture during high humidity fog periods.',
      roverActionTaken: {
        action: 'Micro-dose Contact Bio-Weedicide Application',
        herbicideType: 'Caprylic/Capric Acid Spray',
        dosage: '8% target micro-nozzle burst',
        rowsTreated: 'Rows 6–8',
        completedAt: 'Today at 05:55 AM',
        status: 'WEEDICIDE_SPRAYED'
      },
      boundingBoxes: [
        { id: 'w2', x: 48, y: 52, width: 24, height: 22, label: 'Redroot Pigweed Seedling', confidence: 92.0, type: 'weed' }
      ]
    },
    climatic: {
      temperature: 22.4,
      humidity: 95,
      heatStressIndex: 'MODERATE',
      leafWetnessHours: 9.8,
      soilMoisture: 84,
      rainfall: 24.0,
      windSpeed: 3.5,
      soilPh: 6.5,
      soilEc: 1.62,
      conditionSummary: 'Severe moisture condensation with 95% humidity, calm wind (3.5 km/h), and standing river basin fog.',
      cropLossRiskAssessment: 'TomCast Daily Severity Value (DSV) has reached maximum threshold 4, indicating rapid spore germination risk without immediate drainage.',
      farmerActionRequired: {
        title: 'Furrow Drainage & Foliar Drying Action Plan',
        steps: [
          'Clear tailwater drainage channels at south basin exit to eliminate standing water puddles.',
          'Halt all automated irrigation cycles for the next 36 hours.',
          'Apply supplementary silica-based foliar strengthener if heavy rain persists.'
        ],
        urgencyWindow: 'Execute within 18 hours before evening condensation front',
        lossPreventionImpact: 'Mitigates 30% potential crop loss from grey mould and early blight spread.'
      }
    },
    rover: {
      id: 'ROVER-SCAN-01',
      name: 'AgriRover Vanguard Alpha',
      status: 'SAMPLING',
      batteryPercent: 78,
      gpsCoordinates: { lat: 44.51612, lng: -88.05834 },
      currentFieldId: 'field-beta',
      speedMps: 0.9,
      satellitesLocked: 16,
      signalStrengthDbm: -58,
      lastPingTime: '5 seconds ago',
      temperatureCelsius: 22.0,
      opticalCameraFps: 30
    },
    alertHeadline: 'HIGH RISK ALERT: Atmospheric Spore Pressure in River Basin',
    actionTimeline: 'Rover Protective Spray: Done • Farmer Drainage Action: Next 18h'
  },
  'field-gamma': {
    id: 'field-gamma',
    label: 'Scenario Gamma: Balanced Canopy Condition',
    subtitle: 'Highland terrace microclimate optimal; zero active pest or weed outbreak',
    activeFieldId: 'field-gamma',
    riskLevel: 'LOW',
    field: FIELDS[2],
    pests: {
      pestName: 'No Destructive Pests Detected',
      scientificName: 'Beneficial predatory fauna active',
      detectionConfidence: 99.2,
      affectedCanopyZone: 'None (Canopy Healthy)',
      severity: 'LOW',
      symptomsObserved: 'Clean foliage, uniform chlorophyll index, zero lesion or borer entry points.',
      roverActionTaken: {
        action: 'Routine Optical Multi-Spectral Surveillance Pass',
        agentUsed: 'None Required',
        sprayVolumeMl: 0,
        rowsTreated: 'None',
        completedAt: 'Today at 07:00 AM',
        status: 'MONITORING'
      },
      boundingBoxes: [
        { id: 'p5', x: 25, y: 25, width: 50, height: 48, label: 'Healthy Vigorous Leaf Tissue', confidence: 99.4, type: 'healthy' }
      ]
    },
    weeds: {
      weedType: 'Negligible Weed Pressure (<0.4%)',
      scientificName: 'Native mulch cover',
      detectionConfidence: 98.8,
      weedCoveragePercent: 0.4,
      affectedRows: 'None',
      severity: 'LOW',
      threatDescription: 'Canopy shading naturally suppresses weed germination.',
      roverActionTaken: {
        action: 'Surveillance Logging Only',
        herbicideType: 'None Required',
        dosage: '0',
        rowsTreated: 'None',
        completedAt: 'Today at 07:05 AM',
        status: 'SCHEDULED'
      },
      boundingBoxes: []
    },
    climatic: {
      temperature: 23.2,
      humidity: 58,
      heatStressIndex: 'LOW',
      leafWetnessHours: 1.1,
      soilMoisture: 52,
      rainfall: 0.0,
      windSpeed: 10.4,
      soilPh: 6.7,
      soilEc: 1.38,
      conditionSummary: 'Ideal agricultural climate: dry aerated canopy, moderate 23.2°C temperature, and steady 10.4 km/h breeze.',
      cropLossRiskAssessment: 'Zero adverse environmental stress; crop vigor index at 98.6%.',
      farmerActionRequired: {
        title: 'Maintain Standard Vegetative Growth Schedule',
        steps: [
          'Continue scheduled automated sub-surface drip fertigation at standard nitrogen/potassium ratio.',
          'Schedule next routine autonomous rover scout pass in 12 hours.'
        ],
        urgencyWindow: 'Routine maintenance cycle',
        lossPreventionImpact: 'Field tracking at 100% optimal yield projection.'
      }
    },
    rover: {
      id: 'ROVER-SCAN-01',
      name: 'AgriRover Vanguard Alpha',
      status: 'SURVEILLANCE_ACTIVE',
      batteryPercent: 91,
      gpsCoordinates: { lat: 44.50982, lng: -88.06715 },
      currentFieldId: 'field-gamma',
      speedMps: 1.5,
      satellitesLocked: 15,
      signalStrengthDbm: -54,
      lastPingTime: '2 seconds ago',
      temperatureCelsius: 23.1,
      opticalCameraFps: 30
    },
    alertHeadline: 'OPTIMAL STATUS: Highland Terrace Operating at Peak Health',
    actionTimeline: 'No Urgent Intervention Needed • Next Routine Pass: 12h'
  },
  'field-delta': {
    id: 'field-delta',
    label: 'Scenario Delta: Solanaceae Weed Infestation',
    subtitle: 'Dense weed cluster detected competing for moisture; precision weedicide applied',
    activeFieldId: 'field-delta',
    riskLevel: 'MODERATE',
    field: FIELDS[3],
    pests: {
      pestName: 'Aphid Vector Colony on Weed Margins',
      scientificName: 'Aphis gossypii',
      detectionConfidence: 92.8,
      affectedCanopyZone: 'Field Edge & Weed Buffer Zone (Rows 12–18)',
      severity: 'MODERATE',
      symptomsObserved: 'Minor leaf curling on adjacent edge plants near dense weed growth.',
      roverActionTaken: {
        action: 'Localized Border Protective Bio-Spray',
        agentUsed: 'Potassium Salts of Fatty Acids (Insecticidal Soap)',
        sprayVolumeMl: 310,
        rowsTreated: 'Border Rows 12–18',
        completedAt: 'Today at 06:45 AM',
        status: 'SPRAYING_COMPLETED'
      },
      boundingBoxes: [
        { id: 'p6', x: 38, y: 40, width: 22, height: 20, label: 'Aphid Colony Cluster', confidence: 93.1, type: 'pest' }
      ]
    },
    weeds: {
      weedType: 'Black Nightshade & Redroot Pigweed Infestation',
      scientificName: 'Solanum nigrum & Amaranthus retroflexus',
      detectionConfidence: 95.6,
      weedCoveragePercent: 19.8,
      affectedRows: 'Furrows 12 through 18',
      severity: 'HIGH',
      threatDescription: 'Dense weed density (19.8%) robbing root-zone water and acting as insect vector shelter.',
      roverActionTaken: {
        action: 'Precision Targeted Micro-Weedicide Application',
        herbicideType: 'Organic Non-Selective Citrus Oil & Pelargonic Acid',
        dosage: 'Direct spot-spray via rover twin nozzles',
        rowsTreated: 'Furrows 12, 13, 14, 15, 16, 17, 18',
        completedAt: 'Today at 06:52 AM',
        status: 'WEEDICIDE_SPRAYED'
      },
      boundingBoxes: [
        { id: 'w3', x: 22, y: 32, width: 28, height: 26, label: 'Dense Nightshade Patch', confidence: 96.2, type: 'weed' },
        { id: 'w4', x: 56, y: 48, width: 24, height: 22, label: 'Pigweed Cluster', confidence: 94.5, type: 'weed' }
      ]
    },
    climatic: {
      temperature: 34.6,
      humidity: 48,
      heatStressIndex: 'SEVERE',
      leafWetnessHours: 0.8,
      soilMoisture: 39,
      rainfall: 0.0,
      windSpeed: 14.8,
      soilPh: 6.4,
      soilEc: 1.51,
      conditionSummary: 'High heat spike (34.6°C) with dry atmospheric conditions (48% RH) and low root-zone moisture (39%).',
      cropLossRiskAssessment: 'Weed water theft combined with intense heat accelerates plant dehydration and flower blossom drop.',
      farmerActionRequired: {
        title: 'Emergency Drip Re-Hydration & Shade Action Plan',
        steps: [
          'Increase drip irrigation volume by 25% during late evening hours to restore root-zone moisture.',
          'Deploy overhead shade cloth (30% density) over Ridge Grove to mitigate solar burn on exposed fruit.',
          'Inspect furrow rows 12–18 to confirm weed die-back within 48 hours.'
        ],
        urgencyWindow: 'Execute within 8 hours to prevent blossom abortion',
        lossPreventionImpact: 'Saves an estimated 20% fruit set from heat-induced blossom drop.'
      }
    },
    rover: {
      id: 'ROVER-SCAN-01',
      name: 'AgriRover Vanguard Alpha',
      status: 'SPRAYING_ACTIVE',
      batteryPercent: 72,
      gpsCoordinates: { lat: 44.50741, lng: -88.05619 },
      currentFieldId: 'field-delta',
      speedMps: 1.1,
      satellitesLocked: 13,
      signalStrengthDbm: -66,
      lastPingTime: '6 seconds ago',
      temperatureCelsius: 32.8,
      opticalCameraFps: 30
    },
    alertHeadline: 'MODERATE ALERT: Weed Infestation & Heat Stress in Ridge Grove',
    actionTimeline: 'Rover Weedicide: Sprayed • Farmer Heat Action: Next 8h'
  }
};
