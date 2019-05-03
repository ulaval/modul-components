import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../tests/helpers/render';
import MChipPlugin, { MChip } from './chip';


describe('Chip', () => {
    beforeEach(() => {
        Vue.use(MChipPlugin);
    });
    it('should render correctly', () => {
        const component: Wrapper<MChip> = mount(MChip, {
            localVue: Vue
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });
});
