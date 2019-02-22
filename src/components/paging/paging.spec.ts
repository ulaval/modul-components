import Vue from 'vue';
import { mount, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../tests/helpers/render';
import PagingPlugin, { MPaging } from './paging';

describe('MPaging', () => {
    beforeEach(() => {
        Vue.use(PagingPlugin);
    });
    it('should render correctly', () => {
        const component: Wrapper<MPaging> = mount(MPaging, {
            localVue: Vue
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });
});
