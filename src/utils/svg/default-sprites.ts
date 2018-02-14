import { PluginObject } from 'vue';

import { SpritesService } from './sprites';

const DefaultSpritesPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug('sprites-default.svg', 'plugin.install');
        const svg: SpritesService = (v.prototype as any).$svg;
        if (svg) {
            svg.addSprites(require('../../assets/icons/sprites-default.svg'));
        } else {
            console.error(
                'DefaultSpritesPlugin.install -> You must use the svg plugin.'
            );
        }
    }
};

export default DefaultSpritesPlugin;
