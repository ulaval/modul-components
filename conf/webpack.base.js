
const path = require('path');
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = function (isLib) {
    return {
        devtool: isLib ? 'source-map' : 'inline-source-map',
        resolve: {
            extensions: ['.js', '.ts', '.html'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src')
            },

        },
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
    };
};
