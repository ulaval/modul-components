import { PluginObject } from 'vue';

import { SpritesService } from './sprites';
import { Logger } from '../logger/logger';

const DefaultSpritesPlugin: PluginObject<any> = {
    install(v, options): void {
        Logger.debug('sprites-default.svg', 'plugin.install');
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
