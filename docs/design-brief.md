# Royal Enfield Premium Experience Design Brief

## Project Status

This brief is prepared before further implementation work.

One blocker remains: the exact reference video mentioned in the thread is not currently accessible from the provided local path, so a literal frame-by-frame audit is still pending the source file being reattached or copied into the workspace.

What we *can* confirm right now is based on:

- The current Next.js build in this repo
- The attached creative direction prompt
- The existing story structure already implemented in the app

## Phase 0: Understand the Project

### Core Objective

Build a premium, cinematic single-page motorcycle launch experience for Royal Enfield where scrolling feels like a film edit rather than a traditional brochure site. The site should feel immersive, mechanical, and emotionally charged, with the bike acting as the central character throughout the journey.

### Design Language

- Premium industrial minimalism
- Cinematic product-stage presentation
- Mechanical precision with luxury restraint
- High-contrast, low-clutter composition
- Editorial storytelling layered over technical product detail

The current implementation already leans into a strong performance-bike language with a pinned 3D stage, oversized condensed typography, mono technical microcopy, and callout-led storytelling. For Royal Enfield, that should be evolved from "track aggression" toward "timeless machine craft" without losing the premium motion language.

### Color Palette

Observed in the current implementation:

- Near-black: `#0A0A0A`
- Accent orange: `#FF6600`
- Warm off-white: `#F4F2EB`
- Mid neutrals: gunmetal, ash, steel

Target Royal Enfield-adjacent palette from the brief:

- Matte Black
- Gunmetal
- Steel
- Chrome
- Warm White
- Royal Enfield Gold
- Deep Burgundy
- Dark Forest
- Copper

Recommended palette direction:

- Base: `#0B0B0B`
- Surface: `#171614`
- Text: `#F3EFE6`
- Muted text: `#AAA398`
- Primary accent: Royal Enfield gold / copper instead of KTM orange
- Secondary accent: deep burgundy or forest for trims, environment, and configurator variants

### Typography

Observed:

- Large uppercase condensed display headlines
- Mono technical labels and navigation microcopy

Recommended system:

- Display: bold condensed uppercase for hero headlines and section titles
- Accent: elegant serif for short emotional phrases and brand statements
- Body: restrained sans or mono for specs, labels, and supporting copy

Typography behavior:

- Strong vertical rhythm
- Wide negative space
- Tight headline tracking
- Small-caps or mono utility copy for technical credibility

### Motion Style

The motion language should feel:

- Smooth, weighted, and continuous
- Cinematic rather than playful
- Mechanically precise
- Layered with foreground text and background 3D movement
- Free of snaps and hard cuts

Required motion behaviors:

- Pinned 3D stage behind content
- Camera interpolation with constant velocity feel
- Word-by-word heading reveals
- Section-based mood shifts through light, angle, and proximity
- Material and environment transitions that feel physical

### Scroll Interactions

The scroll model should operate as a "chapter driver":

- One master scroll timeline spanning the whole story
- Progress mapped into camera motion, bike rotation, exploded views, and lighting changes
- Overlay sections used as readable story beats
- Progress rail on the edge as a persistent orientation device
- Selective interactivity layered in, not overwhelming the main story

### Camera Movement

Expected camera grammar:

- Hero: emerge from darkness with subtle dolly-in
- Design section: orbit around silhouette-defining surfaces
- Engine section: push-in and partial exploded reveal
- Chassis section: 3/4 rear or side profile for structural read
- Wheels section: low-angle proximity and rotational energy
- Configurator: slower turntable behavior for decision-making
- Finale: wider hero composition, more breathing room, calmer confidence

Camera principles:

- No hard cuts
- No sudden angle flips
- Use lerp/damp on every transform
- Mobile range should be reduced, not redesigned

### Section Hierarchy

The current build already establishes a strong base structure:

1. Hero
2. Engine
3. Chassis
4. Wheels
5. Configurator
6. Specs + CTA

