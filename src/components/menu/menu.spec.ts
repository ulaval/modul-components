import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import VueRouter from 'vue-router';
import uuid from '../../utils/uuid/uuid';
import MenuPlugin, { MMenu } from './menu';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MMenu', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        Vue.use(VueRouter);
        localVue = createLocalVue();
        localVue.use(MenuPlugin);
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

});
