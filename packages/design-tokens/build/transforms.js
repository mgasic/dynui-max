import StyleDictionary from 'style-dictionary';

/**
 * Custom transforms for DynUI-Max design tokens
 * These transforms enhance the built-in Style Dictionary transforms
 */

// Custom name transform for DynUI CSS variables
export const dynKebabTransform = {
  name: 'name/cti/dyn-kebab',
  type: 'name',
  transform: (token) => {
    return `dyn-${token.path.join('-')}`;
  }
};

// Custom size transform that preserves rem values
export const sizeRemTransform = {
  name: 'size/px-to-rem',
  type: 'value',
  filter: (token) => {
    return token.attributes?.category === 'size' &&
           typeof token.value === 'string' &&
           token.value.endsWith('px');
  },
  transform: (token) => {
    const pxValue = parseFloat(token.value);
    return `${pxValue / 16}rem`;
  }
};

// Custom transform for font family arrays
export const fontFamilyTransform = {
  name: 'font/family/css',
  type: 'value',
  filter: (token) => {
    return token.attributes?.category === 'font' &&
           token.attributes?.type === 'family';
  },
  transform: (token) => {
    // Font family is already a string in our JSON, just return it
    return token.value;
  }
};

// Register all transforms
export function registerCustomTransforms() {
  StyleDictionary.registerTransform(dynKebabTransform);
  StyleDictionary.registerTransform(sizeRemTransform);
  StyleDictionary.registerTransform(fontFamilyTransform);
}

// Custom transform groups
export const dynCssTransformGroup = {
  name: 'dyn/css',
  transforms: [
    'attribute/cti',          // Built-in: adds category/type/item attributes
    'name/cti/dyn-kebab',     // Custom: dyn- prefixed kebab-case names
    'time/seconds',           // Built-in: converts time to seconds
    'html/icon',              // Built-in: wraps icon values in quotes
    'size/px-to-rem',         // Custom: converts px to rem
    'font/family/css',        // Custom: formats font families
    'color/hex'               // Built-in: ensures colors are hex
  ]
};

export function registerCustomTransformGroups() {
  StyleDictionary.registerTransformGroup(dynCssTransformGroup);
}

// Initialize all custom transforms and groups
export function initializeCustomTransforms() {
  registerCustomTransforms();
  registerCustomTransformGroups();
}