const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
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

        resolve: {
            extensions: ['.js', '.ts', '.html'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src')
            }
        },

        devtool: isLib ? 'source-map' : 'inline-source-map',

        module: {
            rules: [
                {
                    enforce: 'post',
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    enforce: 'post',
                    test: /\.scss$/,
                    use: ['style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: function () {
                                    return [
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        }
                    ]
                },
                {
                    enforce: 'pre',
                    test: /\.scss$/,
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        includePaths: ['./src/styles']
                    }
                },
                {
                    test: /\.html$/,
                    loader: 'vue-template-loader',
                    exclude: resolve('tests/app/index.html'),
                    options: {
                        scoped: true
                    }
                },
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'thread-loader',
                            options: {
                                workers: require('os').cpus().length - 1
                            }
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: resolve(
                                    isLib ? 'tsconfig.lib.json' : 'tsconfig.json'
                                ),
                                happyPackMode: true
                            }
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader',
                    options: {
                        removeTags: true,
                        removingTags: ['desc', 'defs', 'style'],
                        removeSVGTagAttrs: true
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: path.posix.join('assets', 'fonts/[name].[hash:7].[ext]')
                    }
                }
            ]

        },
        plugins: [
            new ContextReplacementPlugin(
                /moment[\/\\]locale$/,
                /en-ca|fr-ca/
            )
        ]
    }

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
