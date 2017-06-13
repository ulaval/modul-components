// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require('./webpack.config')();

module.exports = function (config) {
    let reporters = ['spec'];
    if (config.junitReport) {
        reporters.push('junit');
    }
    config.set({
        browsers: ['PhantomJS', 'Chrome', 'Firefox'],
        frameworks: ['jasmine'],
        reporters: reporters,
        files: ['../tests/unit.js'],
        junitReporter: {
            outputDir: '../tests/reports'
        },
        preprocessors: {
            '../tests/unit.js': ['webpack']
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    })
}
