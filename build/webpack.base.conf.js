'use strict'

const path = require('path')
const utils = require('./utils')
const config = require('../config')

const SpritesmithPlugin = require('webpack-spritesmith')

function resolve(dir){
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/main.js'    //  入口文件
    },
    output: {
        path: config.build.assetsRoot,  //  输出目录
        filename: '[name].js',          //  输出文件名
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath :
            config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js','.json'],    //  js,json在引入的时候无需加后缀
        alias: {
            '@': resolve('src')         //  用@映射为源码根目录src
        },
    },
    plugins: [
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, '../src/assets/icon'),  //准备合并成sprit的图片存放文件夹
                glob: '*.png'  //哪类图片
            },
            target: {
                image: path.resolve(__dirname, '../src/assets/sprites/sprites.png'),  // sprite图片保存路径
                css: path.resolve(__dirname, '../src/assets/sprites/_sprites.scss')  // 生成的sass保存在哪里
            },
            apiOptions: {
                cssImageRef: "../sprites/sprites.png" //css根据该指引找到sprite图
            },
            customTemplates: {
                'scss': path.resolve(__dirname, '../config/spritesmith/scss.template.handlebars')   //  自定义scss模板文件（处理rem问题）
            }
        })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [resolve('src'),resolve('node_modules/webpack-dev-server/client')]
        },{
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        },{
            test: /\.(mp4|webm|ogg|mp3|wav|flac|acc)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('media/[name].[hash:7].[ext]')
            }
        },{
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }]
    },
    node: {
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
      }
}