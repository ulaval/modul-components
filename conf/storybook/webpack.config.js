const webpackBase = require("../webpack.base.js");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = ({ config, mode }) => {
    let baseConfig = webpackBase(false);

    // Retirer ProgressPlugin car il produit une quantité incroyable de log sur jenkins
    // Retirer VueLoaderPlugin car nous n'avons pas de SFC (Single File Component) avec des fichiers .vue
    config.plugins = config.plugins.filter(({ constructor }) => (constructor.name !== "ProgressPlugin" && constructor.name !== "VueLoaderPlugin"));

    config.resolve.extensions.push(...baseConfig.resolve.extensions);
    config.resolve.alias = { ...config.resolve.alias, ...baseConfig.resolve.alias };

    // Attention, j'écrase les loaders webpack par défaut de storybook car ils ne gèrent pas bien les css.
    // Par contre, ce dernier offrait automatiquement le support des fichiers .md (markdown). Utile si on veut faire marcher le addon-notes avec du markdown
    config.module.rules = baseConfig.module.rules;

    config.plugins.push(...(baseConfig.plugins));


    // add linter + stylelint
    config.plugins.push(new ForkTsCheckerWebpackPlugin({
        tsconfig: 'tsconfig.json',
        checkSyntacticErrors: true,
        tslint: true
    }));

    config.plugins.push(new StyleLintPlugin({
        configFile: '.stylelintrc',
        emitErrors: true
    }));

    //Uncomment the following line to display configuration
    // console.dir(config, { depth: null });
    return config;
};
