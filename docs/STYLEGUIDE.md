# NutriNest Style Guide & Design System

## 1. Color System

All colors are declared as CSS Custom Properties in `assets/css/variables.css`.

### Core Palette
- **Dark Green**: `#2E4213` (`var(--dark-green)`) — Headings, brand authority, footers, dark section bands
- **Leaf Green**: `#8BC53D` (`var(--leaf-green)`) — Primary CTAs, decorative accents, swoosh rules
- **Golden Yellow**: `#A9D967` (`var(--golden-yellow)`) — Dark-ground eyebrows, badges, accent highlights
- **Warm Ivory**: `#F5FAEC` (`var(--warm-ivory)`) — Section background tint (`.band-ivory`)
- **White**: `#FFFFFF` (`var(--white)`) — Page background, card backgrounds

### Text & Contrast Tokens
- **Ink (Primary Text)**: `#1E2A14` (`var(--ink)`) — Main body copy
- **Ink Soft**: `#4C5A41` (`var(--ink-soft)`) — Lead text, secondary copy
- **Ink Muted**: `#5B6950` (`var(--ink-muted)`) — Subtitles, dates, meta notes
- **Leaf Ink**: `#55771A` (`var(--leaf-ink)`) — High-contrast green used for text on light backgrounds to meet WCAG AA 4.5:1 standards
- **Line**: `#E4EBD9` (`var(--line)`) — Card borders and dividers

---

## 2. Typography

Font Family: `Poppins`, "Segoe UI", sans-serif.

| Level | Size (Desktop / Mobile) | Weight | CSS Class |
|---|---|---|---|
| H1 | `clamp(2.5rem, 6.4vw, 4.6rem)` | 800 | `h1` |
| H2 | `clamp(1.9rem, 4vw, 2.9rem)` | 800 | `h2` |
| H3 | `1.3rem` | 700 / 600 | `h3` |
| H4 | `1.05rem` | 700 | `h4` |
| Lead | `1.15rem` | 300 | `.lead` |
| Eyebrow | `0.74rem` | 700 (Uppercase, 0.22em tracking) | `.eyebrow` |
| Body | `17px` (1.65 line height) | 300 | `p` |

---

## 3. Spacing Scale (8px Grid)

```css
--s1:  8px;
--s2: 16px;
--s3: 24px;
--s4: 32px;
--s5: 40px;
--s6: 48px;
--s7: 64px;
--s8: 80px;
--s9: 96px;
```

---

## 4. Radii & Shadows

- Small Radius (`var(--radius-sm)`): `14px` (Inputs, inner callouts, chips)
- Standard Card Radius (`var(--radius)`): `24px` (Cards, accordions, containers)
- Large Radius (`var(--radius-lg)`): `30px` (Hero background card, pricing cards)
- Pill Radius (`var(--radius-pill)`): `999px` (Buttons, tags, filter chips)

- Elevation Shadow (`var(--shadow-sm)`): `0 2px 10px rgba(46, 66, 19, .06)`
- Card Hover Lift (`var(--shadow-lift)`): `0 18px 40px rgba(46, 66, 19, .16)`