The fuller Royal Enfield experience should expand into:

1. Hero reveal
2. Design philosophy
3. Engine
4. Chassis and suspension
5. Ride experience / terrain mood
6. Customization studio
7. Technology
8. Gallery
9. Specifications
10. Booking / dealer CTA
11. Final showcase

### Storytelling Flow

Narrative arc:

- Mystery
- Reveal
- Mechanical intimacy
- Technical proof
- Personalization
- Ownership intent
- Emotional close

This is the right overall shape for a flagship product page. The story should move from atmosphere to engineering to desire to action.

### UI Patterns

Preferred patterns:

- Transparent or low-contrast fixed navigation
- Thin leader lines for technical callouts
- Configurator swatches with immediate feedback
- Edge-mounted progress indicator
- Utility microcopy
- Full-height sections with asymmetrical text placement
- Strong CTA blocks with magnetic hover behavior

Patterns to avoid:

- Card-heavy SaaS layouts
- Busy dashboards
- Generic gradient blobs
- Excessive glassmorphism
- Overwritten feature grids that compete with the bike

## Pending Frame-by-Frame Audit

The exact frame-by-frame analysis is blocked until the reference video is available locally.

When the file is restored, the audit should capture for each key beat:

- Timestamp
- Shot composition
- Camera motion
- Text behavior
- Lighting state
- Transition type
- UI overlay pattern
- Emotional intent

## Phase 1: Mood Board Before Reference Collection

Everything below should belong to one visual identity.

### Typography

- Condensed uppercase display type
- Refined serif accent for brand statements
- Minimal mono or narrow sans for specs and labels

### Colors

- Matte black base
- Warm ivory text
- Royal Enfield gold / copper highlights
- Steel and chrome neutrals
- Deep burgundy / forest accent options

### Layout

- Full-viewport chapters
- Text offset from the bike, never centered by default
- Wide horizontal breathing room on desktop
- Tight, vertical, cinematic stacking on mobile

### Animation Style

- Slow cinematic easing
- Weighted reveals
- Continuous camera drift
- Selective parallax
- Technical callout line draws

### Photography

- Studio-lit machine portraits
- Golden hour landscapes
- Detail macro shots
- Low-angle road presence

### Lighting

- Hard spotlight hero reveal
- Soft fog and atmospheric bloom
- Warm practical light for premium intimacy
- Cooler metal reads in engineering sections

### Materials

- Brushed metal
- Powder-coated black
- Leather / stitched seat details
- Polished chrome accents
- Subtle dust, heat, and surface texture

### UI Components

- Magnetic CTAs
- Progress rail
- Inline technical callouts
- Configurator swatches
- Spec sheet grid
- Minimal lightbox gallery

## Phase 1: Collect References

Reference collection should stay within one visual sentence:

`Timeless premium motorcycle storytelling with cinematic industrial motion.`

Collect:

- 5 to 8 strong visual references
- Matching display and serif typography references
- Lighting references for darkness-to-reveal transitions
- Motion references for scroll pacing, not just styling
- Layout references for chapter-based storytelling

Priority platforms:

- Pinterest for mood and visual family
- MotionSites for transitions and scroll behavior
- Behance for complete storytelling systems
- Dribbble for detail patterns only

## Phase 2: Prepare the Development Environment

### Development

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Prettier

### Animation

- GSAP
- ScrollTrigger
- Lenis
- Framer Motion

### 3D

- Three.js
- React Three Fiber
- Drei

### Performance

- Lighthouse
- React Profiler

## Phase 3: Generate Assets

Required assets:

- Hero images
- Product renders
- Background videos
- Ambient loops
- Textures
- Icons
- Logos
- Illustrations

Asset rules:

- Optimize every image and video
- Use compressed textures
- Prefer AVIF/WebP where possible
- Draco-compress the real GLB
- Prepare reduced-motion poster fallbacks

