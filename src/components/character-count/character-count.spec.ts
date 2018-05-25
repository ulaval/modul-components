import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import CharacterCountPlugin, { MCharacterCount } from './character-count';

describe('MCharacterCount', () => {
    beforeEach(() => {
        Vue.use(CharacterCountPlugin);
    });
    it('should render correctly', () => {
        const component: Wrapper<MCharacterCount> = mount(MCharacterCount, {
            localVue: Vue
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });
});
