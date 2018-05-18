import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { resetModulPlugins } from '../../../tests/helpers/component';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import I18nPlugin, { FormatMode, I18nPluginOptions } from '../../utils/i18n/i18n';
import MI18nPlugin, { MI18n } from './i18n';

describe('MI18n', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(MI18nPlugin);
        addMessages(localVue, ['components/i18n/i18n.spec.lang.fr.json']);
    });

    it('should render correctly', () => {
        const i18n: Wrapper<MI18n> = mount(MI18n, {
            localVue: localVue,
            propsData: {
                k: 'm-i18n-spec:a'
            }
        });

        return expect(renderComponent(i18n.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly with params', () => {
        const i18n: Wrapper<MI18n> = mount(MI18n, {
            localVue: localVue,
            propsData: {
                k: 'm-i18n-spec:with-params',
                params: ['a', 'b']
            }
        });

        return expect(renderComponent(i18n.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly in plural form', async () => {
        const i18n: Wrapper<MI18n> = mount(MI18n, {
            localVue: localVue,
            propsData: {
                k: 'm-i18n-spec:plural-test',
                nb: 1
            }
        });

        expect(await renderComponent(i18n.vm)).toMatchSnapshot('single');

        i18n.setProps({ nb: 2 });
        expect(await renderComponent(i18n.vm)).toMatchSnapshot('plural');
    });

    it('should render correctly with modifier', async () => {
        const i18n: Wrapper<MI18n> = mount(MI18n, {
            localVue: localVue,
            propsData: {
                k: 'm-i18n-spec:modifier-test',
                nb: 1
            }
        });

        expect(await renderComponent(i18n.vm)).toMatchSnapshot('not modified');
        i18n.setProps({ modifier: 'm' });
        expect(await renderComponent(i18n.vm)).toMatchSnapshot('modified');
    });

    it('should render correctly with html encoding', () => {
        const i18n: Wrapper<MI18n> = mount(MI18n, {
            localVue: localVue,
            propsData: {
                k: 'm-i18n-spec:html-encode',
                params: ['<i>', '</i>'],
                'html-encode': true
            }
        });

        return expect(renderComponent(i18n.vm)).resolves.toMatchSnapshot();
    });

    it('should warn if key not defined', () => {
        jest.spyOn(localVue.prototype.$log, 'warn');

        const i18n: Wrapper<MI18n> = mount(MI18n, {
            localVue: localVue,
            propsData: {
                k: 'undefined:key'
            }
        });

        expect(localVue.prototype.$log.warn).toHaveBeenCalledWith(
            'The key undefined:key does not exist. Current lang: en'
        );
    });

    describe(`given the formatOption = 'vsprintf'`, () => {
        beforeEach(() => {
            let options: I18nPluginOptions = {
                formatMode: FormatMode.Vsprintf
            };
            resetModulPlugins();
            Vue.use(I18nPlugin, options);
            addMessages(localVue, ['components/i18n/i18n.spec.lang.fr.json']);
        });
        it('should render correctly with params as object', async () => {
            const i18n: Wrapper<MI18n> = mount(MI18n, {
                localVue: localVue,
                propsData: {
                    k: 'm-i18n-spec:decompte_athletes_olympiques_pays',
                    params: { nbAthletes: 2925, nbPays: 93 }
                }
            });

            expect(await renderComponent(i18n.vm)).toMatchSnapshot('with parameters');
        });
    });
});
