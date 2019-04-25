import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import IconPlugin, { MIcon } from './icon';

describe('MIcon', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(IconPlugin);
    });


    it('should emit click event when icon is clicked', () => {
        const icon: Wrapper<MIcon> = mount(MIcon, {
            localVue: localVue
        });

        icon.trigger('click');

        expect(icon.emitted('click')).toBeTruthy();
    });
});
