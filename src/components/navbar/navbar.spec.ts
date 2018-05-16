import { createLocalVue, mount } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import NavbarPlugin, { MNavbar } from './navbar';
import { MNavbarItem } from '../navbar-item/navbar-item';

describe('MNavbar', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(NavbarPlugin);
    });

    it('should render correctly', () => {

        const wrapper = mount({
            template: `
        <m-navbar selected='item1'>
            <m-navbar-item value="item1"></m-navbar-item>
            <m-navbar-item value="item2"></m-navbar-item>
            <m-navbar-item value="item3"></m-navbar-item>
        </m-navbar>` },
            { localVue });

        expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
    });

    it('should select the child value passed by the props', () => {
        const wrapper = mount({
            template: `
        <m-navbar selected='item2'>
            <m-navbar-item value="item1"></m-navbar-item>
            <m-navbar-item value="item2"></m-navbar-item>
            <m-navbar-item value="item3"></m-navbar-item>
        </m-navbar>` },
            {
                localVue: localVue
            });

        const selectedItem = wrapper.findAll<MNavbarItem>({ name: 'MNavbarItem' });
        expect(selectedItem.at(0).vm.isSelected).toEqual(false);
        expect(selectedItem.at(1).vm.isSelected).toEqual(true);
        expect(selectedItem.at(2).vm.isSelected).toEqual(false);
    });

    it('dummy test', () => {
        expect(true).toBeTruthy();
    });
});
