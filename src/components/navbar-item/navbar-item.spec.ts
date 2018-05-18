import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import NavbarItemPlugin, { MNavbarItem } from './navbar-item';

describe('MNavbarItem', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(NavbarItemPlugin);
    });

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
});
