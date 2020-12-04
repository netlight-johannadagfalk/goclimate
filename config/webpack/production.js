const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  plugins: [
    new CompressionPlugin()
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true
      })
    ]
  }
};
