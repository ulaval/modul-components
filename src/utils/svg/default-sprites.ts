import { PluginObject } from 'vue';
import { SpritesService } from './sprites';

const DefaultSpritesPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug('sprites-default.svg', 'plugin.install');
        if ((v as any).$svg) {
            let svg: SpritesService = (v as any).$svg;
            svg.addSprites(require('../../assets/icons/sprites-default.svg'));
        } else {
            console.error('DefaultSpritesPlugin.install -> You must use the svg plugin.');
        }
    }
};

export default DefaultSpritesPlugin;
