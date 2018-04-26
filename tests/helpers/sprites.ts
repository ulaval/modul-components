import { PluginObject } from 'vue';
import SvgPlugin from '../../src/utils/svg/sprites';
import DefaultSpritesPlugin from '../../src/utils/svg/default-sprites';

const SpritesHelper: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug('SpritesHelper', 'plugin.install');
        v.use(SvgPlugin);
        v.use(DefaultSpritesPlugin);
    }
};

export default SpritesHelper;
