import Vue from 'vue';
import { mount, Wrapper } from '@vue/test-utils';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import ErrorMessagePlugin, { MErrorMessage } from './error-message';
import uuid from '../../utils/uuid/uuid';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MErrorMessage', () => {
    beforeEach(() => {
        Vue.use(ErrorMessagePlugin);
        addMessages(Vue, ['components/error-message/error-message.lang.fr.json']);
    });

    it('should render correctly', () => {
        const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
            localVue: Vue
        });

        return expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
    });
});
