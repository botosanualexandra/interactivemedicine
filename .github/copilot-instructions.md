# Copilot Instructions for botosanumedicinajava

## Project Overview
- This is a React application bootstrapped with Vite, using modern React (JSX, hooks) and modular component structure.
- The app visualizes medical/biological models (e.g., blood, lymph, heart, arm) using 3D assets (GLTF) and animation logic.
- Main UI logic and 3D model rendering are in `src/components/` and `src/slides/`.

## Key Architectural Patterns
- **Component Structure:**
  - Major 3D models are in `src/components/` (e.g., `m_sange.jsx`, `m_inima.jsx`, `m_arm.jsx`).
  - Each model component loads a `.glb` file from `public/models/` and uses `useGLTF` and `useAnimations` hooks.
  - Slides are organized in `src/slides/slideN/SlideN.jsx` for modular presentation logic.
- **Props and Animation:**
  - Model components accept props for animation speed and visibility toggles (e.g., `showVeins`, `showLimfa`).
  - Animation speed and play state are controlled via React state and effects.
- **Styling:**
  - CSS modules per component/slide (e.g., `Slide1.css`, `Fluide.css`, `Navbar.css`).

## Developer Workflows
- **Development:**
  - Start dev server: `npm run dev`
  - Build for production: `npm run build`
  - Preview build: `npm run preview`
- **Linting:**
  - Run ESLint: `npm run lint` (uses `eslint.config.js`)
- **No explicit test setup** (as of Jan 2026).

## Project-Specific Conventions
- **3D Model Loading:**
  - All 3D assets are in `public/models/` and referenced by relative path in components.
  - Use `useGLTF` and `useAnimations` for model/animation logic.
- **Component Naming:**
  - Model components prefixed with `m_` (e.g., `m_sange.jsx` for blood, `m_inima.jsx` for heart).
  - Slides in `slides/slideN/SlideN.jsx` format.
- **Props Defaults:**
  - Animation-related props (e.g., `animationSpeed`, `showVeins`, `showLimfa`) have defaults in function signature.

## Integration Points
- **External:**
  - Uses Vite for build/dev, React for UI, and likely `@react-three/fiber`/`@react-three/drei` for 3D (check `package.json` for details).
- **Internal:**
  - Navigation via `Navbar.jsx`.
  - Tabs in `src/tabs/` for specialized content (e.g., `Fluide`).

## Examples
- To add a new 3D model: create `m_newmodel.jsx` in `components/`, place `.glb` in `public/models/`, follow `useGLTF`/`useAnimations` pattern.
- To add a new slide: create `slides/slideN/SlideN.jsx` and corresponding CSS.

## References
- See `src/components/` for model patterns.
- See `src/slides/` for slide structure.
- See `vite.config.js` and `eslint.config.js` for build/lint config.

---
_If you are an AI agent, follow these conventions and reference the above files for implementation details. Ask for clarification if a pattern is unclear or missing._
