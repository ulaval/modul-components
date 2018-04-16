import Vue from 'vue';

Vue.filter('f-m-i18n', (key: string,
    params: any[] = [],
    nb?: number,
    modifier?: string,
    htmlEncodeParams: boolean = true) => {
    return Vue.prototype.$i18n.translate(key, params, nb, modifier, htmlEncodeParams);
});
