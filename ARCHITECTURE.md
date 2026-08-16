# AgriShield — System Architecture

## Overview

AgriShield is a single-page React application that acts as an autonomous crop risk intelligence dashboard. It combines live weather data (Open-Meteo API), mock IoT rover telemetry, and a scene-based UI to present real-time field threats and farmer action plans across multiple tomato crop plots.

---

## Application Layer Stack

```
Browser
 └── React 19 (Vite 6 + TypeScript 5.7)
      ├── State: useState (no external state lib)
      ├── Animation: Framer Motion
      ├── Icons: Lucide React
      ├── Styling: Inline styles + CSS modules
      └── External API: Open-Meteo (live weather)
```

---

## Component Tree

```
App.tsx  ← Root: holds activeScenarioId, activeSection, isRoverModalOpen
│
├── Navbar.tsx
│     Active section indicator, rover status badge, nav links
│
├── HeroSection.tsx
│     Full-screen cinematic landing, scenario headline, CTA
│     └── AmbientAtmosphere.tsx  (rain/light particle effect)
│
├── [Radial Section]  (App.tsx inline section)
│     └── RadialControl.tsx
│           Interactive 3-axis dial — Pests / Weeds / Climatic
│
├── SceneContainer.tsx  ← Animated scene switcher (Framer Motion)
│     Controlled by activeSection
│     │
│     ├── ScenePests.tsx         (activeSection === 'pests')
│     │     Card: Tomato Fruit Borer
│     │     ├── Observed Symptoms (3 farmer-readable points)
│     │     └── Rover Intervention
│     │           ├── Stats grid (volume, furrows, timestamp)
│     │           └── RoverFieldMap (seeded scatter crop dot map)
│     │
│     ├── SceneWeeds.tsx         (activeSection === 'weeds')
│     │     Card: Black Nightshade
│     │     ├── Weed Analysis (2 farmer points + location)
│     │     └── Rover Intervention (dosage, furrows, timestamp)
│     │
│     ├── SceneClimatic.tsx      (activeSection === 'climatic')
│     │     Live Open-Meteo API fetch on mount
│     │     Card: Climatic Stress Warning
│     │     ├── Data grid: Temperature, Humidity, Soil Moisture, Wind
│     │     ├── Bottom row: Rainfall (now), Heat Stress Index, Air Quality PM
│     │     └── Farmer's Plan (4 steps — all derived from live API readings)
│     │
│     ├── SceneAction.tsx        (activeSection === 'action')
│     │     5-Level Risk Fusion synthesis card
│     │     └── Intervention Command Center
│     │           Authorize drone spray / ground unit / SMS dispatch
│     │           Confetti on dispatch confirmation
│     │
│     └── FieldMap.tsx           (activeSection === 'map')
│           SVG polygon cadastral map (4 field plots)
│           Animated rover position waypoint loop
│           └── Field telemetry drilldown panel + plot switcher
│
├── RoverConsoleModal.tsx  ← Fixed overlay, triggered from Navbar
│     Live optical canopy camera mock
│     Battery / LoRa / RTK GNSS status
│     Raw ESP32 JSON packet stream viewer
│
└── Footer.tsx
```

---

## Data Flow

```
mockData.ts  ──────────────────────────────────────────────────────┐
 SCENARIOS (4 field scenarios)                                      │
 FIELDS (4 polygon definitions)                                     │
 RADIAL_SEGMENTS (3 dial config)                                    │
                                                                    ▼
App.tsx  ─── activeScenarioId ──► currentScenario ──► all children
              activeSection   ──► SceneContainer  ──► active scene
              isRoverModalOpen──► RoverConsoleModal

Open-Meteo API (https://api.open-meteo.com)
  Fields fetched: temperature_2m, relative_humidity_2m,
                  wind_speed_10m, soil_moisture_0_to_1cm, rain
  Derived client-side:
    • Heat Index  (Rothfusz equation)
    • Heat Stress Label (LOW / MODERATE / ELEVATED / SEVERE)
    • PM2.5 / PM10  (humidity + wind proxy model)
    • Air Quality Label
  All feed into SceneClimatic.tsx Farmer's Plan (4 dynamic steps)
```

---

## Scenario Switching

```
User clicks field in FieldMap  ──► onSelectField(fieldId)
                                        │
                                        ▼
                               App: setActiveScenarioId(fieldId)
                                        │
                                        ▼
                               currentScenario updates
                                        │
                              ┌─────────┴──────────┐
                              ▼                    ▼
                          Navbar              SceneContainer
                       (risk badge)         (all scene cards)
```

