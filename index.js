import plugin from 'tailwindcss/plugin';

const utilities = {
  'f-m'          : 'margin',
  'f-mx'         : ['margin-left', 'margin-right'],
  'f-my'         : ['margin-top', 'margin-bottom'],
  'f-mt'         : 'margin-top',
  'f-mr'         : 'margin-right',
  'f-mb'         : 'margin-bottom',
  'f-ml'         : 'margin-left',
  'f-p'          : 'padding',
  'f-px'         : ['padding-left', 'padding-right'],
  'f-py'         : ['padding-top', 'padding-bottom'],
  'f-pt'         : 'padding-top',
  'f-pr'         : 'padding-right',
  'f-pb'         : 'padding-bottom',
  'f-pl'         : 'padding-left',
  'f-text'       : 'font-size',
  'f-leading'    : 'line-height',
  'f-tracking'   : 'letter-spacing',
  'f-w'          : 'width',
  'f-h'          : 'height',
  'f-size'       : ['width', 'height'],
  'f-min-w'      : 'min-width',
  'f-max-w'      : 'max-width',
  'f-min-h'      : 'min-height',
  'f-max-h'      : 'max-height',
  'f-gap'        : 'gap',
  'f-gap-x'      : 'column-gap',
  'f-gap-y'      : 'row-gap',
  'f-inset'      : 'inset',
  'f-inset-x'    : ['left', 'right'],
  'f-inset-y'    : ['top', 'bottom'],
  'f-top'        : 'top',
  'f-right'      : 'right',
  'f-bottom'     : 'bottom',
  'f-left'       : 'left',
  'f-border'     : 'border-width',
  'f-border-t'   : 'border-top-width',
  'f-border-r'   : 'border-right-width',
  'f-border-b'   : 'border-bottom-width',
  'f-border-l'   : 'border-left-width',
  'f-rounded'    : 'border-radius',
  'f-rounded-t'  : ['border-top-left-radius', 'border-top-right-radius'],
  'f-rounded-r'  : ['border-top-right-radius', 'border-bottom-right-radius'],
  'f-rounded-b'  : ['border-bottom-left-radius', 'border-bottom-right-radius'],
  'f-rounded-l'  : ['border-top-left-radius', 'border-bottom-left-radius'],
  'f-rounded-tl' : 'border-top-left-radius',
  'f-rounded-tr' : 'border-top-right-radius',
  'f-rounded-br' : 'border-bottom-right-radius',
  'f-rounded-bl' : 'border-bottom-left-radius',
  'f-basis'      : 'flex-basis',
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

function style(property, value) {
  const properties = Array.isArray(property) ? property : [property];
  const result = {};
  for (const key of properties) result[key] = value;
  return result;
}

export default plugin.withOptions((options = {}) => {

  options = {
    base: options.base ?? 16,
    vmin: options.vmin ?? 375,
    vmax: options.vmax ?? 1680,
  };

  return ({ matchUtilities }) => {

    for (const [name, property] of Object.entries(utilities)) {
      matchUtilities({
        [name]: value => {
          const clamp = calculate(value, options);
          return style(property, clamp);
        },
      });
    }
  }
});

export { utilities, parse, rem, round, calculate };
