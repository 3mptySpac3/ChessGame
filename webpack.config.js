const path = require('path');

module.exports = {
  entry: './app.js', // Entry point of your application
  output: {
    filename: 'bundle.js', // Output file
    path: path.resolve(__dirname,), // Output directory
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.resolve(__dirname), // Serve from the root directory
    },
    compress: true,
    port: 8080,
  },
};
