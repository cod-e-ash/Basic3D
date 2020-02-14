const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/* Configure HTMLWebpack plugin */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
})

/* Configure BrowserSync */
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const BrowserSyncPluginConfig = new BrowserSyncPlugin({
    host: 'localhost',
    port: 5501,
    proxy: 'http://localhost:8080/'
}, config = {
    reload: false
})

/* Configure ProgressBar */
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ProgressBarPluginConfig = new ProgressBarPlugin()

/* Export configuration */
module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: [
        './src/index.ts'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    plugins: [new MiniCssExtractPlugin()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }, 
            {
                test: /\.css$/,
                exclude: /[\/\\]src[\/\\]/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader'}
                ]
            },
        ]
    },
    resolve: { extensions: [".web.ts", ".web.js", ".ts", ".js"] },
    plugins: [HTMLWebpackPluginConfig, BrowserSyncPluginConfig, ProgressBarPluginConfig]
}