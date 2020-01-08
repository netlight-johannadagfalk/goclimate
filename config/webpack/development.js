const fs = require('fs');
const yaml = require('js-yaml');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const env = process.env.NODE_ENV || 'development';
const sharedConfig = yaml.safeLoad(fs.readFileSync('config/webpack.yml'))[env];

module.exports = {
  mode: 'development',
  output: {
    filename: '[name]-dev.js' /* webpack-dev-server with HMR doesn't allow content hashes in filenames */
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  devtool: 'cheap-module-source-map',
  devServer: {
    host: sharedConfig.dev_server_host,
    port: sharedConfig.dev_server_port,
    contentBase: false, /* Don't serve static files with webpack-dev-server */
    overlay: true, /* Display build warnings in open browsers */
    hot: true
  },
  cache: true
}
