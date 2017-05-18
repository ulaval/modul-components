// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require('./webpack.config');

module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS', 'Chrome', 'Firefox'],
        frameworks: ['jasmine'],
        reporters: ['spec'],
        files: ['../tests/unit/index.js'],
        preprocessors: {
            '../tests/unit/index.js': ['webpack']
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    })
}
