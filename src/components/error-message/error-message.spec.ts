import Vue from 'vue';
import { mount, Wrapper } from '@vue/test-utils';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent, WrapChildrenStub } from '../../../tests/helpers/render';
import ErrorMessagePlugin, { MErrorMessage } from './error-message';
import uuid from '../../utils/uuid/uuid';
import moment from 'moment';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MErrorMessage', () => {
    let userAgent: string = window.navigator.userAgent;
    beforeEach(() => {
        Vue.use(ErrorMessagePlugin);
        addMessages(Vue, ['components/error-message/error-message.lang.fr.json']);

        userAgent = window.navigator.userAgent;
        Object.defineProperty(window.navigator, 'userAgent', { value: 'modul-user-agent', configurable: true });
    });

    afterEach(() => {
        Object.defineProperty(window.navigator, 'userAgent', { value: userAgent, configurable: true });
    });

    it('should render correctly collapsed', () => {
        const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
            localVue: Vue
        });

        return expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly expanded', () => {
        const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
            localVue: Vue,
            propsData: {
                date: moment('2018-01-02T00:01:02')
            },
            stubs: {
                'm-accordion': WrapChildrenStub('div')
            }
        });

        return expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
    });
});
