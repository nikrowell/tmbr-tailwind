# TMBR Tailwind

A [Tailwind CSS](https://tailwindcss.com/) plugin for fluid properties, breakpoint variants, and semantic z-index management.

## Installation

```bash
npm install @tmbr/tailwind
```

```css
@import 'tailwindcss';
@plugin '@tmbr/tailwind';
```

## Fluid Utilities

Generate fluid CSS values using `clamp()` for smooth scaling between viewport sizes - inspired by [fluid-tailwindcss](https://fluid-tailwindcss.vercel.app/). All values are written as px and converted to rem:

```html
<div class="f-p-[16,32]">
<!-- padding: clamp(1rem, 0.713rem + 1.23vw, 2rem) -->

<div class="f-text-[24,36]">
<!-- font-size: clamp(1.5rem, 1.284rem + 0.92vw, 2.25rem) -->

<div class="f-gap-[10,20]">
<!-- gap: clamp(0.625rem, 0.445rem + 0.77vw, 1.25rem) -->
```

### Viewport Overrides

Override the default min viewport width (**375**), the max viewport width (**1680**), or both by passing additional values:

```html
<!-- override both min and max-->
<div class="f-p-[16,32,400,800]">

<!-- override min (uses default max) -->
<div class="f-p-[16,32,400]">

<!-- override max (uses default min) - empty value without spaces -->
<div class="f-p-[16,32,,800]">
```

You can also globally override the defaults when registering the plugin:
```css
@plugin '@tmbr/tailwind' {
  vmin: 320;
  vmax: 1920;
};
```

### Negative values:

```html
<div class="f-mt-[-16,-32]">
<!-- margin-top: clamp(-1rem, ..., -2rem) -->
```

### Quick Reference

| Syntax                 | Output                                            |
|------------------------| --------------------------------------------------|
| `f-text-[16,20]`       | `clamp(1rem, ..., 1.25rem)` - px converted to rem |
| `f-p-[40,60,800,1200]` | custom viewports (800-1200px, converted to rem)   |
| `f-p-[20,30,,800]`     | default min, custom max                           |
| `f-p-[10,20,400]`      | custom min, default max                           |
| `f-mt-[-16,-32]`       | negative values                                   |

### Available Utilities

| Category   | Utilities                                                                                 |
|------------|-------------------------------------------------------------------------------------------|
| Margin     | `f-m`, `f-mx`, `f-my`, `f-mt`, `f-mr`, `f-mb`, `f-ml`                                     |
| Padding    | `f-p`, `f-px`, `f-py`, `f-pt`, `f-pr`, `f-pb`, `f-pl`                                     |
| Typography | `f-text`, `f-leading`, `f-tracking`                                                       |
| Sizing     | `f-w`, `f-h`, `f-size`, `f-min-w`, `f-max-w`, `f-min-h`, `f-max-h`                        |
| Gap        | `f-gap`, `f-gap-x`, `f-gap-y`                                                             |
| Position   | `f-inset`, `f-inset-x`, `f-inset-y`, `f-top`, `f-right`, `f-bottom`, `f-left`             |
| Border     | `f-rounded`, `f-rounded-t/r/b/l`, `f-rounded-tl/tr/br/bl`, `f-border`, `f-border-t/r/b/l` |
| Flex       | `f-basis`                                                                                 |

## Breakpoint Variants

Use `above-{name}` and `below-{name}` variants for responsive styles based on your theme's breakpoints. These read from `@theme --breakpoint-{name}` variables:

```css
@theme {
  --breakpoint-xs: 30rem;
  --breakpoint-nav: 1280px;
}
```

```html
<div class="above-xs:flex">
<!-- @media (width >= 30rem) { display: flex } -->

<div class="below-nav:hidden">
<!-- @media (width < 1280px) { display: none } -->
```

Arbitrary values (px onverted to rem) are also supported:

```html
<div class="above-[600]:text-lg">
<!-- @media (width >= 37.5rem) { font-size: ... } -->
```

## Z-Index Utilities

Semantic z-index utilities that read from `@theme --z-{name}` variables. Useful for managing stacking contexts with meaningful names.

```css
@theme {
  --z-header: 100;
  --z-modal: 1000;
  --z-tooltip: 1001;
}
```

```html
<div class="z-modal">
<!-- z-index: var(--z-modal) -->

<div class="z-above-modal">
<!-- z-index: calc(var(--z-modal) + 1) -->

<div class="z-below-modal">
<!-- z-index: calc(var(--z-modal) - 1) -->
```

| Utility           | Output                              |
|-------------------|-------------------------------------|
| `z-{name}`        | `z-index: var(--z-{name})`          |
| `z-above-{name}`  | `z-index: calc(var(--z-{name}) + 1)`|
| `z-below-{name}`  | `z-index: calc(var(--z-{name}) - 1)`|
