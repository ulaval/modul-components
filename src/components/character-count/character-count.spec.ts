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

    it('should render correctly when maxLength prop is set', () => {
        const chkbox: Wrapper<MCharacterCount> = mount(MCharacterCount, {
            localVue: Vue,
            propsData: {
                valueLength: 20,
                maxLength: 40
            }
        });
        return expect(renderComponent(chkbox.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when transition props is false', () => {
        const chkbox: Wrapper<MCharacterCount> = mount(MCharacterCount, {
            localVue: Vue,
            propsData: {
                valueLength: 20,
                maxLength: 40,
                transition: false
            }
        });
        return expect(renderComponent(chkbox.vm)).resolves.toMatchSnapshot();
    });
});
