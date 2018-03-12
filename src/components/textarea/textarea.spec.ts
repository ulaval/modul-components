import { mount } from '@vue/test-utils';
import Vue from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import TextareaPlugin from '../../components/textarea/textarea';
import { MTextarea } from './textarea';

describe('MTextArea', () => {
    beforeEach(() => {
        Vue.use(TextareaPlugin);
    });

    it('should render correctly', () => {
        const txtarea = mount(MTextarea);

        return expect(renderComponent(txtarea.vm)).resolves.toMatchSnapshot();
    });
});
