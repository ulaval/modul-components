import Vue from 'vue';
import I18nPlugin, { Messages, ENGLISH, I18nPluginOptions } from './i18n';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { addMessages } from '../../../tests/helpers/lang';

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

    describe('with formatOption = "vsprintf"', () => {
        beforeEach(() => {
            let options: I18nPluginOptions = {
                formatMode: 'vsprintf'
            };

            resetModulPlugins();
            Vue.use(I18nPlugin, options);
            addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
        });
        it(`calling translate('decompte_athletes_olympiques_pays', {nbAthletes:2925, nbPays:93}) should return "Il y a 2925 athlètes olympiques et 93 pays participants."`, () => {
            expect(Vue.prototype.$i18n.translate('exemples_avec_parametres:decompte_athletes_olympiques_pays', { nbAthletes: 2925, nbPays: 93 })).toEqual('Il y a 2925 athlètes olympiques et 93 pays participants.');
        });
    });

    describe('with formatOption = "sprintf"', () => {
        beforeEach(() => {
            let options: I18nPluginOptions = {
                formatMode: 'sprintf'
            };

            resetModulPlugins();
            Vue.use(I18nPlugin, options);
            addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
        });
        it(`calling translate('decompte_athletes_olympiques_pays', {nbAthletes:2925, nbPays:93}) should return "Il y a 2925 athlètes olympiques et 93 pays participants."`, () => {
            expect(Vue.prototype.$i18n.translate('exemples_avec_parametres:decompte_athletes_olympiques_pays', { nbAthletes: 2925, nbPays: 93 })).toEqual('Il y a 2925 athlètes olympiques et 93 pays participants.');
        });
    });

    describe('with the possibility to pass nb and modifier parameters inside the parameter param', () => {
        beforeEach(() => {
            let options: I18nPluginOptions = {
                formatMode: 'sprintf'
            };

            resetModulPlugins();
            Vue.use(I18nPlugin, options);
            addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
        });
        it(`calling translate('medaille-olympique', {}, 1, 'f') should return "La seule médaillée olympique"`, () => {
            expect(Vue.prototype.$i18n.translate('exemples-avec-nombre-genre:medaille-olympique', {}, 1, 'f')).toEqual('La seule médaillée olympique');
        });
        it(`calling translate('medaille-olympique', {nb:1, modifier:'f'}) should return "La seule médaillée olympique"`, () => {
            expect(Vue.prototype.$i18n.translate('exemples-avec-nombre-genre:medaille-olympique', { nb: 1, modifier: 'f' })).toEqual('La seule médaillée olympique');
        });
    });
});
