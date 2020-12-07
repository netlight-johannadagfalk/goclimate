const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default;

// Border specific colors
// https://github.com/tailwindlabs/tailwindcss/pull/560#issuecomment-670045304
module.exports = function borderSpecificColors({ addUtilities, theme, variants }) {
  const colors = flattenColorPalette(theme('borderColor'));
  delete colors.default;

  const colorMap = Object.keys(colors)
    .map((color) => ({
      [`.border-t-${color}`]: { borderTopColor: colors[color] },
      [`.border-r-${color}`]: { borderRightColor: colors[color] },
      [`.border-b-${color}`]: { borderBottomColor: colors[color] },
      [`.border-l-${color}`]: { borderLeftColor: colors[color] }
    }));
  const utilities = Object.assign({}, ...colorMap);

  addUtilities(utilities, variants('borderColor'));
};
