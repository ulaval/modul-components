import { PluginObject } from 'vue';
import { SpritesService } from './sprites';

const DefaultSpritesPlugin: PluginObject<any> = {
    install(v, options) {
        if ((v as any).$i18n) {
            let svg: SpritesService = (v as any).$svg;
            svg.addSprites(require('../../assets/icons/sprites-default.svg'));
        } else {
            throw new Error('DefaultSpritesPlugin.install -> You must use the svg plugin.');
        }
    }
};

export default DefaultSpritesPlugin;
