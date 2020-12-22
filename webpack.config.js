const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
require('@babel/polyfill')

module.exports = (env, opts) => {
  const config = {
    // 중복되는 옵션들...
    resolve: {
      extensions: ['.vue', '.js'],
      alias: {
        '~': path.join(__dirname),
        'scss': path.join(__dirname, './scss') 
      }
    },
    // 진입점
    entry: {
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'main.js')
      ]
    },
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: { esModule: false }
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: { esModule: false }
            },
            'postcss-loader',
            'sass-loader'
          ]
        }

      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      })
      // new CopyPlugin({
      //   patterns: [
      //     { from: 'assets/', to: '' }
      //   ]
      // })
    ]
  }
  // dev(개발용)
  if (opts.mode === 'development') {
    return merge(config, {
      devtool: 'eval',
      devServer: {
        open: false, 
        hot: true
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development')
        })
      ]
    })
  }
  if (opts.mode === 'production') {
    return merge(config, {
      devtool: 'cheap-module-source-map',
      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }
}
