import I18nFilterPlugin from './i18n/i18n';
import Vue, { PluginObject } from 'vue';

const FiltersPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(I18nFilterPlugin);
    }
};

export default FiltersPlugin;
