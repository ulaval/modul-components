import { resetModulPlugins } from '../../../tests/helpers/component';
import Vue from 'vue';
import I18nDirectivePlugin from './i18n';
import { Wrapper, mount } from '@vue/test-utils';
import I18nPlugin, { I18nPluginOptions, FORMAT_MODE } from '../../utils/i18n/i18n';
import { addMessages } from '../../../tests/helpers/lang';

describe(`Étant donné la directive v-m-i18n`, () => {
    let element: Wrapper<Vue>;
    beforeEach(() => {
        let options: I18nPluginOptions = {
            formatMode: FORMAT_MODE.VSSPRINTF
        };

        resetModulPlugins();
        Vue.use(I18nDirectivePlugin);
        Vue.use(I18nPlugin, options);
        addMessages(Vue, ['directives/i18n/i18n.spec.lang.fr.json']);
    });

    describe(`Giving the argument :title="test"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        '<span v-m-i18n:title="test"></span>'
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "test"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('test');
        });
    });

    describe(`Giving the argument :title.exemples-avec-nombre-genre:medaille-olympique`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        '<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique></span>'
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "Le médaillé olympique"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Le médaillé olympique');
        });
    });

    describe(`Giving the argument :title.exemples-avec-nombre-genre:medaille-olympique="{nb:3}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        '<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:3}"></span>'
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "Les médaillés olympiques"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les médaillés olympiques');
        });
    });

    describe(`Giving the argument :title.exemples-avec-nombre-genre:medaille-olympique="{modifier:'f'}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{modifier:'f'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "La médaillée olympique"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('La médaillée olympique');
        });
    });

    describe(`Giving the argument :title.exemples-avec-nombre-genre:medaille-olympique="{nb:3, modifier:'f'}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:3, modifier:'f'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "Les médaillées olympiques"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les médaillées olympiques');
        });
    });

    describe(`Giving the argument :title.exemples-avec-nombre-genre:medaille-olympique="{nb:1, modifier:'f'}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:1, modifier:'f'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "La seule médaillée olympique"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('La seule médaillée olympique');
        });
    });

    describe(`Giving the argument :title.exemples-avec-nombre-genre:medaille-olympique="{nb:2}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:1}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "Le seul médaillé olympique"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Le seul médaillé olympique');
        });
    });

    describe(`Giving the argument :title.decompte_athletes_olympiques_pays="{params:{nbAthletes:2925, nbPays:93}}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples_avec_parametres:decompte_athletes_olympiques_pays="{params:{nbAthletes:2925, nbPays:93}}""></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "Il y a 2925 athlètes olympiques et 93 pays participants."`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Il y a 2925 athlètes olympiques et 93 pays participants.');
        });
    });

    describe(`Giving the argument :title.decompte_athletes_olympiques_pays="{modifier:'f', params:{nbAthletes:2925, nbPays:93}}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples_avec_parametres:decompte_athletes_olympiques_pays="{modifier:'f', params:{nbAthletes:2925, nbPays:93}}""></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "Il y a 2925 femmes athlètes olympiques et 93 pays participants."`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Il y a 2925 femmes athlètes olympiques et 93 pays participants.');
        });
    });

    /*  we don't use modifiers like "medaille-olympique.f" in the directive for now,
        keep the tests in case we do some day

    describe(`Giving the argument :title.exemples-avec-nombre-genre:medaille-olympique.f`, () => {
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

    describe(`Giving the argument :title.exemples-avec-nombre-genre:medaille-olympique.f="{nb:2}"`, () => {
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

    describe(`Giving the argument :title.exemples-avec-nombre-genre:medaille-olympique="{nb:2, modifier:'m'}"`, () => {
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

    describe(`Giving the argument :title.exemples-avec-nombre-genre:medaille-olympique.f="{nb:3, modifier:'m'}"`, () => {
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
