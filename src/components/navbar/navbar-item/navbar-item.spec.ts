import { createLocalVue, mount, shallowMount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { renderComponent } from '../../../../tests/helpers/render';
import ModulPlugin from '../../../utils/modul/modul';
import { MNavbar } from '../../navbar/navbar';
import { MNavbarItem } from './navbar-item';
import NavbarItemHelper from './navbar-item-helper';

let mockIsRouterLinkActive: boolean = false;

jest.mock('./navbar-item-helper', () => ({
    isRouterLinkActive: jest.fn(() => mockIsRouterLinkActive)
}));

describe('MNavbarItem', () => {
    let wrapper: Wrapper<MNavbarItem>;
    let parentNavbar: Wrapper<MNavbar>;
    let localVue: VueConstructor<Vue>;
    beforeEach(() => {
        mockIsRouterLinkActive = false;
        Vue.use(ModulPlugin);
        localVue = createLocalVue();
        parentNavbar = shallowMount(MNavbar);
    });

    const initializeWrapper: (initialPropValues: any)
        => Wrapper<MNavbarItem> = (initialPropValues: any = {}) => {
            document.querySelector = () => true;
            wrapper = shallowMount(MNavbarItem, {
                methods: {
                    getParent(): MNavbar {
                        return parentNavbar.vm;
                    }
                },
                propsData: initialPropValues
            });

            return wrapper;
        };

    const defaultSlot: any = {
        default: `navbar item content`
    };

    it('should render correctly', () => {
        const wrapper: Wrapper<MNavbarItem> = mount(MNavbarItem, {
            localVue: localVue,
            slots: defaultSlot
        });

        expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled', () => {
        const wrapper: Wrapper<MNavbarItem> = mount(MNavbarItem, {
            localVue: localVue,
            slots: defaultSlot,
            propsData: {
                disabled: true
            }
        });
        expect(wrapper.classes()).toContain('m--is-disabled');
        expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
    });

    describe('given parent Navbar has autoselect set to true', () => {
        beforeEach(() => {
            parentNavbar = shallowMount(MNavbar);
            parentNavbar.setProps({ autoSelect: true });
            parentNavbar.vm.updateValue = jest.fn();
        });

        it('should set parentNavbar value if current item is router-link-active', () => {
            mockIsRouterLinkActive = true;
            jest.spyOn(parentNavbar.vm, 'updateValue');
            jest.spyOn(NavbarItemHelper, 'isRouterLinkActive');

            initializeWrapper({ value: 'someValue' });

            expect(NavbarItemHelper.isRouterLinkActive).toHaveBeenCalledWith(wrapper.vm);
            expect(parentNavbar.vm.updateValue).toHaveBeenCalledWith('someValue');
        });

        it('should not set parentNavbar value if current item is not router-link-active', () => {
            mockIsRouterLinkActive = false;
            jest.spyOn(parentNavbar.vm, 'updateValue');
            jest.spyOn(NavbarItemHelper, 'isRouterLinkActive');

            initializeWrapper({ value: 'someValue' });

            expect(NavbarItemHelper.isRouterLinkActive).toHaveBeenCalledWith(wrapper.vm);
            expect(parentNavbar.vm.updateValue).not.toHaveBeenCalled();
        });
    });

    describe('given parent Navbar has autoselect set to false', () => {
        beforeEach(() => {
            parentNavbar = shallowMount(MNavbar);
            parentNavbar.setProps({ autoSelect: false });
        });

        it('should not set parentNavbar value if current item is router-link-active', () => {
            mockIsRouterLinkActive = true;
            jest.spyOn(parentNavbar.vm, 'updateValue');
            jest.spyOn(NavbarItemHelper, 'isRouterLinkActive');

            initializeWrapper({ value: 'someValue' });

            expect(NavbarItemHelper.isRouterLinkActive).not.toHaveBeenCalledWith(wrapper.vm);
            expect(parentNavbar.vm.updateValue).not.toHaveBeenCalled();
        });

        it('should not set parentNavbar value if current item is not router-link-active', () => {
            mockIsRouterLinkActive = false;
            jest.spyOn(parentNavbar.vm, 'updateValue');
            jest.spyOn(NavbarItemHelper, 'isRouterLinkActive');

            initializeWrapper({ value: 'someValue' });

            expect(NavbarItemHelper.isRouterLinkActive).not.toHaveBeenCalledWith(wrapper.vm);
            expect(parentNavbar.vm.updateValue).not.toHaveBeenCalled();
        });
    });
});
