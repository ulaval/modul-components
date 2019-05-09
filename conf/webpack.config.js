const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const webpackBase = require("./webpack.base.js");


function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = function (env) {

    let isLib = !!(env && env.lib);
    let isSilent = !!(env && env.silent);
    let isOpenshift = !!(env && env.openshift);

    let outputObj;
    if (isLib) {
        outputObj = {
            library: '@ulaval/modul-components',
            libraryTarget: 'umd',
            path: resolve('dist'),
            publicPath: '/',
            filename: 'modul.js'
        };
    } else {
        outputObj = {
            path: resolve('dist'),
            publicPath: '/',
            filename: 'app.js'
        };
    }

    let externalsObj = isLib ? { vue: 'Vue' } : {};

    var config = {

        mode: isLib ? 'production' : 'development',

        entry: {
            app: [isLib ? './src/lib.ts' : './tests/app/main.ts']
        },

        externals: externalsObj,

        output: outputObj,

        devServer: {
            contentBase: path.join(__dirname, 'src'),
            historyApiFallback: true
        },

        resolve: webpackBase(isLib).resolve,
        devtool: webpackBase(isLib).devtool,
        module: webpackBase(isLib).module,
        plugins: webpackBase(isLib).plugins
    };

    if (!isOpenshift) {
        //do not run ts check and stylint in openshift (ressource limit!)
        config.plugins.push(new ForkTsCheckerWebpackPlugin({
            tsconfig: isLib ? 'tsconfig.lib.json' : 'tsconfig.json',
            checkSyntacticErrors: true,
            tslint: true,
            silent: isSilent
        }));
        config.plugins.push(new StyleLintPlugin({
            configFile: '.stylelintrc',
            emitErrors: true
        }));
    }

    if (!isLib) {
        config.plugins.push(new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('tests/app/index.html'),
            inject: 'body'
        }));
    } else {
        config.optimization = {
            minimizer: [
                new UglifyJsPlugin({
                    parallel: true,
                    sourceMap: true
                })
            ]
        };
    }

    return config;
}
