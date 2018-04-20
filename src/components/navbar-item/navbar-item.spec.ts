import { createLocalVue, mount } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import NavbarItemPlugin, { MNavbarItem, BaseNavbar, Navbar } from './navbar-item';
import { MNavbar } from '../navbar/navbar';

describe('MNavbarItem', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(NavbarItemPlugin);
    });

    const defaultSlot = {
        default: `navbar item content`
    };

    it('should render correctly', () => {
        const wrapper = mount(MNavbarItem, {
            localVue: localVue,
            slots: defaultSlot
        });

        expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled', () => {
        const wrapper = mount(MNavbarItem, {
            localVue: localVue,
            slots: defaultSlot,
            propsData: {
                disabled: true
            }
        });
        expect(wrapper.classes()).toContain('m--is-disabled');
        expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
    });
});
