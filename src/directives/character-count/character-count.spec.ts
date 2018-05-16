import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { resetModulPlugins } from '../../../tests/helpers/component';
import { renderComponent } from '../../../tests/helpers/render';
import CharacterCountPlugin from './character-count';

describe('MCharacterCount', () => {
    const getCharacterCountDirective: (bindingValue) => Wrapper<Vue> =
    (bindingValue) => {
        return mount({
            template: `<m-textfield v-m-character-count></m-textfield>`,
            data: () => bindingValue
        }, { localVue: Vue });
    };

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(CharacterCountPlugin);
    });

    it(`should render correctly`, () => {
        const badge = getCharacterCountDirective('MBadgeState.Completed');
        return expect(renderComponent(badge.vm)).resolves.toMatchSnapshot();
    });
});
