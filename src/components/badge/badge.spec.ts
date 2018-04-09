import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import BadgePlugin, { MBadge } from './badge';

describe('MBadge', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BadgePlugin);
    });

    it('should render correctly', () => {
        const badge = mount(MBadge, {
            localVue: localVue
        });

        return expect(renderComponent(badge.vm)).resolves.toMatchSnapshot();
    });
});
