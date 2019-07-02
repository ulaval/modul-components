import { PluginObject } from 'vue';
import { SpritesService } from './sprites';


const DefaultSpritesPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug('sprites-default.svg', 'plugin.install');
        const svg: SpritesService = (v.prototype).$svg;
        if (svg) {
            svg.addSprites(require('../../assets/icons/sprites-default.svg'));

        } else {
            v.prototype.$log.error(
                'DefaultSpritesPlugin.install -> You must use the svg plugin.'
            );
        }
    }
};

export default DefaultSpritesPlugin;
