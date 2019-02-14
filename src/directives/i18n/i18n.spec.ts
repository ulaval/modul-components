import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { addMessages } from '../../../tests/helpers/lang';
import I18nPlugin, { FormatMode, I18nPluginOptions } from '../../utils/i18n/i18n';
import I18nDirectivePlugin from './i18n';


describe(`Étant donné la directive v-m-i18n`, () => {
    let element: Wrapper<Vue>;
    beforeEach(() => {
        let options: I18nPluginOptions = {
            formatMode: FormatMode.Vsprintf
        };

        resetModulPlugins();
        Vue.use(I18nDirectivePlugin);
        Vue.use(I18nPlugin, options);
        addMessages(Vue, ['directives/i18n/i18n.spec.lang.fr.json']);
    });

    describe(`Given a title argument`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        '<span v-m-i18n:title="test"></span>'
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute set`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('test');
        });
    });

    describe(`Given a directive with a translatable modifier`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        '<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique></span>'
                },
                { localVue: Vue }
            );
        });
        it(`the attribute should be translated`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Le médaillé olympique');
        });
    });

    describe(`Given a directive with a translatable modifier and a pluralizing value`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        '<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:3}"></span>'
                },
                { localVue: Vue }
            );
        });
        it(`the attribute should be translated and pluralized`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les médaillés olympiques');
        });
    });

    describe(`Given a directive with a translatable modifier and a modifying value`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{modifier:'f'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the attribute should be translated and modified`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('La médaillée olympique');
        });
    });

    describe(`Given a directive with a translatable modifier, and a complex value (nb + class)`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:3, modifier:'f'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the attribute should be translated with the value applied`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les médaillées olympiques');
        });
    });

    describe(`Given a directive with a translatable modifier, and a number value known as a modifier`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:1}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the attribute should be translated with the value applied as a modifier`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Le seul médaillé olympique');
        });
    });

    describe(`Given a directive with a translatable modifier, and a params value`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples_avec_parametres:decompte_athletes_olympiques_pays="{params:{nbAthletes:2925, nbPays:93}}""></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the attribute should be translated and formatted with the params applied`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Il y a 2925 athlètes olympiques et 93 pays participants.');
        });
    });

    describe(`Given a directive with a translatable modifier, and a complex value (params + class)`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples_avec_parametres:decompte_athletes_olympiques_pays="{modifier:'f', params:{nbAthletes:2925, nbPays:93}}""></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the attribute should be translated, formatted with the params applied and modified`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Il y a 2925 femmes athlètes olympiques et 93 pays participants.');
        });
    });

    /*  we don't use modifiers like "medaille-olympique.f" in the directive for now,
        keep the tests in case we do some day

    describe(`Given the argument :title.exemples-avec-nombre-genre:medaille-olympique.f`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique.f></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "La médaillée olympique"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('La médaillée olympique');
        });
    });

    describe(`Given the argument :title.exemples-avec-nombre-genre:medaille-olympique.f="{nb:2}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique.f="{nb:2}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "Les deux seules médaillées olympiques"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les deux seules médaillées olympiques');
        });
    });

    describe(`Given the argument :title.exemples-avec-nombre-genre:medaille-olympique="{nb:2, modifier:'m'}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:2, modifier:'m'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "Les médaillés olympiques masculins"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les médaillés olympiques masculins');
        });
    });

    describe(`Given the argument :title.exemples-avec-nombre-genre:medaille-olympique.f="{nb:3, modifier:'m'}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique.f="{nb:3, modifier:'m'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "Les médaillés olympiques masculins"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les médaillés olympiques masculins');
        });
    }); */
});
