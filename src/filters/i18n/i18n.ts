import Vue, { PluginObject } from 'vue';

import { I18N_NAME } from '../filter-names';

const i18nFilter: (key: string,
    params,
    nb?: number,
    modifier?: string,
    htmlEncodeParams?: boolean) => any = (key: string,
    params: any[] = [],
    nb?: number,
    modifier?: string,
    htmlEncodeParams: boolean = true) => {
        return Vue.prototype.$i18n.translate(key, params, nb, modifier, htmlEncodeParams);
    };

const I18nFilterPlugin: PluginObject<any> = {
    install(v, options): void {
        v.filter(I18N_NAME, i18nFilter);
    }
};

export default I18nFilterPlugin;
