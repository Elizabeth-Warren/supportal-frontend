/* eslint-disable import/no-extraneous-dependencies */
const tailwind = require('tailwindcss');
const postcssPresetEnv = require('postcss-preset-env');

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./components/**/*.js', './pages/**/*.js'],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
  whitelist: ['tox-tinymce'],
});

module.exports = {
  plugins: [
    tailwind,
    postcssPresetEnv,
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
