const loader = require('vue-template-loader');

module.exports = {
    process(src, path) {
        let out = {};

        loader.call(
            {
                cacheable() {},
                callback(any, c, m) {
                    out.code = c;
                    out.map = m;
                },
                options: {
                    target: 'node'
                },
                resourcePath: path.split('.html')[0] + '.html',
                request: ''
            },
            src
        );

        return out;
    }
};
