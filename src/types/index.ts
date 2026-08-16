export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type SceneSection = 'pests' | 'weeds' | 'climatic' | 'action' | 'map' | 'llm';

export interface BoundingBox {
  id: string;
  x: number; // percentage
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
  type: 'pest' | 'weed' | 'disease' | 'healthy';
}

export interface PestAlertData {
  pestName: string;
  scientificName: string;
  detectionConfidence: number;
  affectedCanopyZone: string;
  severity: RiskLevel;
  symptomsObserved: string;
  roverActionTaken: {
    action: string;
    agentUsed: string;
    sprayVolumeMl: number;
    rowsTreated: string;
    completedAt: string;
    status: 'SPRAYING_COMPLETED' | 'SPRAYING_IN_PROGRESS' | 'MONITORING';
  };
  boundingBoxes: BoundingBox[];
}

export interface WeedAlertData {
  weedType: string;
  scientificName: string;
  detectionConfidence: number;
  weedCoveragePercent: number;
  affectedRows: string;
  severity: RiskLevel;
  threatDescription: string;
  roverActionTaken: {
    action: string;
    herbicideType: string;
    dosage: string;
    rowsTreated: string;
    completedAt: string;
    status: 'WEEDICIDE_SPRAYED' | 'MECHANICAL_REMOVAL' | 'SCHEDULED';
  };
  boundingBoxes: BoundingBox[];
}

export interface ClimaticAlertData {
  temperature: number; // °C
  humidity: number; // %
  heatStressIndex: 'LOW' | 'MODERATE' | 'ELEVATED' | 'SEVERE';
  leafWetnessHours: number;
  soilMoisture: number; // %
  rainfall: number; // mm
  windSpeed: number; // km/h
  soilPh: number;
  soilEc: number;
  conditionSummary: string;
  cropLossRiskAssessment: string;
  farmerActionRequired: {
    title: string;
    steps: string[];
    urgencyWindow: string;
    lossPreventionImpact: string;
  };
}

export interface RoverTelemetry {
  id: string;
  name: string;
  status: 'SURVEILLANCE_ACTIVE' | 'SAMPLING' | 'SPRAYING_ACTIVE' | 'STANDBY';
  batteryPercent: number;
  gpsCoordinates: { lat: number; lng: number };
  currentFieldId: string;
  speedMps: number;
  satellitesLocked: number;
  signalStrengthDbm: number;
  lastPingTime: string;
  temperatureCelsius: number;
  opticalCameraFps: number;
}

export interface FieldPolygon {
  id: string;
  name: string;
  code: string;
  cropType: string;
  ownerName: string;
  acres: number;
  coordinates: { x: number; y: number }[];
  overallRisk: RiskLevel;
  primaryThreat: string;
  actionRequired?: string;
}

export interface ScenarioData {
  id: string;
  label: string;
  subtitle: string;
  activeFieldId: string;
  riskLevel: RiskLevel;
  field: FieldPolygon;
  pests: PestAlertData;
  weeds: WeedAlertData;
  climatic: ClimaticAlertData;
  rover: RoverTelemetry;
  alertHeadline: string;
  actionTimeline: string;
}

export interface RadialSegment {
  id: SceneSection;
  label: string;
  sublabel: string;
  iconName: string;
  angle: number; // degrees in circle (0-360)
  accentColor: string;
  statusTag: string;
}
