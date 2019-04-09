import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { renderComponent } from '../../../tests/helpers/render';
import IconFilePluggin from '../../components/icon-file/icon-file';
import BadgePlugin from './badge';

// to be replaced with storybook @
describe('MBadge', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        localVue.use(IconFilePluggin);
        localVue.use(BadgePlugin);
    });

    it(`should render correctly`, () => {
        const badge: Wrapper<Vue> = mount({
            template: `<m-icon-file v-m-badge="{ state: 'completed' }" :size="'100px'" :extension="'pdf'"></m-icon-file>`
        }, { localVue: localVue });
        return expect(renderComponent(badge.vm)).resolves.toMatchSnapshot();
    });
});
