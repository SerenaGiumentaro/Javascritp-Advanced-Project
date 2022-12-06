const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require('path')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "The Book Index",
            template: path.resolve(__dirname, "./src/index.html"),
            favicon: './src/assets/favicon.ico',
            publicPath: './'
        }),
        new FaviconsWebpackPlugin({
          logo: './src/assets/favicon.ico',
          publicPath: '.'
        })
    ],
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
        ],
      }
}