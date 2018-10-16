import Vue from 'vue';

import { resetModulPlugins } from '../../../tests/helpers/component';
import { addMessages } from '../../../tests/helpers/lang';
import I18nPlugin, { ENGLISH, FormatMode, I18nPluginOptions, Messages } from './i18n';

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

    describe('without setting formatOption', () => {
        beforeEach(() => {
            resetModulPlugins();
            Vue.use(I18nPlugin);
            addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
        });
        it(`calling translate with params modifier should return the string with the params applied`, () => {
            expect(Vue.prototype.$i18n.translate('exemples_avec_parametres:decompte_athletes_olympiques_pays_default_formatting', ['2925', '93'])).toEqual('Il y a 2925 athlètes olympiques et 93 pays participants.');
        });
    });

    describe('with formatOption = "vsprintf"', () => {
        beforeEach(() => {
            let options: I18nPluginOptions = {
                formatMode: FormatMode.Vsprintf
            };

            resetModulPlugins();
            Vue.use(I18nPlugin, options);
            addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
        });
        it(`calling translate with params modifier should return the string with the params applied`, () => {
            expect(Vue.prototype.$i18n.translate('exemples_avec_parametres:decompte_athletes_olympiques_pays', { nbAthletes: 2925, nbPays: 93 })).toEqual('Il y a 2925 athlètes olympiques et 93 pays participants.');
        });
    });

    describe('with formatOption = "sprintf"', () => {
        beforeEach(() => {
            let options: I18nPluginOptions = {
                formatMode: FormatMode.Sprintf
            };

            resetModulPlugins();
            Vue.use(I18nPlugin, options);
            addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
        });
        it(`calling translate with params modifier should return the string with the params applied`, () => {
            expect(Vue.prototype.$i18n.translate('exemples_avec_parametres:decompte_athletes_olympiques_pays', { nbAthletes: 2925, nbPays: 93 })).toEqual('Il y a 2925 athlètes olympiques et 93 pays participants.');
        });
    });

    describe('with global variables in mode Vsprintf', () => {
        beforeEach(() => {
            let options: I18nPluginOptions = {
                formatMode: FormatMode.Vsprintf,
                globalParams: { espace_insecable : '__ESPACE_INSECABLE__' } // use in place of "\xa0" to be able to validate the result
            };

            resetModulPlugins();
            Vue.use(I18nPlugin, options);
            addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
        });
        it(`will replace global variables`, () => {
            expect(Vue.prototype.$i18n.translate('exemples_avec_parametres_globaux:decompte_medailles_olympiques_canada', { nbMedailles: 1 })).toEqual('Les athlètes canadiens ont gagnés 1__ESPACE_INSECABLE__medaille.');
        });
        it(`will allow messages without global variables`, () => {
            expect(Vue.prototype.$i18n.translate('exemples_avec_parametres:decompte_athletes_olympiques_pays', { nbAthletes: 2925, nbPays: 93 })).toEqual('Il y a 2925 athlètes olympiques et 93 pays participants.');
        });
    });

    describe('with global variables in mode sprintf', () => {
        beforeEach(() => {
            let options: I18nPluginOptions = {
                formatMode: FormatMode.Sprintf,
                globalParams: { espace_insecable : '__ESPACE_INSECABLE__' } // use in place of "\xa0" to be able to validate the result
            };

            resetModulPlugins();
            Vue.use(I18nPlugin, options);
            addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
        });
        it(`will replace global variables`, () => {
            expect(Vue.prototype.$i18n.translate('exemples_avec_parametres_globaux:decompte_medailles_olympiques_canada', { nbMedailles: 1 })).toEqual('Les athlètes canadiens ont gagnés 1__ESPACE_INSECABLE__medaille.');
        });
        it(`will allow messages without global variables`, () => {
            expect(Vue.prototype.$i18n.translate('exemples_avec_parametres:decompte_athletes_olympiques_pays', { nbAthletes: 2925, nbPays: 93 })).toEqual('Il y a 2925 athlètes olympiques et 93 pays participants.');
        });
    });

    describe('with global variables in default mode', () => {
        beforeEach(() => {
            let options: I18nPluginOptions = {
                globalParams: { espace_insecable : '__ESPACE_INSECABLE__' } // use in place of "\xa0" to be able to validate the result
            };

            resetModulPlugins();
            Vue.use(I18nPlugin, options);
            addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
        });
        it(`will not use global variables`, () => {
            expect(Vue.prototype.$i18n.translate('exemples_avec_parametres_globaux:decompte_medailles_olympiques_canada_default_formatting', [1])).toEqual('Les athlètes canadiens ont gagnés 1 medaille.');
        });
    });

    describe('Given a translated messages files', () => {
        beforeEach(() => {
            resetModulPlugins();
            Vue.use(I18nPlugin);
            addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
        });
        it(`calling translate with modifiers should return the modified string`, () => {
            expect(Vue.prototype.$i18n.translate('exemples-avec-nombre-genre:medaille-olympique', {}, 1, 'f')).toEqual('La seule médaillée olympique');
        });
    });
});
