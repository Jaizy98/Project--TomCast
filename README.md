# TomCast — Autonomous Crop Risk Intelligence Platform

TomCast is an AI-powered field intelligence dashboard for precision tomato farming. It fuses autonomous rover optical sensing, live weather data, and weed detection into real-time actionable alerts for farmers.

---

## What It Does

- **Pests Alert** — Detects active pest infestations via rover computer vision and logs autonomous bio-spray interventions with a field coverage map
- **Weeds Alert** — Identifies invasive weed species competing for root-zone moisture with farmer-readable guidance
- **Climatic Factors** — Pulls live weather data (temperature, humidity, soil moisture, rainfall, heat stress index, air quality) from the Open-Meteo API and generates a dynamic farmer action plan
- **Intervention Engine** — 5-level risk fusion synthesises all threats into a single actionable briefing
- **Polygon Map** — Interactive GPS cadastral field map with animated rover telemetry
- **LLM Intelligence** — Generates an AI-fused field report (summary, reasoning, recommended action, secondary note) from all fused data sources

---

## Running Locally

### Prerequisites

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/Jaizy98/Project--TomCast.git
cd "Project--TomCast"
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the development server**
```bash
npm run dev
```

**4. Open in browser**

The terminal will show a local URL — open it:
```
http://localhost:5173
```
> If port 5173 is in use, Vite will pick the next available port (e.g. 5174). The exact URL is printed in the terminal.

---

## Navigating the Dashboard

- Click the **☰ hamburger icon** (top-left) to open the side navigation drawer
- Use the **interactive radial dial** to switch between Pests, Weeds, Climatic, and Map views
- Click **ROVER ONLINE** (top-right) to open the ESP32 rover telemetry console
- Click **LLM Intelligence** in the side drawer to generate an AI field report
- The **Climatic Factors** scene fetches live weather data automatically on load (requires internet connection)

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 + TypeScript 5.7 |
| Build Tool | Vite 6 |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Live Data | Open-Meteo API (free, no key required) |
| Styling | Inline styles + CSS modules |

---

## Build for Production

```bash
npm run build
```
Output goes to the `dist/` folder. Preview it locally with:
```bash
npm run preview
```
