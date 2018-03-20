import Vue from 'vue';
import I18nPlugin, { Messages, ENGLISH, I18nPluginOptions } from './i18n';
import { resetModulPlugins } from '../../../tests/helpers/component';

describe('i18n plugin', () => {
    describe('when not installed', () => {
        beforeEach(() => {
            // i18n always registered by Jest setup
            resetModulPlugins(false);
        });

        it('should not be registered on the Vue prototype', () => {
            expect(Vue.prototype.$i18n).toBeUndefined();
        });
    });

    describe('when install', () => {
        beforeEach(() => {
            // i18n always registered by Jest setup
            resetModulPlugins(false);
        });

        it('should register $i18n on the Vue prototype', () => {
            Vue.use(I18nPlugin);
            expect(Vue.prototype.$i18n).toBeDefined();
        });

        it('should set the language to english if no option provided', () => {
            Vue.use(I18nPlugin);
            let i18n: Messages = Vue.prototype.$i18n;
            expect(i18n.currentLang()).toEqual(ENGLISH);
        });

        it('should set the language to the one provided in the options', () => {
            let options: I18nPluginOptions = {
                curLang: 'fr'
            };
            Vue.use(I18nPlugin, options);
            let i18n: Messages = Vue.prototype.$i18n;
            expect(i18n.currentLang()).toEqual('fr');
        });
    });

    describe('when created', () => {
        it('calling currentLang with a new language should change the current language', () => {
            Vue.use(I18nPlugin);
            let i18n: Messages = Vue.prototype.$i18n;
            i18n.currentLang('es');
            expect(i18n.currentLang()).toEqual('es');
        });
    });
});
