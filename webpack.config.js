const path = require('path');
const config = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

const webpack = require('webpack');

const PROD = true;

class Without {
    constructor(patterns) {
        this.patterns = patterns;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync("MiniCssExtractPluginCleanup", (compilation, callback) => {
            Object.keys(compilation.assets)
                .filter(asset => {
                    let match = false,
                        i = this.patterns.length
                    ;
                    while (i--) {
                        if (this.patterns[i].test(asset)) {
                            match = true;
                        }
                    }
                    return match;
                }).forEach(asset => {
                    delete compilation.assets[asset];
                });

            callback();
        });
    }
};

module.exports = {
  entry: {
    "waving-flag": "./src/waving-flag.js",
    "waving-flag.min": "./src/waving-flag.js",
    "waving-flag-styles": "./src/waving-flag-styles.scss",
  },
  devtool: 'source-map',
  mode: PROD ? 'production' : 'development',
  optimization: {
    minimize: PROD,
    minimizer: [new TerserPlugin({
      include: /\.min\.js$/
    })]
  },
  output: {
    library: 'waving-flag',
    libraryTarget: 'window',
    path: __dirname,
    filename: 'dist/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: 'dist/[name].css',
      chunkFilename: 'dist/[id].css',
      ignoreOrder: false,
    }),
  ],
};

