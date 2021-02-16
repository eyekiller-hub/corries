var path = require('path');

module.exports = {
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  entry: {
    theme: './assets/theme.js'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'assets')
  },
  externals: {
    jquery: 'jQuery'
  }
};
