import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { resetModulPlugins } from '../../../tests/helpers/component';
import { renderComponent } from '../../../tests/helpers/render';
import IconFilePluggin from '../../components/icon-file/icon-file';
import BadgePlugin, { MBadgeState } from './badge';

describe('MBadge', () => {
    const getBadgeDirective: (bindingValue: MBadgeState) => Wrapper<Vue> =
    (bindingValue: MBadgeState) => {
        return mount({
            template: `<m-icon-file v-m-badge="{ state: 'completed' }" :size="'100px'" :extension="'pdf'"></m-icon-file>`,
            data: () => bindingValue
        }, { localVue: Vue });
    };

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(IconFilePluggin);
        Vue.use(BadgePlugin);
    });

    it(`should render correctly`, () => {
        const badge = getBadgeDirective(MBadgeState.Completed);
        return expect(renderComponent(badge.vm)).resolves.toMatchSnapshot();
    });
});
