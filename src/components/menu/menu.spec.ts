import { createLocalVue, mount, Wrapper, Slots } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import VueRouter from 'vue-router';
import uuid from '../../utils/uuid/uuid';

import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import { MPopperPlacement } from '../popper/popper';
import MenuPlugin, { MMenu, MOptionsMenuSkin } from './menu';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MMenu', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        Vue.use(VueRouter);
        localVue = createLocalVue();
        localVue.use(MenuPlugin);
        addMessages(localVue, ['components/menu/menu.lang.en.json']);
    });

    describe('Menu', () => {
        it('should render correctly', () => {
            const menu = mountGroup();

            return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
        });
    });

    describe('Menu', () => {
        it('should render correctly placement top', () => {
            const menu = mountGroup({
                placement: MPopperPlacement.Top
            });

            return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
        });
    });

    describe('Menu', () => {
        it('should render correctly placement left', () => {
            const menu = mountGroup({
                placement: MPopperPlacement.Left
            });

            return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
        });
    });

    describe('Menu', () => {
        it('should render correctly placement right', () => {
            const menu = mountGroup({
                placement: MPopperPlacement.Right
            });

            return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
        });
    });

    it('should render correctly when skin is dark', () => {
        const menu = mountGroup({
            skin: MOptionsMenuSkin.Dark
        });

        menu.update();

        return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when skin is light', () => {
        const menu = mountGroup({
            skin: MOptionsMenuSkin.Light
        });

        menu.update();

        return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when open title is set', () => {
        const menu = mountGroup({
            openTitle: 'Title open'
        });

        menu.update();

        return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when close title is set', () => {
        const menu = mountGroup({
            closeTitle: 'Title close',
            open: true
        });

        menu.update();

        return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when size is set', () => {
        const menu = mountGroup({
            size: '200px'
        });

        menu.update();

        return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should emit click event when clicked', () => {
        const menu = mountGroup();

        menu.find('.m-menu__button').trigger('click');
        expect(menu.emitted('click')).toBeTruthy();

        menu.find('.m-menu__button').trigger('click');
        expect(menu.emitted('click')).toBeTruthy();
    });

    it('should react to open prop changes', () => {
        const menu = mountGroup();

        menu.setProps({ open: false });
        expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();

        menu.setProps({ open: true });
        expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    const mountGroup = (propsData?: object, slots?: Slots) => {
        return mount(MMenu, {
            propsData: propsData,
            slots: {
                default: `<m-menu>
                            <m-menu-item value="a">A item</m-menu-item>
                            <m-menu-item value="b">B item</m-menu-item>
                            <m-menu-item value="c">C item</m-menu-item>
                          </m-menu>`,
                ...slots
            }
        });
    };

});
