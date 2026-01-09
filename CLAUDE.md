# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm test           # Run tests with vitest in watch mode
npm run test:run   # Run tests once (not in package.json, use: npx vitest run)
```

No build step required - ships ES modules directly.

## Architecture Overview

A single-file TailwindCSS v4 plugin that generates fluid responsive CSS using `clamp()`. Values smoothly scale between min/max based on viewport width using linear interpolation.

### File Structure

- **`tailwind.js`** - The entire plugin in one file. Exports the plugin as default, plus helper functions (`parse`, `rem`, `round`, `calculate`) and `utilities` map for testing.
- **`tailwind.test.js`** - Unit tests for the exported helpers.

### Key Components in tailwind.js

1. **`utilities` object** - Maps utility names to CSS properties. Some utilities map to arrays for multi-property rules (e.g., `f-mx` → `['margin-left', 'margin-right']`).

2. **`calculate(value, options)`** - Core clamp generation. Takes a comma-separated value string (`"min,max"` or `"min,max,vmin,vmax"`) and returns a `clamp()` CSS value.

3. **`parse(value)`** - Extracts numeric value and unit from CSS length strings. Unitless values default to `px`.

4. **Plugin registration** - Uses `plugin.withOptions()` to accept configuration, then registers all utilities via `matchUtilities()`.

### Value Syntax

The plugin accepts comma-separated values, not slash-separated (despite README examples using slash notation in class names). TailwindCSS v4 parses `f-p-16/32` and passes `"16,32"` to the plugin.

- `16,32` → bare numbers treated as px, converted to rem in output
- `16,32,400,800` → with custom viewport range
- `16,32,400` → custom min viewport only
- `16,32,,800` → custom max viewport only

### Plugin Options

```javascript
{
  base: 16,      // Root font size for px→rem conversion
  vmin: 375,     // Default min viewport width (px)
  vmax: 1680,    // Default max viewport width (px)
}
```
