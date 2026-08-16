# Project Structure

## Directory Organization

```
src/
├── components/          # React component modules organized by feature
│   ├── dashboard/      # Field management and rover controls
│   ├── hero/          # Landing section and ambient atmosphere
│   ├── layout/        # Navbar and Footer
│   ├── radial/        # 3-axis radial control mechanism
│   └── scenes/        # Alert scene cards (pests, weeds, climatic, action)
├── data/              # Mock data and scenarios
├── styles/            # Global CSS modules
├── types/             # TypeScript type definitions
├── assets/            # Images (field_hero.jpg, weather_atmosphere.jpg, etc.)
├── App.tsx            # Root application component
└── main.tsx           # Application entry point
```

## Component Architecture

### Feature-Based Organization
Components are grouped by domain feature rather than technical role:
- **dashboard/**: Field map, rover console modal, scenario switcher
- **hero/**: Hero section with ambient atmosphere effects
- **scenes/**: Modular alert cards for each threat category
- **radial/**: Interactive circular control for navigation

### Component Naming
- PascalCase for component files: `HeroSection.tsx`, `RadialControl.tsx`
- Exported as named exports: `export const ComponentName: React.FC = () => { ... }`

## Styling Approach

### Inline Styles (Primary)
Most components use inline `style` objects for maximum flexibility:
```tsx
<div style={{
  background: 'rgba(16, 185, 129, 0.2)',
  borderRadius: '9999px',
  padding: '7px 16px'
}}>
```

### CSS Modules (Secondary)
Global styles in `src/styles/`:
- `index.css`: Base styles, CSS custom properties, utility classes
- `cinematic.css`: Cinematic animations and transitions
- `radial.css`: Radial control specific styles

### CSS Custom Properties
Defined in `index.css` and referenced via `var()`:
- `--font-display`: Display font (Outfit)
- `--font-body`: Body font (Plus Jakarta Sans)
- `--font-mono`: Monospace font (JetBrains Mono)
- `--text-secondary`: Secondary text color

## Type System

### Centralized Types (`src/types/index.ts`)
All shared TypeScript interfaces and types are exported from a single location:
- **Domain types**: `RiskLevel`, `SceneSection`, `FieldPolygon`
- **Data models**: `PestAlertData`, `WeedAlertData`, `ClimaticAlertData`
- **Telemetry**: `RoverTelemetry`, `BoundingBox`
- **UI types**: `RadialSegment`, `ScenarioData`

### Type Usage
- Components import types from `../../types`
- No inline type definitions for shared domain concepts
- Props interfaces defined locally within component files

## Data Layer

### Mock Data (`src/data/mockData.ts`)
- `SCENARIOS`: Record of 4 field scenarios (alpha, beta, gamma, delta)
- `FIELDS`: Array of field polygon definitions
- `RADIAL_SEGMENTS`: Configuration for 3-axis radial control

### State Management
- React `useState` for local component state
- Props drilling for shared state (no external state management library)
- Scenario switching via `activeScenarioId` in `App.tsx`

## Conventions

### Component Props
- Always define a typed interface: `interface ComponentNameProps { ... }`
- Use `React.FC<PropsType>` for functional components

### Event Handlers
- Prefix with `on` for callbacks: `onSelectSection`, `onOpenRoverModal`
- Prefix with `handle` for internal handlers: `handleSelectField`, `handleScrollToScenes`

### Constants
- SCREAMING_SNAKE_CASE for exported constants: `SCENARIOS`, `FIELDS`
- Defined at module level in data files

### File Imports
- Relative imports for local modules: `../../types`, `./components/layout/Navbar`
- Named imports preferred: `import { Shield, Bug } from 'lucide-react'`
