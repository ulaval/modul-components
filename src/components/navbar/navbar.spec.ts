import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import { MNavbarItem } from '../navbar-item/navbar-item';
import NavbarPlugin, { MNavbar } from './navbar';

describe('MNavbar', () => {
    let localVue: VueConstructor<Vue>;

    const slots: any = {
        default: `
            <m-navbar-item value="item1"></m-navbar-item>
            <m-navbar-item value="item2"></m-navbar-item>
            <m-navbar-item value="item3"></m-navbar-item>`
    };

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(NavbarPlugin);
    });

    it('should render correctly', () => {
        const wrapper: Wrapper<MNavbar> = mount(MNavbar, {
            localVue: localVue,
            slots: slots
        });

        expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
    });

    it('should select the child value passed by the props', () => {
        const wrapper: Wrapper<MNavbar> = mount(MNavbar, {
            localVue: localVue,
            propsData: {
                selected: 'item2'
            },
            slots: slots
        });

        const selectedItem: WrapperArray<MNavbarItem> = wrapper.findAll<MNavbarItem>({ name: 'MNavbarItem' });
        expect(selectedItem.at(0).vm.isSelected).toEqual(false);
        expect(selectedItem.at(1).vm.isSelected).toEqual(true);
        expect(selectedItem.at(2).vm.isSelected).toEqual(false);
    });

    it('dummy test', () => {
        expect(true).toBeTruthy();
    });
});
