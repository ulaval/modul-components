import { resetModulPlugins } from '../../../tests/helpers/component';
import Vue from 'vue';
import I18nDirectivePlugin from './i18n';
import { Wrapper, mount } from '@vue/test-utils';
import I18nPlugin, { I18nPluginOptions } from '../../utils/i18n/i18n';
import { addMessages } from '../../../tests/helpers/lang';

describe(`Étant donné la directive v-m-i18n`, () => {
    let element: Wrapper<Vue>;
    beforeEach(() => {
        resetModulPlugins();
        Vue.use(I18nDirectivePlugin);
        Vue.use(I18nPlugin);
        addMessages(Vue, ['directives/i18n/i18n.spec.lang.fr.json']);
    });

    describe(`Étant donné l'argument :title="test"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        '<span v-m-i18n:title="test"></span>'
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "test"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('test');
        });
    });

    describe(`Étant donné l'argument :placeholder="test" sur un input`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        '<input v-m-i18n:placeholder="test"></input>'
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le placeholder "test"`, () => {
            expect(element.vm.$el.getAttribute('placeholder')).toEqual('test');
        });
    });

    describe(`Étant donné l'argument :title.exemples-avec-nombre-genre:medaille-olympique`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        '<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique></span>'
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "Le médaillé olympique"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Le médaillé olympique');
        });
    });

    describe(`Étant donné l'argument :title.exemples-avec-nombre-genre:medaille-olympique="{nb:3}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        '<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:3}"></span>'
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "Les médaillés olympiques"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les médaillés olympiques');
        });
    });

    describe(`Étant donné l'argument :title.exemples-avec-nombre-genre:medaille-olympique="{modifier:'f'}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{modifier:'f'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "La médaillée olympique"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('La médaillée olympique');
        });
    });

    describe(`Étant donné l'argument :title.exemples-avec-nombre-genre:medaille-olympique="{nb:3, modifier:'f'}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:3, modifier:'f'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "Les médaillées olympiques"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les médaillées olympiques');
        });
    });

    describe(`Étant donné l'argument :title.exemples-avec-nombre-genre:medaille-olympique="{nb:1, modifier:'f'}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:1, modifier:'f'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "La seule médaillée olympique"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('La seule médaillée olympique');
        });
    });

    describe(`Étant donné l'argument :title.exemples-avec-nombre-genre:medaille-olympique="{nb:2}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:2}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "Les deux seuls médaillés olympiques"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les deux seuls médaillés olympiques');
        });
    });

    describe(`Étant donné l'argument :title.exemples-avec-nombre-genre:medaille-olympique="{nb:2, modifier:'f'}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:2, modifier:'f'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "Les deux seules médaillées olympiques"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les deux seules médaillées olympiques');
        });
    });

    /*  we don't use modifiers like "medaille-olympique.f" in the directive for now,
        keep the tests in case we do some day

    describe(`Étant donné l'argument :title.exemples-avec-nombre-genre:medaille-olympique.f`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique.f></span>`
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "La médaillée olympique"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('La médaillée olympique');
        });
    });

    describe(`Étant donné l'argument :title.exemples-avec-nombre-genre:medaille-olympique.f="{nb:2}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique.f="{nb:2}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "Les deux seules médaillées olympiques"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les deux seules médaillées olympiques');
        });
    });

    describe(`Étant donné l'argument :title.exemples-avec-nombre-genre:medaille-olympique="{nb:2, modifier:'m'}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique="{nb:2, modifier:'m'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "Les médaillés olympiques masculins"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les médaillés olympiques masculins');
        });
    });

    describe(`Étant donné l'argument :title.exemples-avec-nombre-genre:medaille-olympique.f="{nb:3, modifier:'m'}"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span v-m-i18n:title.exemples-avec-nombre-genre:medaille-olympique.f="{nb:3, modifier:'m'}"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "Les médaillés olympiques masculins"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les médaillés olympiques masculins');
        });
    }); */
});