## Phase 4: Information Architecture

### Sitemap

- Home
- Optional brochure download endpoint
- Optional booking or dealer flow

### Navigation

- Fixed minimal nav
- Section jump points
- Persistent CTA

### User Flow

1. Arrive on cinematic hero
2. Understand the machine emotionally
3. Validate engineering and performance
4. Personalize
5. Review specs
6. Convert to test ride / booking

### Content Hierarchy

- Emotion first
- Form second
- Function third
- Decision tools fourth
- CTA last but always accessible

### Section Flow

- Hero
- Design
- Engine
- Chassis
- Ride Experience
- Customization
- Technology
- Gallery
- Specs
- Booking
- Finale

### Scroll Story

The scroll should behave like a film reel with one mechanical protagonist. Every chapter needs a visual state change, not just new text.

## Phase 5: Build Wireframes

Round 1 should focus only on:

- Layout
- Grid
- Spacing
- Typography
- Sections

No animation decisions should be locked before the wireframe rhythm feels right.

## Phase 6: Develop the Website

Development order:

1. Layout
2. Components
3. Responsive system
4. Animations
5. 3D scene
6. Micro interactions

## Phase 7: Premium Components

Use inspiration from:

- 21st.dev
- Magic UI
- Aceternity UI
- Origin UI
- Shadcn UI
- React Bits

Rule:

Do not transplant components directly. Adapt their interaction ideas to this site's material, spacing, typography, and motion language.

## Phase 8: Motion Polish

Polish checklist:

- Scroll storytelling
- Cursor interactions
- Image transitions
- Button animations
- Loading screens
- Page transitions
- Text reveals
- Parallax
- Depth
- Camera motion

## Phase 9: Performance Optimization

Targets:

- Lighthouse above 95
- LCP under 2.5s
- CLS under 0.1
- INP under 200ms

Methods:

- Lazy loading
- Code splitting
- Image optimization
- Dynamic imports
- Asset compression
- GLB compression

## Phase 10: Accessibility

Required:

- Semantic HTML
- Keyboard navigation
- ARIA labels
- Reduced motion mode
- Focus indicators
- Strong color contrast

## Phase 11: Testing

Test matrix:

- Desktop
- Tablet
- Mobile
- Chrome
- Firefox
- Safari
- Edge

Verify:

- Scroll animation continuity
- Responsive composition
- Loading behavior
- Forms
- 3D rendering

## Phase 12: Deployment

Prepare:

- Vercel config
- Environment variables
- Metadata
- Open Graph
- Sitemap
- `robots.txt`

## Phase 13: Final Review

Review the final site through five lenses:

### Recruiter

- Does it feel memorable in under 10 seconds?
- Does it look intentional rather than template-based?

### UI/UX Designer

- Is the hierarchy clean?
- Is every interaction coherent with the visual system?

### Frontend Architect

- Is the app modular, maintainable, and scalable?
- Are animation responsibilities separated cleanly?

### Performance Engineer

- Is the 3D experience worth its cost?
- Are mobile fallbacks strong enough?

### Product Manager

- Does the story drive users toward test ride and inquiry intent?
- Is the business CTA visible without killing the cinematic mood?

## Immediate Refinements for This Repo

Based on the current codebase, the next improvements should be:

1. Replace the orange performance-bike identity with a Royal Enfield luxury-industrial palette
2. Replace the placeholder procedural bike with a real optimized GLB
3. Expand the six-beat structure into a fuller storytelling sequence
4. Introduce richer environmental transitions, not just camera movement
5. Strengthen accessibility, motion fallbacks, and browser testing coverage
6. Clean up leftover Vite-era files and align the project fully to Next.js structure

## Open Inputs Needed

- The exact reference video file for the frame-by-frame audit
- The final motorcycle model or product family to feature
- Approved brand assets, logos, and copy direction
- Whether the experience should stay single-page or support dealer / booking subflows