---

## Scene Navigation Flow

```
HeroSection  ──► (CTA click) ──► activeSection = 'pests'
                                        │
RadialControl ─► (dial select) ─► activeSection = X
                                        │
ScenePests ────► (next button) ─► activeSection = 'weeds'
SceneWeeds ────► (next button) ─► activeSection = 'climatic'
SceneClimatic ─► (next button) ─► activeSection = 'action'
SceneAction ───► (next button) ─► activeSection = 'map'
```

---

## IoT / Hardware Layer (Simulated)

```
ESP32 S3 Dual Core Rover  (AgriRover Vanguard Alpha)
 ├── RTK GNSS  — GPS coordinates, satellite lock count
 ├── LoRa / 4G Uplink — signal strength dBm
 ├── Optical Camera  — 30 FPS canopy imaging
 ├── Sensors:
 │    ├── Ambient temperature & humidity
 │    ├── Soil moisture + EC + pH
 │    └── Leaf wetness voltage
 └── Actuators:
      └── Micro-jet bio-pesticide / weedicide spray nozzles

Telemetry surfaced in: RoverConsoleModal (JSON packet stream)
Field actions logged in: ScenePests, SceneWeeds (Rover Intervention panel)
```

---

## File Structure

```
src/
├── App.tsx                         Root, global state
├── main.tsx                        React entry point
├── types/index.ts                  All shared TS interfaces
├── data/mockData.ts                SCENARIOS, FIELDS, RADIAL_SEGMENTS
├── assets/                         Background images (4 photos)
├── styles/
│   ├── index.css                   CSS vars, base, utilities
│   ├── cinematic.css               Scene animations
│   └── radial.css                  Radial control styles
└── components/
    ├── layout/
    │   ├── Navbar.tsx
    │   └── Footer.tsx
    ├── hero/
    │   ├── HeroSection.tsx
    │   └── AmbientAtmosphere.tsx
    ├── radial/
    │   └── RadialControl.tsx
    ├── scenes/
    │   ├── SceneContainer.tsx
    │   ├── ScenePests.tsx
    │   ├── SceneWeeds.tsx
    │   ├── SceneClimatic.tsx       ← Open-Meteo API live fetch
    │   └── SceneAction.tsx
    └── dashboard/
        ├── FieldMap.tsx
        └── RoverConsoleModal.tsx
```

---

## External Dependencies

| Package | Purpose |
|---|---|
| `react` 19 | UI framework |
| `framer-motion` 12 | Scene transitions, modal animations |
| `lucide-react` | Icon system |
| `canvas-confetti` | Dispatch confirmation effect |
| `vite` 6 | Dev server + build tool |
| `typescript` 5.7 | Type safety |
| Open-Meteo API | Live weather (free, no API key) |

---

---

## ChatGPT Image Generation Prompt

> Create a clean, dark-themed technical architecture diagram for a web application called **AgriShield** — an AI-powered autonomous crop risk intelligence dashboard. Use a dark green-black background (#030805) with glowing green (#10b981), cyan (#06b6d4), and white accent lines and labels. The style should look like a premium engineering blueprint or a HUD from a sci-fi agricultural system.
>
> The diagram should show the following layered architecture from top to bottom:
>
> **Top layer — User Interface (Browser)**
> Show a horizontal row of labeled UI blocks connected with lines:
> Navbar → HeroSection → RadialControl (3-axis dial) → SceneContainer → Footer
> SceneContainer branches into 5 scene cards side by side: ScenePests, SceneWeeds, SceneClimatic, SceneAction, FieldMap
>
> **Middle layer — Data & State**
> Two boxes connected upward to the UI:
> 1. "mockData.ts — Scenarios / Fields / Radial Segments" (static, grey)
> 2. "Open-Meteo REST API — Temperature, Humidity, Rain, Wind, Soil, Heat Index, PM2.5/PM10" (live, glowing cyan)
> Both feed into a central "App.tsx State — activeScenarioId / activeSection" box in green
>
> **Bottom layer — IoT Hardware (Simulated)**
> Show an ESP32 rover unit with sub-components:
> RTK GNSS, LoRa/4G Uplink, Optical Camera (30fps), Soil Sensors, Spray Nozzles
> Connected via dotted line upward to "RoverConsoleModal (ESP32 JSON Telemetry)"
>
> Use monospaced font labels, glowing node circles at connection points, dashed lines for data flows, solid lines for component hierarchy. Add subtle scanline grid texture to the background. Overall feel: cinematic, precise, agricultural tech.
