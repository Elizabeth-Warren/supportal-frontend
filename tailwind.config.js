const theme = require('@ewarren/persist/lib/theme');

const {
  colors,
  fontFamily,
  fontSize,
  leading,
  maxWidth,
  screens,
} = theme.default;

module.exports = {
  important: true,
  theme: {
    colors: { ...colors, transparent: 'transparent' },
    fontFamily,
    fontSize,
    leading,
    screens,
    extend: {
      borderWidth: {
        1: '1px',
        3: '3px',
      },
      maxWidth: { ...maxWidth, modal: '590px' },
      minHeight: { 12: '3rem', 48: '12rem' },
      opacity: {
        70: '.7',
      },
    },
  },
  variants: {},
  plugins: [],
};
