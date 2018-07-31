import { createLocalVue, mount, Slots, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import VueRouter from 'vue-router';

import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { MPopperPlacement } from '../popper/popper';
import OptionPlugin, { MOption, MOptionsSkin } from './option';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MOption', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        Vue.use(VueRouter);
        localVue = createLocalVue();
        localVue.use(OptionPlugin);
        addMessages(localVue, ['components/option/option.lang.en.json']);
    });

    describe('Menu', () => {
        it('should render correctly', () => {
            const menu: Wrapper<MOption> = mountGroup();

            return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
        });
    });

    describe('Menu', () => {
        it('should render correctly placement top', () => {
            const menu: Wrapper<MOption> = mountGroup({
                placement: MPopperPlacement.Top
            });

            return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
        });
    });

    describe('Menu', () => {
        it('should render correctly placement left', () => {
            const menu: Wrapper<MOption> = mountGroup({
                placement: MPopperPlacement.Left
            });

            return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
        });
    });

    describe('Menu', () => {
        it('should render correctly placement right', () => {
            const menu: Wrapper<MOption> = mountGroup({
                placement: MPopperPlacement.Right
            });

            return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
        });
    });

    it('should render correctly when skin is dark', () => {
        const menu: Wrapper<MOption> = mountGroup({
            skin: MOptionsSkin.Dark
        });

        menu.update();

        return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when skin is light', () => {
        const menu: Wrapper<MOption> = mountGroup({
            skin: MOptionsSkin.Light
        });

        menu.update();

        return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when open title is set', () => {
        const menu: Wrapper<MOption> = mountGroup({
            openTitle: 'Title open'
        });

        menu.update();

        return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when close title is set', () => {
        const menu: Wrapper<MOption> = mountGroup({
            closeTitle: 'Title close',
            open: true
        });

        menu.update();

        return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when size is set', () => {
        const menu: Wrapper<MOption> = mountGroup({
            size: '200px'
        });

        menu.update();

        return expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    it('should emit click event when clicked', () => {
        const menu: Wrapper<MOption> = mountGroup();

        menu.find('.m-option__button').trigger('click');
        expect(menu.emitted('click')).toBeTruthy();

        menu.find('.m-option__button').trigger('click');
        expect(menu.emitted('click')).toBeTruthy();
    });

    it('should react to open prop changes', () => {
        const menu: Wrapper<MOption> = mountGroup();

        menu.setProps({ open: false });
        expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();

        menu.setProps({ open: true });
        expect(renderComponent(menu.vm)).resolves.toMatchSnapshot();
    });

    const mountGroup: (propsData?: object, slots?: Slots) => Wrapper<MOption> = (propsData?: object, slots?: Slots) => {
        return mount(MOption, {
            propsData: propsData,
            slots: {
                default: `<m-option>
                            <m-option-item value="a">A item</m-option-item>
                            <m-option-item value="b">B item</m-option-item>
                            <m-option-item value="c">C item</m-option-item>
                          </m-option>`,
                ...slots
            }
        });
    };

});
