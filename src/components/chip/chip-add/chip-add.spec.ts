import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../../tests/helpers/render';
import MChipAddPlugin, { MChipAdd } from './chip-add';


describe('Chip', () => {
    beforeEach(() => {
        Vue.use(MChipAddPlugin);
    });
    it('should render correctly', () => {
        const component: Wrapper<MChipAdd> = mount(MChipAdd, {
            localVue: Vue
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });
});
