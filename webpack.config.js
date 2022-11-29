const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require('path')

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
            title: "All books you want"
        })
    ],
    module:{
        rules:[
            {
                test: /\css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            }
          
        ]
    }
}