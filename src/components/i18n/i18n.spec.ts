import { createLocalVue, mount } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import MI18nPlugin, { MI18n } from './i18n';

describe('MI18n', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(MI18nPlugin);
        addMessages(localVue, ['components/i18n/i18n.spec.lang.fr.json']);
    });

    it('should render correctly', () => {
        const i18n = mount(MI18n, {
            localVue: localVue,
            propsData: {
                k: 'm-i18n-spec:a'
            }
        });

        return expect(renderComponent(i18n.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly with params', () => {
        const i18n = mount(MI18n, {
            localVue: localVue,
            propsData: {
                k: 'm-i18n-spec:with-params',
                params: ['a', 'b']
            }
        });

        return expect(renderComponent(i18n.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly with html encoding', () => {
        const i18n = mount(MI18n, {
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
        jest.spyOn(console, 'warn');

        const i18n = mount(MI18n, {
            localVue: localVue,
            propsData: {
                k: 'undefined:key'
            }
        });

        expect(console.warn).toHaveBeenCalledWith(
            'The key undefined:key does not exist. Current lang: en'
        );
    });
});
