const path = require("path");
const ab = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack')
//webpack只识别js和json文件
module.exports = {
    //入口
    entry: {
        index: "./src/index.js"
    },
    //出口
    output: {
        //输出路径  固定语法
        path: path.resolve(__dirname, "dist"),
        //输出名字
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader",
                        options: { importLoaders: 1 }
                    }, 'postcss-loader'],
                    publicPath: "../"
                })
            }, {
                test: /\.(jpg|png|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 3000000,
                        outputPath: "image/"
                    }
                }]
            }, {
                test: /\.html$/,
                loader: 'html-withimg-loader'
            }, {
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'sass-loader']
                })
            }, {
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
    //插件 配置html
    plugins: [
        new ExtractTextPlugin("css/main.css"),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new ab({
            minify: {
                removeAttributeQuotes: true
            },
            hash: true,
            filename: 'index.html',
            template: 'src/index.html'
        })
    ],
    //服务启动
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        //本地
        host: "localhost",
        //压缩
        compress: true,
        // 端口
        port: "8081"
    }
}