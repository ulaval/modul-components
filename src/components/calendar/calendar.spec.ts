import { mount, RefSelector, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { CalendarMode, MCalendar } from './calendar';
import { RangeDate, SingleDate } from './calendar-state/state/abstract-calendar-state';

const SIMPLE_CALENDAR_COMPONENT: string = 'm-simple-calendar';
const DATE_RANGE_STATE_COMPONENT: string = 'm-calendar-date-range-state';
const SINGLE_DATE_STATE_COMPONENT: string = 'm-calendar-date-range-state';

const SINGLE_DATE: SingleDate = '2019-01-23';
const DATE_RANGE: RangeDate = { begin: '2019-01-01', end: '2020-12-31' };

const CALENDAR_STATE_REF: RefSelector = { 'ref': 'calendarState' };
const CALENDAR_RENDERER_REF: RefSelector = { 'ref': 'calendarRenderer' };

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

let wrapper: Wrapper<MCalendar>;

const validateInputModelMock: jest.Mock = jest.fn();

let value: any;
let mode: any;
let minDate: any;
let maxDate: any;
let showMonthBeforeAfter: any;

const buildStubs: Function = (): { [cle: string]: any } => {
    return {
        [SIMPLE_CALENDAR_COMPONENT]: {
            template: `
            <div class="${SIMPLE_CALENDAR_COMPONENT}"></div>`,
            props: ['calendar', 'initialPickerMode', 'showMonthBeforeAfter', 'monthsNames', 'monthsNamesLong', 'daysNames']
        },
        [DATE_RANGE_STATE_COMPONENT]: {
            template: `<div><slot></slot></div>`,
            props: ['minDate', 'maxDate', 'value']
        },
        [SINGLE_DATE_STATE_COMPONENT]: {
            template: `<div><slot></slot></div>`,
            props: ['minDate', 'maxDate', 'value']
        }
    };
};

const initializeWrapper: Function = (methods: any = {}): void => {
    wrapper = mount(MCalendar, {
        localVue: Vue,
        stubs: buildStubs(),
        propsData: {
            value,
            mode,
            minDate,
            maxDate,
            showMonthBeforeAfter
        },
        methods: methods
    });
};

/**
 * @todo @chuckmah
 * CE TEST EST IGNORÉ!!
 *
 * Il faudrait que le test ne soit pas depêndant de la journee courant lors des snapshot testing.
 */
xdescribe(`Calendar`, () => {
    beforeEach(() => {
        value = undefined;
        mode = undefined;
        minDate = undefined;
        maxDate = undefined;
        showMonthBeforeAfter = undefined;
    });

    describe(`with default values`, () => {
        it(`should render default view`, async () => {
            initializeWrapper();
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });

    describe(`delegates properties to calendar renderer`, () => {
        beforeEach(() => {
            minDate = '2005-01-01';
            maxDate = '2025-01-01';
        });

        it(`without values, will delegate it's default values`, () => {
            initializeWrapper();

            const calendarRenderer: Wrapper<Vue> = wrapper.find(CALENDAR_RENDERER_REF);

            expect(calendarRenderer.exists()).toBe(true);
            expect(calendarRenderer.props().showMonthBeforeAfter).toBe(true);
            expect(calendarRenderer.props().minDate).toBeUndefined();
            expect(calendarRenderer.props().maxDate).toBeUndefined();
        });

        it(`with specific values, will delegate these values`, () => {
            showMonthBeforeAfter = false;
            initializeWrapper();

            const calendarRenderer: Wrapper<Vue> = wrapper.find(CALENDAR_RENDERER_REF);

            expect(calendarRenderer.exists()).toBe(true);
            expect(calendarRenderer.props().showMonthBeforeAfter).toBe(false);
            expect(calendarRenderer.props().minDate).toBeUndefined();
            expect(calendarRenderer.props().maxDate).toBeUndefined();
        });
    });

    describe('in single date mode', () => {
        beforeEach(() => {
            mode = CalendarMode.SINGLE_DATE;
            value = '';
            initializeWrapper();
        });

        it(`should render single dates view`, async () => {
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        describe(`on model update`, () => {
            it(`then event listener will be called`, () => {
                const calendarState: Wrapper<Vue> = wrapper.find(CALENDAR_STATE_REF);
                const onInputMock: jest.Mock = jest.fn();
                wrapper.setMethods({ onInput: onInputMock });

                calendarState.vm.$emit('input', SINGLE_DATE);

                expect(onInputMock).toHaveBeenCalledTimes(1);
            });

            it(`then event will be re-emitted`, () => {
                const calendarState: Wrapper<Vue> = wrapper.find(CALENDAR_STATE_REF);
                calendarState.vm.$emit('input', SINGLE_DATE);

                expect(wrapper.emitted('input')).toEqual([[SINGLE_DATE]]);
            });
        });

        describe(`delegates properties to calendar state`, () => {
            beforeEach(() => {
                showMonthBeforeAfter = false;
            });

            it(`without values, will delegate it's default values`, () => {
                initializeWrapper();

                const calendarState: Wrapper<Vue> = wrapper.find(CALENDAR_STATE_REF);

                expect(calendarState.exists()).toBe(true);
                expect(calendarState.props().showMonthBeforeAfter).toBeUndefined();
                expect(calendarState.props().minDate).toBeUndefined();
                expect(calendarState.props().maxDate).toBeUndefined();
            });

            it(`with specific values, will delegate these values`, () => {
                minDate = '2005-10-01';
                maxDate = '2025-10-01';
                initializeWrapper();

                const calendarState: Wrapper<Vue> = wrapper.find(CALENDAR_STATE_REF);

                expect(calendarState.exists()).toBe(true);
                expect(calendarState.props().showMonthBeforeAfter).toBeUndefined();
                expect(calendarState.props().minDate).toBe('2005-10-01');
                expect(calendarState.props().maxDate).toBe('2025-10-01');
            });
        });
    });

    describe('in date range mode', () => {
        beforeEach(() => {
            mode = CalendarMode.DATE_RANGE;
            value = {};
            initializeWrapper();
        });

        it(`should render date range view`, async () => {
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        describe(`on model update`, () => {
            it(`then event listener will be called`, () => {
                const calendarState: Wrapper<Vue> = wrapper.find(CALENDAR_STATE_REF);
                const onInputMock: jest.Mock = jest.fn();
                wrapper.setMethods({ onInput: onInputMock });

                calendarState.vm.$emit('input', DATE_RANGE);

                expect(onInputMock).toHaveBeenCalledTimes(1);
            });

            it(`then event will be re-emitted`, () => {
                const calendarState: Wrapper<Vue> = wrapper.find(CALENDAR_STATE_REF);
                calendarState.vm.$emit('input', DATE_RANGE);

                expect(wrapper.emitted('input')).toEqual([[DATE_RANGE]]);
            });
        });

        describe(`delegates properties to calendar state`, () => {
            beforeEach(() => {
                showMonthBeforeAfter = false;
            });

            it(`without values, will delegate it's default values`, () => {
                initializeWrapper();

                const calendarState: Wrapper<Vue> = wrapper.find(CALENDAR_STATE_REF);

                expect(calendarState.exists()).toBe(true);
                expect(calendarState.props().showMonthBeforeAfter).toBeUndefined();
                expect(calendarState.props().minDate).toBeUndefined();
                expect(calendarState.props().maxDate).toBeUndefined();
            });

            it(`with specific values, will dele gate these values`, () => {
                minDate = '2005-10-01';
                maxDate = '2025-10-01';
                initializeWrapper();

                const calendarState: Wrapper<Vue> = wrapper.find(CALENDAR_STATE_REF);

                expect(calendarState.exists()).toBe(true);
                expect(calendarState.props().showMonthBeforeAfter).toBeUndefined();
                expect(calendarState.props().minDate).toBe('2005-10-01');
                expect(calendarState.props().maxDate).toBe('2025-10-01');
            });
        });
    });

    describe(`model consistency`, () => {
        it(`on creation will validate data model`, () => {
            value = SINGLE_DATE;
            initializeWrapper({ validateInputModel: validateInputModelMock });

            expect(validateInputModelMock).toHaveBeenCalledTimes(1);
        });

        it(`on value refresh, will validate data model`, () => {
            value = SINGLE_DATE;
            initializeWrapper();
            wrapper.setMethods({ validateInputModel: validateInputModelMock });
            wrapper.setProps({ value: SINGLE_DATE });

            wrapper.vm.$nextTick(() => { expect(validateInputModelMock).toHaveBeenCalledTimes(1); });
        });

        describe(`will be enforced for`, () => {
            let errorHandler: (err: Error, vm: Vue, info: string) => void;

            beforeEach(() => {
                errorHandler = Vue.config.errorHandler;
            });

            afterEach(() => {
                Vue.config.errorHandler = errorHandler;
            });

            describe(`single-date mode`, () => {

                beforeEach(() => {
                    mode = CalendarMode.SINGLE_DATE;
                });

                it(`when model is valid`, () => {
                    value = SINGLE_DATE;
                    expect(() => { initializeWrapper(); }).not.toThrow();
                });

                it(`when model is a date range model`, () => {
                    try {
                        value = DATE_RANGE;
                        Vue.config.errorHandler = (err, _vm, _info) => expect(err).toBeTruthy();

                        initializeWrapper();
                    } catch { }
                });
            });

            describe(`date-range mode`, () => {

                beforeEach(() => {
                    mode = CalendarMode.DATE_RANGE;
                });

                it(`when model is valid`, () => {
                    value = DATE_RANGE;
                    expect(() => { initializeWrapper(); }).not.toThrow();
                });

                it(`when model is a single date model`, () => {
                    try {
                        value = SINGLE_DATE;
                        Vue.config.errorHandler = (err, _vm, _info) => expect(err).toBeTruthy();

                        initializeWrapper();
                    } catch { }
                });
            });
        });
    });
});
