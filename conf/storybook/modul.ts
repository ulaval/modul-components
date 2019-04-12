import Vue, { PluginObject } from 'vue';
import FrenchPlugin from '../../src/lang/fr';
import '../../src/styles/main.scss';
import './styles/storybook.scss';
import { FRENCH } from '../../src/utils/i18n/i18n';
import '../../src/utils/polyfills';
import DefaultSpritesPlugin from '../../src/utils/svg/default-sprites';
import UtilsPlugin, { UtilsPluginOptions } from '../../src/utils/utils-plugin';


export const ModulPlugin: PluginObject<any> = {
    install(v, options): void {

        Vue.config.productionTip = false;

        let utilsOptions: UtilsPluginOptions = {
            propagateVueParserErrors: false,
            i18PluginOptions: {
                curLang: FRENCH
            }
        };

        Vue.use(UtilsPlugin, utilsOptions);
        Vue.use(FrenchPlugin);
        Vue.use(DefaultSpritesPlugin);
    }
};
