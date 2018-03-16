const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = function (env) {
    var buildOnly = !!(env && env.buildonly);

    var config = {
        entry: {
            app: ['./tests/app/main.ts']
        },

        externals: [],

        output: {
            path: resolve('dist'),
            publicPath: '/',
            filename: 'app.js'
        },

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
                    configFileName: resolve('tsconfig.dev.json')
                }
            },
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                include: [resolve('src'), resolve('test')],
                options: {
                    configFile: 'conf/tslint.json',
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

    if (!buildOnly) {
        config.plugins.push(new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('tests/app/index.html'),
            inject: 'body'
        }));
    }

    return config;
}
