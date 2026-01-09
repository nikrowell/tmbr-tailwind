import { describe, it, expect } from 'vitest';
import { parse, rem, round, calculate, utilities } from '.';

const options = {
  base: 16,
  vmin: 375,
  vmax: 1680,
};

describe('utilities', () => {

  it('has correct properties', () => {
    expect(utilities['f-size']).toEqual(['width', 'height']);
    expect(utilities['f-mx']).toEqual(['margin-left', 'margin-right']);
    expect(utilities['f-px']).toEqual(['padding-left', 'padding-right']);
    expect(utilities['f-text']).toBe('font-size');
    expect(utilities['f-gap-x']).toBe('column-gap');
    expect(utilities['f-gap-y']).toBe('row-gap');
  });
});

describe('parse', () => {

  it('parses px values', () => {
    expect(parse('24px')).toEqual({value: 24, unit: 'px'});
  });

  it('parses em values', () => {
    expect(parse('2em')).toEqual({value: 2, unit: 'em'});
  });

  it('parses rem values', () => {
    expect(parse('1.5rem')).toEqual({value: 1.5, unit: 'rem'});
  });

  it('treats unitless numbers as px', () => {
    expect(parse('16')).toEqual({value: 16, unit: 'px'});
  });

  it('parses negative values', () => {
    expect(parse('-16px')).toEqual({value: -16, unit: 'px'});
  });

  it('parses decimal values', () => {
    expect(parse('1.5')).toEqual({value: 1.5, unit: 'px'});
  });

  it('returns null for invalid values', () => {
    expect(parse('')).toBeNull();
    expect(parse('invalid')).toBeNull();
  });
});

describe('rem', () => {

  it('returns same value for rem', () => {
    expect(rem(1.5, 'rem')).toBe(1.5);
  })

  it('returns same value for em', () => {
    expect(rem(2, 'em')).toBe(2);
  })

  it('converts px to rem', () => {
    expect(rem(16, 'px', 16)).toBe(1);
    expect(rem(32, 'px', 16)).toBe(2);
    expect(rem(24, 'px', 16)).toBe(1.5);
  })

  it('uses custom root font size', () => {
    expect(rem(20, 'px', 10)).toBe(2);
  });
});

describe('round', () => {

  it('rounds numbers with precision', () => {
    expect(round(1.66666666666)).toBe(1.667);
    expect(round(1.23456789, 1)).toBe(1.2);
    expect(round(1.23456789, 4)).toBe(1.2346);
  });

  it('does not add trailing zeros', () => {
    expect(round(1.5, 4)).toBe(1.5);
    expect(round(2, 4)).toBe(2);
  })

  it('handles negative numbers', () => {
    expect(round(-1.2345, 2)).toBe(-1.23);
  });

  it('handles zero', () => {
    expect(round(0, 4)).toBe(0);
  });
});

describe('calculate', () => {

  it('generates clamp using for unitless numbers', () => {
    const result = calculate('16,32', options);
    expect(result).toMatch(/^clamp\(/);
    expect(result).toContain('1rem');
    expect(result).toContain('2rem');
    expect(result).toContain('vw');
  });

  it('handles negative values', () => {
    const result = calculate('-20,-60', options);
    expect(result).toContain('-1.25rem');
    expect(result).toContain('-3.75rem');
  });

  it('handles min and max viewport override', () => {
    // https://min-max-calculator.9elements.com/?20,40,400,800
    const result = calculate('20,40,400,800', options);
    expect(result).toMatch(/^clamp\(/);
    expect(result).toContain('1.25rem');
    expect(result).toContain('2.5rem');
    expect(result).toContain('5vw');
  });

  it('handles max viewport override', () => {
    // https://min-max-calculator.9elements.com/?20,40,400,1680
    const result = calculate('20,40,400', options)
    expect(result).toMatch(/^clamp\(/);
    expect(result).toContain('0.859rem + 1.5');
  });

  it('handles max viewport override', () => {
    // https://min-max-calculator.9elements.com/?20,40,375,800
    const result = calculate('20,40,,800', options);
    expect(result).toMatch(/^clamp\(/);
    expect(result).toContain('0.147rem + 4.7');
  });

  it('returns null for invalid values', () => {
    expect(calculate('invalid', options)).toBeNull();
    expect(calculate('16', options)).toBeNull();
    expect(calculate('', options)).toBeNull();
  });
});
