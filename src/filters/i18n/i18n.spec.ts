import { resetModulPlugins } from '../../../tests/helpers/component';
import Vue, { VueConstructor } from 'vue';
import { Wrapper, mount } from '@vue/test-utils';
import I18nPlugin, { I18nPluginOptions, FormatMode } from '../../utils/i18n/i18n';
import { addMessages } from '../../../tests/helpers/lang';
import I18nFilterPlugin from './i18n';

describe(`Étant donné le filtre f-m-i18n`, () => {
    let element: Wrapper<Vue>;
    beforeEach(() => {
        let localVue: VueConstructor<Vue>;
        let options: I18nPluginOptions = {
            formatMode: FormatMode.Vsprintf
        };

        resetModulPlugins();
        Vue.use(I18nPlugin, options);
        Vue.use(I18nFilterPlugin);
        addMessages(Vue, ['filters/i18n/i18n.spec.lang.fr.json']);
    });

    describe(`Given a filter with a number and a class modifiers`, () => {
        beforeEach(() => {
            element = mount(
                {
                    template:
                        `<span>{{ 'exemples-avec-nombre-genre:medaille-olympique' | f-m-i18n({}, 2, 'f') }}</span>`
                },
                { localVue: Vue }
            );
        });
        it(`the result should be a string with the number and the class modifiers applied`, () => {
            expect(element.vm.$el.textContent).toEqual('Les deux seules médaillées olympiques');
        });
    });
});
