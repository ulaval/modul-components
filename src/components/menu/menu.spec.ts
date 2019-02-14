import { createLocalVue, mount, Slots, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import VueRouter from 'vue-router';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import MenuPlugin, { MMenu, MMenuSkin } from './menu';


jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MMenu', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        Vue.use(VueRouter);
        localVue = createLocalVue();
        localVue.use(MenuPlugin);
    });

    describe('Menu', () => {
        it('should render correctly', () => {
            const menu: Wrapper<MMenu> = mountGroup();

            return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
        });
    });

    it('should render correctly when skin is dark', () => {
        const menu: Wrapper<MMenu> = mountGroup({
            skin: MMenuSkin.Dark
        });

        return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when skin is light', () => {
        const menu: Wrapper<MMenu> = mountGroup({
            skin: MMenuSkin.Light
        });

        return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should emit click event when clicked', () => {
        const menu: Wrapper<MMenu> = mount(MMenu, {
            localVue: localVue,
            slots: {
                trigger: 'Menu'
            }
        });

        menu.find('.m-menu__trigger').trigger('click');
        expect(menu.emitted('click')).toBeTruthy();

        menu.find('.m-menu__trigger').trigger('click');
        expect(menu.emitted('click')).toBeTruthy();
    });

    it('should react to open prop changes', () => {
        const menu: Wrapper<MMenu> = mountGroup();

        menu.setProps({ open: false });
        expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();

        menu.setProps({ open: true });
        expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should react to disabled prop changes', () => {
        const menu: Wrapper<MMenu> = mountGroup();

        menu.setProps({ disabled: false });
        expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();

        menu.setProps({ disabled: true });
        expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    const mountGroup: (propsData?: object, slots?: Slots) => Wrapper<MMenu> = (propsData?: object, slots?: Slots) => {
        return mount(MMenu, {
            propsData: propsData,
            slots: {
                default: `<m-menu-item value="a">A item</m-menu-item>
                          <m-menu-item value="b">B item</m-menu-item>
                          <m-menu-item value="c">C item</m-menu-item>`,
                ...slots
            }
        });
    };

});
