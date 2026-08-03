---
name: Midnight Radical
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#ffabf3'
  on-secondary: '#5b005b'
  secondary-container: '#fe00fe'
  on-secondary-container: '#500050'
  tertiary: '#ffffff'
  on-tertiary: '#323200'
  tertiary-container: '#eaea00'
  on-tertiary-container: '#686800'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#ffd7f5'
  secondary-fixed-dim: '#ffabf3'
  on-secondary-fixed: '#380038'
  on-secondary-fixed-variant: '#810081'
  tertiary-fixed: '#eaea00'
  tertiary-fixed-dim: '#cdcd00'
  on-tertiary-fixed: '#1d1d00'
  on-tertiary-fixed-variant: '#494900'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Anybody
    fontSize: 80px
    fontWeight: '900'
    lineHeight: '1.0'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anybody
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
spacing:
  grid-margin: 2rem
  grid-gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2.5rem
  border-thick: 4px
---

## Brand & Style

The design system embodies a "Midnight Radical" aesthetic—a high-octane fusion of underground zine culture and cyberpunk futurism. It is designed for a target audience that values authenticity, raw energy, and counter-culture expression, such as students, creators, and night-owls.

The visual style is a deliberate evolution of **Brutalism**, characterized by heavy strokes, high-contrast neon accents, and a raw, unpolished edge. By placing these aggressive elements against a pitch-black canvas, the UI evokes a sense of late-night urban energy. The atmosphere is loud, rebellious, and unapologetically digital, utilizing hand-drawn doodles and distorted patterns to break the rigidity of standard web layouts.

## Colors

The palette is built on a foundation of absolute darkness to allow neon accents to "pop" with maximum luminance.

- **Primary (Electric Green):** Used for primary actions, success states, and key navigational highlights.
- **Secondary (Vivid Pink):** Used for interactive elements, secondary call-to-outs, and decorative accents.
- **Tertiary (Neon Yellow):** Reserved for warnings, emphasis, or alternating decorative patterns.
- **Neutral/Background:** Pure black (#000000) for the main stage, with a dark charcoal (#121212) used for surface containers to provide subtle depth without losing the "midnight" feel.
- **Glow Effect:** All neon colors should utilize a subtle outer glow (drop-shadow) of the same hue to simulate a light-emissive quality against the dark background.

## Typography

Typography is used as a structural element, often oversized and aggressive. **Anybody** provides the raw, variable-width muscle for headlines, while **Inter** ensures legibility for dense information. **Space Grotesk** is used for technical labels and "meta" information to reinforce the cyberpunk aesthetic.

Headlines should frequently use `italic` or `uppercase` styles to create a sense of movement. For maximum impact, headline text can occasionally be styled with a "stroke-only" (outline) effect or colored in Primary Electric Green.

## Layout & Spacing

This design system uses a **Fluid Grid** model with a rigid 12-column structure on desktop and a 4-column structure on mobile. However, content should frequently "break" the grid using slight rotations (1-3 degrees) or overlapping elements to mimic the layered look of a physical zine.

Spacing is generous but intentional. Use thick borders (4px) as structural dividers rather than subtle hairlines. Breakpoints occur at 768px (Tablet) and 1280px (Desktop). On mobile, margins are reduced to 1rem to maximize screen real estate for bold imagery.

## Elevation & Depth

Hierarchy is established through **Color Contrast and Thick Outlines** rather than traditional shadows.
- **Level 0 (Background):** Deep black (#000000).
- **Level 1 (Surfaces):** Dark charcoal (#121212) with 4px solid neon borders.
- **Level 2 (Active/Hover):** Surfaces that "lift" by shifting their border color or adding a vibrant 8px offset "drop-block" shadow (a solid rectangle of color shifted 8px down and right).

Texture plays a key role in depth: use inverted checkerboard patterns (dark grey on black) for background sections and hand-drawn doodles (white or neon) to layer "on top" of images and containers.

## Shapes

The shape language is strictly **Sharp (0)**. Everything is rectangular and hard-edged to maintain the brutalist, DIY aesthetic. Avoid all border-radii unless it is a circular element (like a profile avatar or a specific decorative sticker). 

Images and containers should frequently feature "clipped corners" or intentional misalignments to reinforce the cut-and-paste zine theme.

## Components

### Buttons
Primary buttons are solid blocks of Electric Green with black text, using the `label-bold` type style. Secondary buttons are black with a 4px Neon Pink border. On hover, buttons should trigger a "fill" animation or an 8px solid block shadow.

### Cards & Containers
Cards must have a 4px solid border in a neon accent color. Titles inside cards should be `headline-lg` and can overlap the top border of the card for a "layered" effect.

### Input Fields
Inputs are black with a 2px grey border that turns 4px Electric Green when focused. Use `Space Grotesk` for placeholder text to maintain the technical vibe.

### Chips & Tags
Small rectangular blocks with solid fills of Secondary or Tertiary colors. Use black text and sharp 0px corners.

### Decorative Elements
Include "Stickers" (circular or irregular shapes with hand-drawn doodles) and "Tapes" (rectangular overlays that look like masking tape holding an image in place). Checkerboard patterns should be used as background fills for high-energy sections.