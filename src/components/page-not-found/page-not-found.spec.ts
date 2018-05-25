import Vue from 'vue';
import { mount, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../tests/helpers/render';
import PageNotFoundPlugin, { MPageNotFound } from './page-not-found';

describe('MPageNotFound', () => {
    beforeEach(() => {
        Vue.use(PageNotFoundPlugin);
    });
    it('should render correctly', () => {
        const component: Wrapper<MPageNotFound> = mount(MPageNotFound, {
            localVue: Vue
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly with back-to-label override', () => {
        const component: Wrapper<MPageNotFound> = mount(MPageNotFound, {
            localVue: Vue,
            propsData: {
                backToLabel: 'Some back to label'
            }
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });
});
