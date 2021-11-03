const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    'web-ui': [path.resolve(__dirname, '../src/styles/index.scss')],
  },
  externals: {
    react: true,
    'react-dom': true,
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.scss$/,
        include: /src/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('cssnano')()],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, '../src/styles')],
              },
            },
          },
        ],
      },
      {
        test: /\.woff(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[path][name].[ext]',
              mimetype: 'application/font-woff',
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.woff2(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[path][name].[ext]',
              mimetype: 'application/font-woff2',
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.otf(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              mimetype: 'font/opentype',
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.ttf(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[path][name].[ext]',
              mimetype: 'application/octet-stream',
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.eot(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[path][name].[ext]',
              mimetype: 'image/svg+xml',
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css?q=[contenthash]',
      allChunks: true,
    }),
  ],
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.css', '.sass', '.scss', '.html'],
  },
};
