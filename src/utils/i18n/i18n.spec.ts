import Vue from 'vue';
import MessagesPlugin, { Messages, ENGLISH, I18nPluginOptions } from './i18n';
import { resetModulPlugins } from '../../../tests/helpers/component';

describe('i18n plugin', () => {
    describe('when install', () => {
        beforeEach(() => {
            resetModulPlugins(false);
        });

        it('should set the language to english if no option provided', () => {
            Vue.use(MessagesPlugin);
            let i18n: Messages = Vue.prototype.$i18n;
            expect(i18n.currentLang()).toEqual(ENGLISH);
        });

        it('should set the language to the one provided in the options', () => {
            let options: I18nPluginOptions = {
                curLang: 'fr'
            };
            Vue.use(MessagesPlugin, options);
            let i18n: Messages = Vue.prototype.$i18n;
            expect(i18n.currentLang()).toEqual('fr');
        });
    });

    describe('when created', () => {
        it('calling currentLang with a new language should change the current language', () => {
            Vue.use(MessagesPlugin);
            let i18n: Messages = Vue.prototype.$i18n;
            i18n.currentLang('es');
            expect(i18n.currentLang()).toEqual('es');
        });
    });
});
