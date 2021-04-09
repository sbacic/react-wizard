const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    globalObject: 'this',
    library: 'react-wizard',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx|\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'react-wizard': path.resolve(__dirname, 'src'),
    },
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
};
