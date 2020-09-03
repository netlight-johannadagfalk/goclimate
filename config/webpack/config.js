const { merge } = require('webpack-merge');

const env = process.env.NODE_ENV || 'development';

module.exports = merge(require('./common.js'), require(`./${env}.js`))
