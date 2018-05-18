import Vue from 'vue';
import { mount, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../tests/helpers/render';
import {{plugin}}Plugin, { {{class}} } from './{{file}}';

describe('{{class}}', () => {
    beforeEach(() => {
        Vue.use({{plugin}}Plugin);
    });
    it('should render correctly collapsed', () => {
        const component: Wrapper<{{class}}> = mount({{class}}, {
            localVue: Vue
        });

        return expect(renderComponent(component.vm)).resolves.toMatchSnapshot();
    });
});
