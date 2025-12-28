
# Create New Product Introduction & Enhance Visuals

## 1. New Intro Phase
We will introduce a new initial state `intro` to the application flow, creating a dedicated landing experience before the calibration sequence.

### Store Update
- Modify `store/luminaStore.ts`:
  - Add `intro` to `Phase` type.
  - Set initial state of `phase` to `intro`.

## 2. Visual Enhancement: Deep Space Background
We will upgrade the `StarField` to create a more immersive, depth-filled environment.

### StarField Upgrade
- Modify `components/canvas/StarField.tsx`:
  - Add a second layer of `Stars` with different parameters (speed, count, depth) to create parallax depth.
  - Integrate `<Sparkles />` from `@react-three/drei` for subtle, magical glittering effects.
  - Adjust rotation speeds to be slower and more majestic.

## 3. New Component: IntroView
Create a cinematic landing view that serves as the product introduction.

### Implementation
- Create `components/council/IntroView.tsx`:
  - **Typography**: Use a massive, centered title "LUMINA" with the `Cinzel` font.
  - **Slogan**: "Archetypal Life Simulator" in a tracking-widest, uppercase style.
  - **Interaction**: A "Begin Journey" button that transitions the state to `calibration`.
  - **Animation**: Implement slow fade-in entrance animations using Framer Motion.

## 4. Visual Polish: Advanced Effects
Add CSS effects to `globals.css` to support the new visual direction.

### Global Styles
- Add `.text-glow-strong` class for the main title (multi-layered text-shadow).
- Add `.text-tracking-widest` utilities if not already present (using Tailwind classes).

## 5. Integration
- Update `app/page.tsx` to render `IntroView` when phase is `intro`.
