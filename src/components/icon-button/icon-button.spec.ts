import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import IconButtonPlugin, { MIconButton } from './icon-button';

describe('MIconButton', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(IconButtonPlugin);
    });

    it('should emit click event when clicked', () => {
        const btn: Wrapper<MIconButton> = mount(MIconButton, {
            localVue: localVue
        });

        btn.find('button').trigger('click');
        expect(btn.emitted('click')).toBeTruthy();
    });
});
