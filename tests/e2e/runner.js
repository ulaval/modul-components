const nightwatch = require('nightwatch');
const path = require('path');
const util = require('util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const createWebpackServer = config => {
    const webpackConfig = require(config.webpackConfig)();

    return new WebpackDevServer(webpack(webpackConfig), { quiet: false });
};

const getConfig = options => {
    let nightwatchConfig = path.resolve(process.cwd(), 'conf/nightwatch.conf.js');

    const config = Object.assign({
        nightwatchConfig,
        nightwatchEnv: 'chrome',
        webpackConfig: path.resolve(process.cwd(), 'conf/webpack.config.js'),
        port: 8082,
        tunnelIdentifier: undefined
    }, options);

    console.log(`Running with config:\n${util.inspect(config, { depth: 0, colors: true })}`);

    return Object.assign({}, config, {
        server: createWebpackServer(config)
    });
};

module.exports = options => {
    const config = getConfig(options);

    config.server.listen(config.port, '0.0.0.0', () => {
        var nightwatchOptions = {
            config: config.nightwatchConfig,
            env: config.nightwatchEnv
        };

        nightwatch.runner(nightwatchOptions, success => {
            config.server.close();
        });
    });
};
