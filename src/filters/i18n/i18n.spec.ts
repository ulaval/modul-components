import { resetModulPlugins } from '../../../tests/helpers/component';
import Vue, { VueConstructor } from 'vue';
import { Wrapper, mount } from '@vue/test-utils';
import I18nPlugin, { I18nPluginOptions } from '../../utils/i18n/i18n';
import { addMessages } from '../../../tests/helpers/lang';
import './i18n';

describe(`Étant donné le filtre f-m-i18n`, () => {
    let element: Wrapper<Vue>;
    beforeEach(() => {
        let localVue: VueConstructor<Vue>;
        let options: I18nPluginOptions = {
            formatMode: 'vsprintf'
        };

        resetModulPlugins();
        Vue.use(I18nPlugin, options);
        addMessages(Vue, ['filters/i18n/i18n.spec.lang.fr.json']);
    });

    describe(`Étant donné le filtre {{ exemples-avec-nombre-genre:medaille-olympique | f-m-i18n({}, 2, 'f') }}`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span>{{ 'exemples-avec-nombre-genre:medaille-olympique' | f-m-i18n({}, 2, 'f') }}</span>`
                },
                { localVue: Vue }
            );
        });
        it(`le span devrait contenir "Les deux seules médaillées olympiques"`, () => {
            expect(element.vm.$el.textContent).toEqual('Les deux seules médaillées olympiques');
        });
    });

    describe(`Étant donné l'attribut :title="'exemples-avec-nombre-genre:medaille-olympique' | f-m-i18n({}, 2, 'f')"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span :title="'exemples-avec-nombre-genre:medaille-olympique' | f-m-i18n({}, 2, 'f')"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "Les deux seules médaillées olympiques"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les deux seules médaillées olympiques');
        });
    });

    describe(`Étant donné l'attribut :title="'exemples-avec-nombre-genre:medaille-olympique' | f-m-i18n({nb:2, modifier:'f'})"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span :title="'exemples-avec-nombre-genre:medaille-olympique' | f-m-i18n({nb:2, modifier:'f'})"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`l'élément devrait avoir le titre "Les deux seules médaillées olympiques"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les deux seules médaillées olympiques');
        });
    });
});
