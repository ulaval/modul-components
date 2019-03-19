import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import MButtonPlugin, { MButton } from './button';

describe('MButton', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(MButtonPlugin);
    });

    it('should emit click event when clicked', () => {
        const btn: Wrapper<MButton> = mount(MButton, {
            localVue: localVue
        });

        btn.find('button').trigger('click');

        expect(btn.emitted('click')).toBeTruthy();
    });
});
