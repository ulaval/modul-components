import Vue from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { addMessages } from '../../../tests/helpers/lang';
import I18nPlugin, { ENGLISH, FormatMode, I18nPluginOptions, Messages, SpecialCharacter } from './i18n';


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

    describe(`When special character`, () => {
        describe(`in Vsprintf mode`, () => {
            beforeEach(() => {
                let options: I18nPluginOptions = {
                    formatMode: FormatMode.Vsprintf
                };

                resetModulPlugins();
                Vue.use(I18nPlugin, options);
                addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
            });
            describe(`Non-breaking space is used`, () => {
                it(`then will be replaced in translation`, () => {
                    const translation: string = Vue.prototype.$i18n.translate('exemples_avec_characteres_speciaux:decompte_medailles_olympiques_canada', { nbMedailles: 30 });
                    expect(translation.indexOf(String.fromCharCode(parseInt(SpecialCharacter.NBSP, 10)))).toBeGreaterThan(-1);
                    expect(translation.indexOf('_NBSP_')).toBe(-1);
                });
            });

            describe(`Non-breaking hypen is used`, () => {
                it(`then will be replaced in translation`, () => {
                    const translation: string = Vue.prototype.$i18n.translate('exemples_avec_characteres_speciaux:decompte_medailles_olympiques_canada_usa', { nieme: 3 });
                    expect(translation.indexOf(String.fromCharCode(parseInt(SpecialCharacter.NBHYPHEN, 10)))).toBeGreaterThan(-1);
                    expect(translation.indexOf('_NBHYPHEN_')).toBe(-1);
                });
            });

            describe(`Em-Dash is used`, () => {
                it(`then will be replaced in translation`, () => {
                    const translation: string = Vue.prototype.$i18n.translate('exemples_avec_characteres_speciaux:decompte_medailles_olympiques', { nbMedailles: 3 });
                    expect(translation.indexOf(String.fromCharCode(parseInt(SpecialCharacter.EMDASH, 10)))).toBeGreaterThan(-1);
                    expect(translation.indexOf('_EMDASH_')).toBe(-1);
                });
            });

            describe(`En-Dash is used`, () => {
                it(`then will be replaced in translation`, () => {
                    const translation: string = Vue.prototype.$i18n.translate('exemples_avec_characteres_speciaux:olympiques_rivalite', {});
                    expect(translation.indexOf(String.fromCharCode(parseInt(SpecialCharacter.ENDASH, 10)))).toBeGreaterThan(-1);
                    expect(translation.indexOf('_ENDASH_')).toBe(-1);

                });
            });
        });
        describe(`in Sprintf mode`, () => {
            beforeEach(() => {
                let options: I18nPluginOptions = {
                    formatMode: FormatMode.Sprintf
                };

                resetModulPlugins();
                Vue.use(I18nPlugin, options);
                addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
            });
            describe(`Non-breaking space is used`, () => {
                it(`then will be replaced in translation`, () => {
                    const translation: string = Vue.prototype.$i18n.translate('exemples_avec_characteres_speciaux:decompte_medailles_olympiques_canada', { nbMedailles: 30 });
                    expect(translation.indexOf(String.fromCharCode(parseInt(SpecialCharacter.NBSP, 10)))).toBeGreaterThan(-1);
                    expect(translation.indexOf('_NBSP_')).toBe(-1);
                });
            });

            describe(`Non-breaking hypen is used`, () => {
                it(`then will be replaced in translation`, () => {
                    const translation: string = Vue.prototype.$i18n.translate('exemples_avec_characteres_speciaux:decompte_medailles_olympiques_canada_usa', { nieme: 3 });
                    expect(translation.indexOf(String.fromCharCode(parseInt(SpecialCharacter.NBHYPHEN, 10)))).toBeGreaterThan(-1);
                    expect(translation.indexOf('_NBHYPHEN_')).toBe(-1);
                });
            });

            describe(`Em-Dash is used`, () => {
                it(`then will be replaced in translation`, () => {
                    const translation: string = Vue.prototype.$i18n.translate('exemples_avec_characteres_speciaux:decompte_medailles_olympiques', { nbMedailles: 3 });
                    expect(translation.indexOf(String.fromCharCode(parseInt(SpecialCharacter.EMDASH, 10)))).toBeGreaterThan(-1);
                    expect(translation.indexOf('_EMDASH_')).toBe(-1);
                });
            });

            describe(`En-Dash is used`, () => {
                it(`then will be replaced in translation`, () => {
                    const translation: string = Vue.prototype.$i18n.translate('exemples_avec_characteres_speciaux:olympiques_rivalite', {});
                    expect(translation.indexOf(String.fromCharCode(parseInt(SpecialCharacter.ENDASH, 10)))).toBeGreaterThan(-1);
                    expect(translation.indexOf('_ENDASH_')).toBe(-1);
                });
            });
        });
        describe(`in Default mode`, () => {
            beforeEach(() => {
                let options: I18nPluginOptions = {
                    formatMode: FormatMode.Default
                };

                resetModulPlugins();
                Vue.use(I18nPlugin, options);
                addMessages(Vue, ['utils/i18n/i18n.spec.lang.fr.json']);
            });
            describe(`Non-breaking space is used`, () => {
                it(`then will not be replaced in translation`, () => {
                    const translation: string = Vue.prototype.$i18n.translate('exemples_avec_characteres_speciaux:decompte_medailles_olympiques_canada', { nbMedailles: 30 });
                    expect(translation.indexOf(SpecialCharacter.NBSP)).toBe(-1);
                    expect(translation.indexOf('_NBSP_')).toBeGreaterThan(-1);
                });
            });

            describe(`Non-breaking hypen is used`, () => {
                it(`then will not be replaced in translation`, () => {
                    const translation: string = Vue.prototype.$i18n.translate('exemples_avec_characteres_speciaux:decompte_medailles_olympiques_canada_usa', { nieme: 3 });
                    expect(translation.indexOf(SpecialCharacter.NBHYPHEN)).toBe(-1);
                    expect(translation.indexOf('_NBHYPHEN_')).toBeGreaterThan(-1);
                });
            });

            describe(`Em-Dash is used`, () => {
                it(`then will not be replaced in translation`, () => {
                    const translation: string = Vue.prototype.$i18n.translate('exemples_avec_characteres_speciaux:decompte_medailles_olympiques', { nbMedailles: 3 });
                    expect(translation.indexOf(SpecialCharacter.EMDASH)).toBe(-1);
                    expect(translation.indexOf('_EMDASH_')).toBeGreaterThan(-1);
                });
            });

            describe(`En-Dash is used`, () => {
                it(`then will not be replaced in translation`, () => {
                    const translation: string = Vue.prototype.$i18n.translate('exemples_avec_characteres_speciaux:olympiques_rivalite', {});
                    expect(translation.indexOf(SpecialCharacter.ENDASH)).toBe(-1);
                    expect(translation.indexOf('_ENDASH_')).toBeGreaterThan(-1);
                });
            });
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
