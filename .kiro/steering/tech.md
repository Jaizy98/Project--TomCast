# Technology Stack

## Core Technologies

- **Framework**: React 19.0.0 with TypeScript 5.7.3
- **Build Tool**: Vite 6.1.0
- **Language**: TypeScript (strict mode enabled)
- **Styling**: CSS-in-JS (inline styles) + CSS modules

## Key Dependencies

- **UI/Animation**: Framer Motion 12.42.0 for cinematic transitions and interactions
- **Icons**: Lucide React 1.16.0 for consistent icon system
- **Effects**: canvas-confetti 1.9.4 for celebration effects
- **Type Safety**: Full TypeScript with strict compiler options

## TypeScript Configuration

- Target: ES2020
- Module: ESNext with bundler resolution
- JSX: react-jsx (automatic runtime)
- Strict mode enabled with noFallthroughCasesInSwitch
- noUnusedLocals and noUnusedParameters disabled for development flexibility

## Common Commands

```bash
# Development server with hot module replacement
npm run dev

# Production build (TypeScript compilation + Vite bundling)
npm run build

# Preview production build locally
npm run preview
```

## Build Process

1. **TypeScript Compilation**: `tsc` compiles all TypeScript files with strict type checking
2. **Vite Bundling**: Bundles React components, optimizes assets, and generates production artifacts
3. **Output**: Compiled files placed in `dist/` directory

## Development Notes

- Vite dev server runs on default port (typically 5173)
- Fast refresh enabled for instant component updates
- No test framework currently configured
- No linting configuration present
