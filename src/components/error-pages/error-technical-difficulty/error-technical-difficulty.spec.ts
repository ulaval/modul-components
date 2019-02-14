import { shallowMount, Wrapper } from '@vue/test-utils';
import moment from 'moment';
import Vue from 'vue';
import { ACCORDION_NAME, I18N_NAME, MESSAGE_PAGE_NAME, PANEL_NAME } from '../../component-names';
import { Link } from '../../message-page/message-page';
import { MErrorTechnicalDifficulty } from './error-technical-difficulty';


// mock moment implementation to set the "present date/time" to a fixed value.
const mockCurrentDate: string = '2016-01-01';
const mockCurrentTime: string = '01:01:01-06:00';

jest.mock('moment', () => jest.fn(() => {
    return {
        format: (format: string) => {
            return format === 'YYYY-MM-DD' ? mockCurrentDate : format === 'HH:mm:ss' ? mockCurrentTime : 'unsupported format';
        }
    };
}));

let wrapper: Wrapper<MErrorTechnicalDifficulty>;

const A_CUSTOM_TITLE: string = 'An error title.';

const DEFAULT_TITLE: string = 'm-error-technical-difficulty:title';
const DEFAULT_FIRST_HINT: string = 'm-error-technical-difficulty:hint.primary';
const DEFAULT_SECOND_HINT: string = 'm-error-technical-difficulty:hint.secondary';
const A_HINT: string = 'aHint';

const DEFAULT_FIRST_LINK: Link = new Link('m-error-technical-difficulty:home-label', '\\');
const A_LINK: Link = new Link('aLabel', 'anUrl');

const ERROR_REFERENCE_NUMBER: string = 'anErrorRefNumber';
const STACKTRACE: string = `(l1)this is a multiline\n\r(l2)stacktrace.`;
let error: Error;
let showStack: boolean;

const getStubs: any = () => {
    return {
        [MESSAGE_PAGE_NAME]: '<div><slot /></div>',
        [ACCORDION_NAME]: '<div id="accordionDiv"><slot /></div>',
        [I18N_NAME]: '<span>{{ $attrs["k"] }}</span>',
        [PANEL_NAME]: '<div id="panel"><slot /></div>'
    };
};

const initializeShallowWrapperNoProps: any = () => {
    wrapper = shallowMount(MErrorTechnicalDifficulty, {
        stubs: getStubs(),
        propsData: {
            title: DEFAULT_TITLE
        }
    });
};

const initializeShallowWrapper: any = () => {
    wrapper = shallowMount(MErrorTechnicalDifficulty, {
        stubs: getStubs(),
        propsData: {
            title: A_CUSTOM_TITLE,
            hints: [A_HINT],
            links: [A_LINK],
            errorReferenceNumber: ERROR_REFERENCE_NUMBER,
            error: error,
            showStackTrace: showStack
        }
    });
};

describe(`MErrorTechnicalDifficulty - test`, () => {

    beforeEach(() => {
        showStack = false;
        error = new Error();

        initializeShallowWrapperNoProps();
    });

    describe(`Given no defined props`, () => {

        it(`Should use default title`, () => {
            expect(wrapper.props().title).toBe(DEFAULT_TITLE);
        });

        it(`Should use default hints`, () => {
            expect(wrapper.vm.hints[0]).toEqual(DEFAULT_FIRST_HINT);
            expect(wrapper.vm.hints[1]).toEqual(DEFAULT_SECOND_HINT);
        });
        it(`Should use default links labels and Url`, () => {
            expect(wrapper.vm.links[0].label).toEqual(DEFAULT_FIRST_LINK.label);
            expect(wrapper.vm.links[0].url).toEqual(DEFAULT_FIRST_LINK.url);
        });
        it(`Should display error details`, () => {

            let errorDetailsBlock: Wrapper<Vue> = wrapper.find('#accordionDiv');

            expect(errorDetailsBlock.exists()).toBeTruthy();
        });
        it('Should use current date/time as default errorDate', () => {
            expect(wrapper.vm.errorDate.toString()).toEqual(moment().toString());
        });
        it('Should not show stacktrace', () => {
            expect(wrapper.vm.showStackTrace).toBeFalsy();
        });
        describe('When accessing formattedDate', () => {
            it('Should give default values (current date) in proper format', () => {
                expect(wrapper.vm.formattedDate).toEqual(mockCurrentDate);
            });
        });
        describe('When accessing formattedTime', () => {
            it('Should give default values (current time) in proper format', () => {
                expect(wrapper.vm.formattedTime).toEqual(mockCurrentTime);
            });
        });
    });

    describe(`Given defined error details props`, () => {
        it(`Should display error details`, () => {
            initializeShallowWrapper();

            let errorDetailsBlock: Wrapper<Vue> = wrapper.find('#accordionDiv');

            expect(errorDetailsBlock.exists()).toBeTruthy();
        });
        describe(`and defined reference number prop`, () => {
            it(`Should display reference number`, () => {
                initializeShallowWrapper();

                let wrapperHtml: string = wrapper.html();

                expect(wrapperHtml).toContain(ERROR_REFERENCE_NUMBER);
            });
        });

        describe(`and defined error prop without stack`, () => {
            describe(`and default value to show stack (false)`, () => {
                it(`Should not show stack block`, () => {
                    initializeShallowWrapper();

                    let stackBlock: Wrapper<Vue> = wrapper.find('#panel');

                    expect(stackBlock.exists()).toBeFalsy();
                });
                it(`Should return propStacktrace as false`, () => {
                    initializeShallowWrapper();

                    expect(wrapper.vm.propStacktrace).toBeFalsy();
                });
            });
            describe(`and must show stack`, () => {
                it(`Should show empty stack block`, () => {
                    showStack = true;
                    error.stack = undefined;
                    initializeShallowWrapper();

                    let stackBlock: Wrapper<Vue> = wrapper.find('#panel');

                    expect(stackBlock.exists()).toBeTruthy();
                });
                it(`Should return propStacktrace as true`, () => {
                    showStack = true;
                    error.stack = undefined;
                    initializeShallowWrapper();

                    expect(wrapper.vm.propStacktrace).toBeTruthy();
                });
            });
        });
        describe(`and defined error prop with stack`, () => {
            describe(`and default value to show stack (false)`, () => {
                it(`Should not show stack block`, () => {
                    error.stack = STACKTRACE;
                    initializeShallowWrapper();

                    let stackBlock: Wrapper<Vue> = wrapper.find('#panel');

                    expect(stackBlock.exists()).toBeFalsy();
                });
                it(`Should return propStacktrace as false`, () => {
                    error.stack = STACKTRACE;
                    initializeShallowWrapper();

                    expect(wrapper.vm.propStacktrace).toBeFalsy();
                });
            });
            describe(`and must show stack`, () => {
                it(`Should show stack block`, () => {
                    error.stack = STACKTRACE;
                    showStack = true;
                    initializeShallowWrapper();

                    let stackBlock: Wrapper<Vue> = wrapper.find('#panel');

                    expect(stackBlock.exists()).toBeTruthy();
                });
                it(`Should return propStacktrace as true`, () => {
                    error.stack = STACKTRACE;
                    showStack = true;
                    initializeShallowWrapper();

                    expect(wrapper.vm.propStacktrace).toBeTruthy();
                });
            });

        });
    });
});
