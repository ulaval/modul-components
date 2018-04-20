import { resetModulPlugins } from '../../../tests/helpers/component';
import Vue, { VueConstructor } from 'vue';
import { Wrapper, mount } from '@vue/test-utils';
import I18nPlugin, { I18nPluginOptions, FORMAT_MODE } from '../../utils/i18n/i18n';
import { addMessages } from '../../../tests/helpers/lang';
import I18nFilterPlugin from './i18n';

describe(`Étant donné le filtre f-m-i18n`, () => {
    let element: Wrapper<Vue>;
    beforeEach(() => {
        let localVue: VueConstructor<Vue>;
        let options: I18nPluginOptions = {
            formatMode: FORMAT_MODE.VSSPRINTF
        };

        resetModulPlugins();
        Vue.use(I18nPlugin, options);
        Vue.use(I18nFilterPlugin);
        addMessages(Vue, ['filters/i18n/i18n.spec.lang.fr.json']);
    });

    describe(`giving the filter {{ exemples-avec-nombre-genre:medaille-olympique | f-m-i18n({}, 2, 'f') }}`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span>{{ 'exemples-avec-nombre-genre:medaille-olympique' | f-m-i18n({}, 2, 'f') }}</span>`
                },
                { localVue: Vue }
            );
        });
        it(`the span's content should be "Les deux seules médaillées olympiques"`, () => {
            expect(element.vm.$el.textContent).toEqual('Les deux seules médaillées olympiques');
        });
    });

    describe(`Giving the attribute :title="'exemples-avec-nombre-genre:medaille-olympique' | f-m-i18n({nb:2, modifier:'f'})"`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span :title="'exemples-avec-nombre-genre:medaille-olympique' | f-m-i18n({nb:2, modifier:'f'})"></span>`
                },
                { localVue: Vue }
            );
        });
        it(`the element should have the title attribute "Les deux seules médaillées olympiques"`, () => {
            expect(element.vm.$el.getAttribute('title')).toEqual('Les deux seules médaillées olympiques');
        });
    });
});
