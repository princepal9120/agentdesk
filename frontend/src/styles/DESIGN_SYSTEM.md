# Clinical Minimalism Design System

## Overview

This design system implements an **Apple-inspired medical aesthetic** specifically designed for HIPAA-focused healthcare environments. The goal is to create interfaces that feel **calm, trustworthy, and premium**.

---

## 🎨 Color System

### Primary Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| White | `#FFFFFF` | Backgrounds, cards |
| Soft Blue | `#D7EAFB` | Highlights, secondary elements |
| Teal | `#2BB59B` | Primary actions, active states |
| Teal Dark | `#249A84` | Hover states |
| Teal Light | `#ECFDF5` | Success backgrounds |

### Neutral Greys

| Scale | Hex Code | Usage |
|-------|----------|-------|
| Grey 50 | `#F8FAFC` | Page backgrounds |
| Grey 100 | `#F1F5F9` | Card hover states |
| Grey 200 | `#E5E7EB` | Borders, dividers |
| Grey 300 | `#C7C9CC` | Input borders |
| Grey 400 | `#9CA3AF` | Placeholder text |
| Grey 500 | `#6B7280` | Secondary text |
| Grey 600 | `#4B5563` | Body text |
| Grey 700 | `#374151` | Headings |
| Grey 900 | `#111827` | Dark headings |

### Semantic Colors

| Type | Light | Main | Dark |
|------|-------|------|------|
| Success | `#ECFDF5` | `#059669` | `#047857` |
| Warning | `#FFFBEB` | `#D97706` | `#B45309` |
| Error | `#FEF2F2` | `#DC2626` | `#B91C1C` |
| Info | `#EFF6FF` | `#3B82F6` | `#2563EB` |

### Chart Colors (Medical Pastel Palette)

| Color | Hex Code |
|-------|----------|
| Teal | `#2BB59B` |
| Soft Blue | `#93C5FD` |
| Lavender | `#C4B5FD` |
| Peach | `#FED7AA` |
| Mint | `#A7F3D0` |
| Rose | `#FECACA` |

---

## 📐 Border Radius

Use generously rounded corners (20–32px) for a soft, approachable feel.

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Small elements |
| `md` | 8px | Default inputs |
| `lg` | 12px | Buttons |
| `xl` | 16px | Cards |
| `2xl` | 20px | Large cards |
| `3xl` | 24px | Bento tiles |
| `4xl` | 32px | Hero elements |
| `full` | 9999px | Pills, badges |

---

## 🌫️ Shadows

Use soft, diffuse shadows (1–4px blur) for a gentle, medical-grade appearance.

| Token | CSS Value |
|-------|-----------|
| `xs` | `0 1px 2px rgba(0, 0, 0, 0.03)` |
| `sm` | `0 2px 4px rgba(0, 0, 0, 0.04)` |
| `md` | `0 4px 6px rgba(0, 0, 0, 0.04)` |
| `lg` | `0 8px 16px rgba(0, 0, 0, 0.04)` |
| `teal` | `0 4px 14px rgba(43, 181, 155, 0.15)` |

---

## ✏️ Typography

### Font Family

Use SF Pro-style clean sans-serif fonts:

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif;
```

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Normal | 400 | Body text |
| Medium | 500 | Subheadings, labels |
| Semibold | 600 | Headings |
| Bold | 700 | Hero text (sparingly) |

### Hierarchy

- **Headings**: Semibold, grey-900
- **Body**: Regular, grey-600
- **Muted**: Regular, grey-500
- **Labels**: Medium, grey-700

---

## 🧩 Component Guidelines

### Buttons

- **Shape**: Pill-shaped (`rounded-full`) or softly rounded (`rounded-xl`)
- **Primary**: Teal background, white text, teal shadow
- **Secondary**: Soft blue background, dark text
- **Ghost**: Transparent, subtle hover

```tsx
<Button className="rounded-full bg-[#2BB59B] shadow-teal">
  Primary Action
</Button>
```

### Cards

- **Corners**: 24px (`rounded-3xl`)
- **Border**: 1px `#E5E7EB`
- **Shadow**: Soft card shadow
- **Padding**: 24px (p-6)

```tsx
<Card className="rounded-3xl border border-grey-200 shadow-card p-6">
  Card content
</Card>
```

### Inputs

- **Corners**: 16px (`rounded-xl`)
- **Border**: 1px `#E5E7EB`
- **Focus**: Teal border with soft ring
- **Padding**: 12px vertical, 16px horizontal

```tsx
<Input className="rounded-xl h-12 focus:border-[#2BB59B]" />
```

### Badges

- **Shape**: Pill (`rounded-full`)
- **Padding**: 4px vertical, 12px horizontal
- **Backgrounds**: Pastel semantic colors

---

## 📏 Spacing

Use generous white space for breathing room:

| Scale | Value |
|-------|-------|
| 4 | 16px |
| 6 | 24px |
| 8 | 32px |
| 12 | 48px |
| 16 | 64px |
| 20 | 80px |
| 24 | 96px |

---

## 🎯 Usage by Page Type

### Dashboard
- Bento grid layout
- Rounded corner cards (24-32px)
- Soft blue/teal accents
- High clarity metrics

### Auth Pages
- White background
- Centered card layout
- Soft shadows
- Trust badges

### Forms/Settings
- Segmented cards with thin dividers
- Toggle switches in teal
- Medical-grade clean inputs

### Analytics
- Pastel chart colors
- Rounded chart containers
- Strong alignment and spacing

---

## ✅ Do's and Don'ts

### Do's
- ✅ Use generous white space
- ✅ Keep corners soft (20-32px)
- ✅ Use teal for primary actions
- ✅ Apply subtle hover animations
- ✅ Maintain visual hierarchy

### Don'ts
- ❌ Use harsh/aggressive colors
- ❌ Create sharp corners
- ❌ Over-bold typography
- ❌ Add too many decorative elements
- ❌ Create chaotic layouts

---

## 🔗 Related Files

- `src/styles/theme.ts` - Design tokens
- `src/index.css` - Global styles
- `tailwind.config.js` - Tailwind theme
- `MOTION_GUIDELINES.md` - Animation rules
