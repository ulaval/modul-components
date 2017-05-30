const StyleLintPlugin = require('stylelint-webpack-plugin');
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        'component-names': ['./src/components/component-names.ts'],
        'meta': ['./src/components/meta.ts'],
        'meta-fr': ['./src/components/meta-fr.ts'],
        'buttons': ['./src/components/buttons/buttons.ts'],
        'lists': ['./src/components/lists/lists.ts'],
        'text': ['./src/components/text/text.ts'],
        'utils': ['./src/utils/i18n.ts', './src/utils/uuid.ts'],
        'services': ['./src/services/component-meta-impl']
    },

    externals: ['vue', 'vue-class-component', 'vue-property-decorator'],

    output: {
        path: resolve('dist'),
        publicPath: '/',
        libraryTarget: 'umd',
        filename: '[name].js'
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
        loaders: [
            {
                exclude: [
                    'vue/**/*'
                ],
            }
        ],
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
                            plugins: function () {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'vue-template-loader',
                exclude: resolve('src/index.html'),
                options: {
                    scoped: true
                }
            },
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: resolve('tsconfig.json')
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
                    formattersDirectory: 'node_modules/custom-tslint-formatters/formatters'
                }
            }
        ]
    },
    plugins: [
        new StyleLintPlugin({
            configFile: 'conf/stylelint.json',
            emitErrors: false
        })
    ]
}
