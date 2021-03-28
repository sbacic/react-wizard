const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    library: 'wizard',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx|\.ts$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      wizard: path.resolve(__dirname, 'src'),
    },
  },
};
