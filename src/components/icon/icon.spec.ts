import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import IconPlugin, { MIcon } from './icon';

describe('MIcon', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(IconPlugin);
    });

    it('should render correctly', () => {
        const icon: Wrapper<MIcon> = mount(MIcon, {
            localVue: localVue,
            propsData: {
                name: 'options',
                size: '20px'
            }
        });

        return expect(renderComponent(icon.vm)).resolves.toMatchSnapshot();
    });

    it('should render title when svgTitle prop is set', () => {
        const icon: Wrapper<MIcon> = mount(MIcon, {
            localVue: localVue,
            propsData: {
                svgTitle: 'options'
            }
        });

        return expect(renderComponent(icon.vm)).resolves.toMatchSnapshot();
    });

    it('should emit click event when icon is clicked', () => {
        const icon: Wrapper<MIcon> = mount(MIcon, {
            localVue: localVue
        });

        icon.trigger('click');

        expect(icon.emitted('click')).toBeTruthy();
    });
});
