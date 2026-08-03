---
name: Radical Poster
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#4b4731'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#7c775f'
  outline-variant: '#cdc7aa'
  surface-tint: '#6a5f00'
  primary: '#6a5f00'
  on-primary: '#ffffff'
  primary-container: '#ffe600'
  on-primary-container: '#726600'
  inverse-primary: '#dec800'
  secondary: '#006d36'
  on-secondary: '#ffffff'
  secondary-container: '#41fe8e'
  on-secondary-container: '#007238'
  tertiary: '#a600b1'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffd9f9'
  on-tertiary-container: '#af14ba'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#fde400'
  primary-fixed-dim: '#dec800'
  on-primary-fixed: '#201c00'
  on-primary-fixed-variant: '#504700'
  secondary-fixed: '#61ff97'
  secondary-fixed-dim: '#01e477'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005227'
  tertiary-fixed: '#ffd6f9'
  tertiary-fixed-dim: '#ffa9fb'
  on-tertiary-fixed: '#37003b'
  on-tertiary-fixed-variant: '#7e0088'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Anybody
    fontSize: 80px
    fontWeight: '900'
    lineHeight: 80px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Anybody
    fontSize: 14px
    fontWeight: '900'
    lineHeight: 16px
  label-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 14px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  border-width: 3px
  shadow-offset: 6px
---

## Brand & Style

The design system adopts a **Neo-Brutalist "Poster-Style"** aesthetic. It is high-energy, DIY-inspired, and unapologetically bold. The brand personality is rebellious and expressive, targeting a young, creative audience that values individuality over corporate polish.

The visual narrative is built on extreme contrast, heavy borders, and graphic patterns. It blends the raw energy of street culture with the structured chaos of a fanzine. Key characteristics include:
- **Maximalist Typography:** Text isn't just content; it's a primary graphic element.
- **Graphic Interventions:** Use of checkered patterns, hand-drawn doodles, and thick strokes.
- **Physicality:** Heavy drop shadows and high-contrast blocks create a "cut-and-paste" physical feel.

## Colors

The palette is anchored in a high-contrast trifecta of vibrant neon-adjacent hues against a clinical white and deep ink-black foundation.

- **Primary (Electric Yellow):** Used for primary calls to action, highlights, and the most important information blocks.
- **Secondary (Acid Green):** Used for growth-oriented actions, success states, and secondary visual categories.
- **Tertiary (Vibrant Pink):** Used for accentuation, emphasis within text, and disruptive visual elements.
- **Neutral:** A pure black (#000000) is used for all borders, shadows, and primary text to maintain maximum legibility and "ink-on-paper" feel.

## Typography

The typography strategy relies on the tension between the aggressive, variable nature of **Anybody** and the functional reliability of **Work Sans**.

- **Headlines:** Use **Anybody** in extra-bold or black weights. For "Poster-style" impact, utilize all-caps and tight line heights. Headlines should often overlap or sit very close to other graphic elements.
- **Body:** Use **Work Sans** for legibility. Maintain generous line height to balance the density of the headline styles.
- **Special Treatment:** Keywords within body text can be highlighted by switching to **Anybody Bold** with a background color block or a thick underline.

## Layout & Spacing

This design system uses a **Rigid Grid** model inspired by print layouts. 

- **Grid:** A 12-column system for desktop and a 4-column system for mobile. Gutters are kept wide (24px) to separate high-contrast blocks effectively.
- **The "Sticker" Rule:** Elements should feel like they are layered on top of the background. Use consistent spacing units of 8px.
- **Checkered Dividers:** Use 24px-48px height checkered patterns (black and white) as section breaks or structural dividers to reinforce the DIY aesthetic.
- **Margins:** Large outer margins are used to frame the "poster" content, creating a clean white perimeter around the high-energy center.

## Elevation & Depth

Depth is not communicated through realism or light physics, but through **Hard Layering**.

- **Hard Shadows:** All cards and buttons must feature a solid black drop shadow with 100% opacity, offset by 4px to 8px. 
- **Bold Outlines:** Every container, input field, and button must have a 3px to 4px solid black border.
- **Tonal Stacking:** Use the primary colors (Yellow, Green, Pink) as the "surface" for interactive elements, which sit on top of the white background with their black shadows.
- **No Blurs:** Avoid backdrop blurs or soft shadows entirely. Depth is binary: an element is either on top of another or it isn't.

## Shapes

The primary shape language is **Sharp and Geometric**, occasionally punctuated by organic "doodles."

- **Containers:** Most cards and buttons use a 0px radius (sharp corners) to maintain a brutalist, industrial look.
- **Interaction Exceptions:** Use the `rounded-lg` (16px) or `rounded-xl` (24px) only for decorative "sticker" elements or specific card types to create visual variety, as seen in the reference image.
- **Doodles:** Incorporate hand-drawn vector elements (like the yellow bird or rough arrows) as non-interactive decorative overlays to break the rigidity of the grid.

## Components

### Buttons
- **Style:** Rectangular, sharp corners, 3px black border.
- **States:** Default state has a 6px black hard shadow. Hover state "pushes" the button down (shadow reduces to 2px, button translates 4px diagonally).
- **Color:** Always use Primary Yellow or Tertiary Pink for primary actions.

### Cards
- **Style:** White or colored background with a 3px black border.
- **Header:** Often contains a bold label in a black block with white text.
- **Shadow:** Solid black offset shadow.

### Input Fields
- **Style:** White background, 3px black border, sharp corners.
- **Focus:** Border color remains black, but the background shifts to a very light tint of the Primary Yellow.

### Chips & Tags
- **Style:** Small rectangular blocks with 2px borders. Use **Anybody** at small sizes (label-bold).
- **Pattern:** Occasionally use a checkered border or background for "Featured" tags.

### Lists
- **Style:** Items are separated by thick 2px horizontal lines. Bullet points are replaced with small black squares or hand-drawn "X" marks.

### NoteHive Logo Integration
- The NoteHive logo should be treated as a "Stamp." Place it in a high-contrast corner, perhaps rotated by 5 degrees, or contained within a thick-bordered square to fit the poster aesthetic.