import { mount, Wrapper } from '@vue/test-utils';
import moment from 'moment';
import Vue from 'vue';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent, WrapChildrenStub } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import ErrorMessagePlugin, { MErrorMessage } from './error-message';


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
                date: moment('2018-01-02T00:01:02'),
                referenceNumber: '123456879'
            },
            stubs: {
                'm-accordion': WrapChildrenStub('div'),
                'm-panel': WrapChildrenStub('div')
            }
        });

        return expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
    });

    describe('given error', () => {
        it('should render correctly expanded', () => {
            const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
                localVue: Vue,
                propsData: {
                    date: moment('2018-01-02T00:01:02'),
                    referenceNumber: '123456879',
                    error: {
                        message: 'An error message'
                    }
                },
                stubs: {
                    'm-accordion': WrapChildrenStub('div'),
                    'm-panel': WrapChildrenStub('div')
                }
            });

            return expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly expanded with stack trace on', () => {
            const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
                localVue: Vue,
                propsData: {
                    date: moment('2018-01-02T00:01:02'),
                    referenceNumber: '123456879',
                    error: {
                        message: 'An error message'
                    },
                    stacktrace: true
                },
                stubs: {
                    'm-accordion': WrapChildrenStub('div'),
                    'm-panel': WrapChildrenStub('div')
                }
            });

            return expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
        });
    });

    describe('given error with stack trace', () => {
        it('should render correctly expanded', () => {
            const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
                localVue: Vue,
                propsData: {
                    date: moment('2018-01-02T00:01:02'),
                    referenceNumber: '123456879',
                    error: {
                        message: 'An error message',
                        stack: 'This is a stack trace'
                    }
                },
                stubs: {
                    'm-accordion': WrapChildrenStub('div'),
                    'm-panel': WrapChildrenStub('div')
                }
            });

            return expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly expanded with stack trace on', () => {
            const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
                localVue: Vue,
                propsData: {
                    date: moment('2018-01-02T00:01:02'),
                    referenceNumber: '123456879',
                    error: {
                        message: 'An error message',
                        stack: 'This is a stack trace'
                    },
                    stacktrace: true
                },
                stubs: {
                    'm-accordion': WrapChildrenStub('div'),
                    'm-panel': WrapChildrenStub('div')
                }
            });

            return expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
        });
    });
});
