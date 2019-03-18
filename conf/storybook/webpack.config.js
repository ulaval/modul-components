const webpackBase = require("../webpack.base.js");

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

    // Pour faire fonctionner __filename dans webpack
    config.node = {
        __filename: true
    };

    //Uncomment the following line to display configuration
    // console.dir(config, { depth: null });
    return config;
};
