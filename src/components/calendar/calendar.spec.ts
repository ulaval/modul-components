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

const obtenirStubs: Function = (): { [cle: string]: any } => {
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

const initialiserWrapper: Function = (methods: any = {}): void => {
    wrapper = mount(MCalendar, {
        localVue: Vue,
        stubs: obtenirStubs(),
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

describe(`Calendar`, () => {
    beforeEach(() => {
        value = undefined;
        mode = undefined;
        minDate = undefined;
        maxDate = undefined;
        showMonthBeforeAfter = undefined;
    });

    describe(`with default values`, () => {
        it(`should render default view`, async () => {
            initialiserWrapper();
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });

    describe(`delegates properties to calendar renderer`, () => {
        beforeEach(() => {
            minDate = '2005-01-01';
            maxDate = '2025-01-01';
        });

        it(`with default values`, () => {
            initialiserWrapper();

            const calendarRenderer: Wrapper<Vue> = wrapper.find(CALENDAR_RENDERER_REF);

            expect(calendarRenderer.exists()).toBe(true);
            expect(calendarRenderer.props().showMonthBeforeAfter).toBe(true);
            expect(calendarRenderer.props().minDate).toBeUndefined();
            expect(calendarRenderer.props().maxDate).toBeUndefined();
        });

        it(`with specific values`, () => {
            showMonthBeforeAfter = false;
            initialiserWrapper();

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
            initialiserWrapper();
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

            it(`with default values`, () => {
                initialiserWrapper();

                const calendarState: Wrapper<Vue> = wrapper.find(CALENDAR_STATE_REF);

                expect(calendarState.exists()).toBe(true);
                expect(calendarState.props().showMonthBeforeAfter).toBeUndefined();
                expect(calendarState.props().minDate).toBeUndefined();
                expect(calendarState.props().maxDate).toBeUndefined();
            });

            it(`with specific values`, () => {
                minDate = '2005-10-01';
                maxDate = '2025-10-01';
                initialiserWrapper();

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
            initialiserWrapper();
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

            it(`with default values`, () => {
                initialiserWrapper();

                const calendarState: Wrapper<Vue> = wrapper.find(CALENDAR_STATE_REF);

                expect(calendarState.exists()).toBe(true);
                expect(calendarState.props().showMonthBeforeAfter).toBeUndefined();
                expect(calendarState.props().minDate).toBeUndefined();
                expect(calendarState.props().maxDate).toBeUndefined();
            });

            it(`with specific values`, () => {
                minDate = '2005-10-01';
                maxDate = '2025-10-01';
                initialiserWrapper();

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
            initialiserWrapper({ validateInputModel: validateInputModelMock });

            expect(validateInputModelMock).toHaveBeenCalledTimes(1);
        });

        it(`on value refresh, will validate data model`, () => {
            value = SINGLE_DATE;
            initialiserWrapper();
            wrapper.setMethods({ validateInputModel: validateInputModelMock });
            wrapper.setProps({ value: SINGLE_DATE });

            wrapper.vm.$nextTick(() => { expect(validateInputModelMock).toHaveBeenCalledTimes(1); });
        });

        describe(`will be enforced for`, () => {
            describe(`single-date mode`, () => {

                beforeEach(() => {
                    mode = CalendarMode.SINGLE_DATE;
                });

                it(`when model is valid`, () => {
                    value = SINGLE_DATE;
                    expect(() => { initialiserWrapper(); }).not.toThrow(Error);
                });

                it(`when model is a date range model`, () => {
                    value = DATE_RANGE;
                    expect(() => { initialiserWrapper(); }).toThrow(Error);
                });
            });

            describe(`date-range mode`, () => {

                beforeEach(() => {
                    mode = CalendarMode.DATE_RANGE;
                });

                it(`when model is valid`, () => {
                    value = DATE_RANGE;
                    expect(() => { initialiserWrapper(); }).not.toThrow(Error);
                });

                it(`when model is a single date model`, () => {
                    value = SINGLE_DATE;
                    expect(() => { initialiserWrapper(); }).toThrow(Error);
                });
            });
        });
    });
});
