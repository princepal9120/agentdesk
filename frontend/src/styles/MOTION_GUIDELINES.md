# Motion & Animation Guidelines

## Philosophy

All animations in the Clinical Minimalism theme should feel **gentle, safe, and premium**. Movements should be smooth and purposeful, never sharp or chaotic. Think of the motion as a calm assistant guiding the user through the interface.

---

## 🎬 Framer Motion

Use Framer Motion for micro-interactions and component-level animations.

### Soft Fades

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
>
  Content
</motion.div>
```

### Slight Lifts (Card Hover)

```tsx
<motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
>
  <Card />
</motion.div>
```

### Staggered Entrances

```tsx
// Parent container
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }}
>
  // Child items
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ duration: 0.5 }}
  >
    Item
  </motion.div>
</motion.div>
```

### Gentle Scale (Buttons)

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
>
  Button Text
</motion.button>
```

### Accordion/Expand

```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 'auto', opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
>
  Expandable content
</motion.div>
```

---

## 🎯 GSAP

Use GSAP for page transitions, section reveals, and complex timeline animations.

### Page Entrance

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from('.page-element', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }, containerRef);
  return () => ctx.revert();
}, []);
```

### Section Reveal (ScrollTrigger)

```tsx
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);
  
  gsap.from('.section', {
    scrollTrigger: {
      trigger: '.section',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 40,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  });
}, []);
```

### Smooth Reveals

```tsx
gsap.from('.reveal-item', {
  y: 20,
  opacity: 0,
  duration: 0.5,
  stagger: 0.08,
  ease: 'power2.out',
  delay: 0.2
});
```

### Float Animation (Ambient)

```tsx
gsap.to('.float-element', {
  y: '+=10',
  duration: 3,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1
});
```

---

## ⏱️ Timing & Easing

### Duration Scale

| Speed | Duration | Usage |
|-------|----------|-------|
| Fast | 150ms | Micro-interactions, hover states |
| Normal | 300ms | Standard transitions |
| Slow | 500ms | Page transitions |
| Slower | 700ms | Complex reveals |

### Easing Curves

| Name | Cubic Bezier | Usage |
|------|--------------|-------|
| Smooth | `[0.25, 0.1, 0.25, 1]` | Default for most animations |
| Gentle | `[0.19, 1, 0.22, 1]` | Ease out for reveals |
| Spring | `[0.175, 0.885, 0.32, 1.275]` | Bouncy feedback (subtle) |

### GSAP Easings

- `power2.out` - Standard reveals
- `power3.out` - Section entrances
- `sine.inOut` - Floating/ambient

---

## 🚫 Anti-Patterns

### Avoid These

1. **Sharp movements** - No snapping or jarring transitions
2. **Excessive bounce** - Keep spring animations subtle
3. **Fast durations** - Nothing under 150ms for visible elements
4. **Multiple simultaneous animations** - Keep it simple
5. **Rotation/skew** - Generally avoid unless very subtle

### Bad Example ❌

```tsx
// TOO AGGRESSIVE
<motion.div
  whileHover={{ scale: 1.2, rotate: 5 }}
  transition={{ type: 'spring', stiffness: 500 }}
/>
```

### Good Example ✅

```tsx
// CALM AND PREMIUM
<motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
/>
```

---

## 📋 Component Animation Patterns

### Cards

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.06)' }}
  transition={{ duration: 0.3 }}
/>
```

### Buttons

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
/>
```

### Modals/Dialogs

```tsx
// Backdrop
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
/>

// Content
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 10 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 10 }}
  transition={{ duration: 0.3 }}
/>
```

### Lists/Tables

```tsx
// Stagger children
<motion.ul
  variants={{
    visible: { transition: { staggerChildren: 0.05 } }
  }}
>
  <motion.li
    variants={{
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0 }
    }}
  />
</motion.ul>
```

### Navigation

```tsx
// Active indicator
<motion.div
  layoutId="activeTab"
  className="absolute inset-0 bg-[#D7EAFB]/50 rounded-2xl"
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
/>
```

---

## 🎨 CSS Animations

For simple, repeating animations, use CSS:

```css
/* Gentle pulse */
@keyframes gentle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Soft bounce */
@keyframes soft-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Skeleton shimmer */
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## ✅ Checklist

Before shipping animations, verify:

- [ ] Duration is appropriate (not too fast/slow)
- [ ] Easing feels natural and smooth
- [ ] Animation enhances, doesn't distract
- [ ] Works well on slower devices
- [ ] Respects `prefers-reduced-motion`
- [ ] Consistent with other animations in the app
