# TMBR Tailwind

A [Tailwind CSS](https://tailwindcss.com/) plugin that generates utility classes for fluid properties using `clamp()`. Heavily inspired by [fluid-tailwindcss](https://fluid-tailwindcss.vercel.app/).

## Installation

```bash
npm install @tmbr/tailwind
```

```css
@import 'tailwindcss';
@plugin '@tmbr/tailwind';
```

Override the default **375** and **1680** viewport values:

```css
@import 'tailwindcss';
@plugin '@tmbr/tailwind' {
  vmin: 320;
  vmax: 1920;
};
```

## Usage

All values are written as px and converted to rem:

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

<!-- override max (uses default min) - note empty value without spaces -->
<div class="f-p-[16,32,,800]">
```

### Negative values:

```html
<div class="f-mt-[-16,-32]">
<!-- margin-top: clamp(-1rem, ..., -2rem) -->
```

## Quick Reference

| Syntax                 | Output                                          |
|------------------------| ------------------------------------------------|
| `f-p-[16,32]`          | `clamp(1rem, ..., 2rem)` - px converted to rem  |
| `f-mt-[-16,-32]`       | negative values                                 |
| `f-p-[40,60,800,1200]` | custom viewports (800-1200px, converted to rem) |
| `f-p-[20,30,,800]`     | default min, custom max                         |
| `f-p-[10,20,400]`      | custom min, default max                         |

## Available Utilities

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
