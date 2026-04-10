import plugin from 'tailwindcss/plugin';

const utilities = {
  'm'          : 'margin',
  'mx'         : ['margin-left', 'margin-right'],
  'my'         : ['margin-top', 'margin-bottom'],
  'mt'         : 'margin-top',
  'mr'         : 'margin-right',
  'mb'         : 'margin-bottom',
  'ml'         : 'margin-left',
  'p'          : 'padding',
  'px'         : ['padding-left', 'padding-right'],
  'py'         : ['padding-top', 'padding-bottom'],
  'pt'         : 'padding-top',
  'pr'         : 'padding-right',
  'pb'         : 'padding-bottom',
  'pl'         : 'padding-left',
  'text'       : 'font-size',
  'leading'    : 'line-height',
  'tracking'   : 'letter-spacing',
  'w'          : 'width',
  'h'          : 'height',
  'size'       : ['width', 'height'],
  'min-w'      : 'min-width',
  'max-w'      : 'max-width',
  'min-h'      : 'min-height',
  'max-h'      : 'max-height',
  'gap'        : 'gap',
  'gap-x'      : 'column-gap',
  'gap-y'      : 'row-gap',
  'inset'      : 'inset',
  'inset-x'    : ['left', 'right'],
  'inset-y'    : ['top', 'bottom'],
  'top'        : 'top',
  'right'      : 'right',
  'bottom'     : 'bottom',
  'left'       : 'left',
  'border'     : 'border-width',
  'border-t'   : 'border-top-width',
  'border-r'   : 'border-right-width',
  'border-b'   : 'border-bottom-width',
  'border-l'   : 'border-left-width',
  'rounded'    : 'border-radius',
  'rounded-t'  : ['border-top-left-radius', 'border-top-right-radius'],
  'rounded-r'  : ['border-top-right-radius', 'border-bottom-right-radius'],
  'rounded-b'  : ['border-bottom-left-radius', 'border-bottom-right-radius'],
  'rounded-l'  : ['border-top-left-radius', 'border-bottom-left-radius'],
  'rounded-tl' : 'border-top-left-radius',
  'rounded-tr' : 'border-top-right-radius',
  'rounded-br' : 'border-bottom-right-radius',
  'rounded-bl' : 'border-bottom-left-radius',
  'basis'      : 'flex-basis',
}

function parse(value) {
  const match = value.trim().match(/^(-?\d*\.?\d+)(px|rem|em)?$/);
  return match && {value: parseFloat(match[1]), unit: match[2] ?? 'px'};
}

function rem(num, unit, base = 16) {
  return unit.endsWith('em') ? num : num / base;
}

function round(n, precision = 3) {
  const d = 10 ** precision;
  return Math.round(n * d) / d;
}

function style(property, value) {
  const properties = Array.isArray(property) ? property : [property];
  const result = {};
  for (const key of properties) result[key] = value;
  return result;
}

function calculate(value, options) {

  let args = value.split(',');
  if (args.length < 2) return null;

  args = args.map(n => n || undefined);

  const minParsed = parse(args[0]);
  const maxParsed = parse(args[1]);
  if (!minParsed || !maxParsed) return null;

  const minValue = minParsed.value / options.base;
  const maxValue = maxParsed.value / options.base;
  const minWidth = (args[2] ?? options.vmin) / options.base;
  const maxWidth = (args[3] ?? options.vmax) / options.base;

  const slope = (maxValue - minValue) / (maxWidth - minWidth);
  const y = minValue - slope * minWidth;

  return `clamp(${round(minValue)}rem, ${round(y)}rem + ${round(slope * 100)}vw, ${round(maxValue)}rem)`;
}

export default plugin.withOptions((options = {}) => {

  const { base = 16, vmin = 375, vmax = 1680, prefix = 'f-' } = options;
  options = { base, vmin, vmax };

  return tailwind => {

    for (const [name, property] of Object.entries(utilities)) {
      tailwind.matchUtilities({
        [`${prefix}${name}`]: value => {
          const clamp = calculate(value, options);
          return style(property, clamp);
        },
      });
    }

    const breakpoint = tailwind.theme('breakpoint') ?? {};
    for (const [name, width] of Object.entries(breakpoint)) {
      if (name.startsWith('__')) continue;
      tailwind.addVariant(`below-${name}`, `@media (width <  ${width})`);
      tailwind.addVariant(`above-${name}`, `@media (width >= ${width})`);
    }

    tailwind.matchVariant('below', value => {
      const width = rem(value, 'px', base);
      return `@media (width < ${round(width)}rem)`;
    });

    tailwind.matchVariant('above', value => {
      const width = rem(value, 'px', base);
      return `@media (width >= ${round(width)}rem)`;
    });

    const zIndex = tailwind.theme('z') ?? {};

    for (const [name] of Object.entries(zIndex)) {
      if (name.startsWith('__')) continue;
      tailwind.addUtilities({
        [`.z-${name}`]:       { 'z-index': `var(--z-${name})` },
        [`.z-above-${name}`]: { 'z-index': `calc(var(--z-${name}) + 1)` },
        [`.z-below-${name}`]: { 'z-index': `calc(var(--z-${name}) - 1)` },
      });
    }
  }
});

export { utilities, parse, rem, round, calculate };
