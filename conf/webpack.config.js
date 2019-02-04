const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = function (env) {
    let isLib = !!(env && env.lib);

    let outputObj;
    if (isLib) {
        outputObj = {
            library: '@ulaval/modul-components',
            libraryTarget: 'umd',
            path: resolve('dist'),
            publicPath: '/',
            filename: 'modul.js'
        }
    } else {
        outputObj = {
            path: resolve('dist'),
            publicPath: '/',
            filename: 'app.js'
        }
    }

    let externalsObj = isLib ? { vue: 'Vue' } : {};

    var config = {
        entry: {
            app: [isLib ? './src/lib.ts' : './tests/app/main.ts']
        },

        externals: externalsObj,

        output: outputObj,

        resolve: {
            extensions: ['.js', '.ts', '.html'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src')
            }
        },

        devtool: 'source-map',

        module: {
            loaders: [{
                exclude: [
                    'vue/**/*'
                ],
            }],
            rules: [{
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
                loader: "sass-loader",
                options: {
                    sourceMap: true,
                    includePaths: ["./src/styles"]
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
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: isLib ? resolve('tsconfig.lib.json') : resolve('tsconfig.json')
                }
            },
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    tsConfigFile: isLib ? 'tsconfig.lib.json' : 'tsconfig.json',
                    formatter: 'grouped',
                    formattersDirectory: 'node_modules/custom-tslint-formatters/formatters',
                    emitErrors: true,
                }
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
            new StyleLintPlugin({
                configFile: '.stylelintrc',
                emitErrors: true
            }),
            new ContextReplacementPlugin(
                /moment[\/\\]locale$/,
                /en-ca|fr-ca/
            )
        ]
    }

    if (!isLib) {
        config.plugins.push(new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('tests/app/index.html'),
            inject: 'body'
        }));
    }

    return config;
}
