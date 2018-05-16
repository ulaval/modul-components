import Vue from 'vue';
import { mount, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../tests/helpers/render';
import PageNotFoundPlugin, { MPageNotFound } from './page-not-found';

describe('MPageNotFound', () => {
    beforeEach(() => {
        Vue.use(PageNotFoundPlugin);
    });
    it('should render correctly collapsed', () => {
        const component: Wrapper<MPageNotFound> = mount(MPageNotFound, {
            localVue: Vue
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });
});
