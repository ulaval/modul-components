import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../../tests/helpers/render';
import MChipDeletePlugin, { MChipDelete } from './chip-delete';


describe('Chip', () => {
    beforeEach(() => {
        Vue.use(MChipDeletePlugin);
    });
    it('should render correctly', () => {
        const component: Wrapper<MChipDelete> = mount(MChipDelete, {
            localVue: Vue
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });
});
