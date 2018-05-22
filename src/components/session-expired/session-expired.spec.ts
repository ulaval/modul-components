import Vue from 'vue';
import { mount, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../tests/helpers/render';
import SessionExpiredPlugin, { MSessionExpired } from './session-expired';

describe('MSessionExpired', () => {
    beforeEach(() => {
        Vue.use(SessionExpiredPlugin);
    });
    it('should render correctly', () => {
        const component: Wrapper<MSessionExpired> = mount(MSessionExpired, {
            localVue: Vue
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly with back-to-label override', () => {
        const component: Wrapper<MSessionExpired> = mount(MSessionExpired, {
            localVue: Vue,
            propsData: {
                backToLabel: 'Some back to label'
            }
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });
});
