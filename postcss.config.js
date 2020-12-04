const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');

const environment = {
  plugins: [
    tailwindcss,
    autoprefixer
  ]
};

if (process.env.NODE_ENV === 'production') {
  environment.plugins.push(
    ...[
      purgecss({
        content: ['./app/views/**/*.html.erb', './app/controllers/**/*.rb', './app/assets/**/*.js'],
        extractors: [
          {
            extractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
            extensions: ['html.erb', 'js']
          }
        ]
      }),
      cssnano({
        preset: 'default'
      })
    ]
  );
}

module.exports = environment;
