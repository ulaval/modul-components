import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../../tests/helpers/render';
import MCalendarStateMachine, { CalendarMode } from './calendar-state-machine';
import CalendarRangeDateState from './state/calendar-range-date-state';
import CalendarSingleDateState from './state/calendar-single-date-state';

jest.mock('./state/calendar-single-date-state');
jest.mock('./state/calendar-range-date-state');

const EMPTY_VALUE: string = '';
const UNDEFINED_MIN_DATE: string | undefined = undefined;
const UNDEFINED_MAX_DATE: string | undefined = undefined;

const DEFAULT_DATE_VALUE: string = '2019-01-01';

let wrapper: Wrapper<MCalendarStateMachine>;
let value: any;
let mode: any;
let minDate: any;
let maxDate: any;

const initializeWrapper: Function = (): void => {
    wrapper = mount(MCalendarStateMachine, {
        propsData: {
            value, mode, minDate, maxDate
        },
        render(): any {
            return (
                '<Component scopedSlots={{default: <p></p>}} />'
            );
        }
    });
};

describe(`Calendar state machine`, () => {

    beforeEach(() => {
        ((CalendarRangeDateState as any) as jest.Mock).mockClear();
        ((CalendarSingleDateState as any) as jest.Mock).mockClear();

        value = undefined;
        mode = undefined;
        minDate = undefined;
        maxDate = undefined;
    });

    describe(`without parameters`, () => {
        it(`will default to single date state`, () => {
            initializeWrapper();

            expect(CalendarSingleDateState).toHaveBeenCalledTimes(1);
            expect(CalendarRangeDateState).not.toHaveBeenCalled();
        });

        it(`will assign date select callback`, () => {
            initializeWrapper();

            const mockCalendarSingleDateState: any = (CalendarSingleDateState as any).mock.instances[0];

            expect(mockCalendarSingleDateState.onDateSelect).toHaveBeenCalledTimes(1);
        });

        it(`should not render anything`, async () => {
            initializeWrapper();
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`should call build method on state on render`, async () => {
            initializeWrapper();

            const mockCalendarSingleDateState: any = (CalendarSingleDateState as any).mock.instances[0];
            renderComponent(wrapper.vm).then(
                () => expect(mockCalendarSingleDateState.buildCurrentCalendar).toHaveBeenCalledTimes(1)
            );
        });
    });

    describe(`with single date mode`, () => {
        beforeEach(() => {
            mode = CalendarMode.SINGLE_DATE;
        });

        it(`will create single date state`, () => {
            initializeWrapper();

            expect(CalendarSingleDateState).toHaveBeenCalledTimes(1);
            expect(CalendarRangeDateState).not.toHaveBeenCalled();
        });

        it(`will assign date select callback`, () => {
            initializeWrapper();

            const mockCalendarSingleDateState: any = (CalendarSingleDateState as any).mock.instances[0];

            expect(mockCalendarSingleDateState.onDateSelect).toHaveBeenCalledTimes(1);
        });

        it(`should not render anything`, async () => {
            initializeWrapper();
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        describe(`with value`, () => {
            beforeEach(() => {
                value = DEFAULT_DATE_VALUE;
            });

            it(`will use value on creation`, () => {
                initializeWrapper();

                expect(CalendarSingleDateState).toHaveBeenCalledWith(value, UNDEFINED_MIN_DATE, UNDEFINED_MAX_DATE);
            });

        });

        describe(`with min date`, () => {
            beforeEach(() => {
                minDate = DEFAULT_DATE_VALUE;
            });

            it(`will use value on creation`, () => {
                initializeWrapper();

                expect(CalendarSingleDateState).toHaveBeenCalledWith(EMPTY_VALUE, minDate, UNDEFINED_MAX_DATE);
            });
        });

        describe(`with max date`, () => {
            beforeEach(() => {
                maxDate = DEFAULT_DATE_VALUE;
            });

            it(`will use value on creation`, () => {
                initializeWrapper();

                expect(CalendarSingleDateState).toHaveBeenCalledWith(EMPTY_VALUE, UNDEFINED_MIN_DATE, maxDate);
            });
        });

        describe(`with all parameters`, () => {
            beforeEach(() => {
                value = DEFAULT_DATE_VALUE;
                maxDate = DEFAULT_DATE_VALUE;
                minDate = DEFAULT_DATE_VALUE;
            });

            it(`will use value on creation`, () => {
                initializeWrapper();

                expect(CalendarSingleDateState).toHaveBeenCalledWith(value, minDate, maxDate);
            });
        });

        describe(`refreshing value`, () => {
            it(`will pass the new value to state`, () => {
                initializeWrapper();
                wrapper.setProps({ value: '2019-10-10' });

                const mockCalendarRangeDateState: CalendarRangeDateState = ((CalendarRangeDateState as any) as jest.Mocked<CalendarRangeDateState>);

                Vue.nextTick(() => { expect(mockCalendarRangeDateState.updateState).toHaveBeenCalledWith('2019-10-10'); });
            });
        });

        describe(`updating value`, () => {
            it(`will pass the new value to state`, () => {
                initializeWrapper();
                wrapper.vm.onInput('2019-10-10');

                const mockCalendarRangeDateState: CalendarRangeDateState = ((CalendarRangeDateState as any) as jest.Mocked<CalendarRangeDateState>);

                Vue.nextTick(() => { expect(mockCalendarRangeDateState.updateState).toHaveBeenCalledWith('2019-10-10'); });
            });
        });
    });

    describe(`with date range mode`, () => {
        beforeEach(() => {
            mode = CalendarMode.DATE_RANGE;
        });

        it(`will create date range state`, () => {
            initializeWrapper();

            expect(CalendarSingleDateState).not.toHaveBeenCalled();
            expect(CalendarRangeDateState).toHaveBeenCalledTimes(1);
        });

        it(`will assign date select callback`, () => {
            initializeWrapper();

            const mockCalendarRangeDateState: any = (CalendarRangeDateState as any).mock.instances[0];

            expect(mockCalendarRangeDateState.onDateSelect).toHaveBeenCalledTimes(1);
        });

        it(`should not render anything`, async () => {
            initializeWrapper();
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        describe(`with value`, () => {
            beforeEach(() => {
                value = { begin: DEFAULT_DATE_VALUE, end: undefined };
            });

            it(`will use value on creation`, () => {
                initializeWrapper();

                expect(CalendarRangeDateState).toHaveBeenCalledWith(value, undefined, undefined);
            });
        });

        describe(`with min date`, () => {
            beforeEach(() => {
                minDate = DEFAULT_DATE_VALUE;
            });

            it(`will use value on creation`, () => {
                initializeWrapper();

                expect(CalendarRangeDateState).toHaveBeenCalledWith('', minDate, undefined);
            });
        });

        describe(`with max date`, () => {
            beforeEach(() => {
                maxDate = DEFAULT_DATE_VALUE;
            });

            it(`will use value on creation`, () => {
                initializeWrapper();

                expect(CalendarRangeDateState).toHaveBeenCalledWith('', undefined, maxDate);
            });
        });

        describe(`with all parameters`, () => {
            beforeEach(() => {
                value = DEFAULT_DATE_VALUE;
                maxDate = DEFAULT_DATE_VALUE;
                minDate = DEFAULT_DATE_VALUE;
            });

            it(`will use value on creation`, () => {
                initializeWrapper();

                expect(CalendarRangeDateState).toHaveBeenCalledWith(value, minDate, maxDate);
            });
        });

        describe(`refreshing value`, () => {
            it(`will pass the new value to state`, () => {
                initializeWrapper();
                wrapper.setProps({ value: { begin: '2019-10-10', end: '2020-01-01' } });

                const mockCalendarRangeDateState: CalendarRangeDateState = ((CalendarRangeDateState as any) as jest.Mocked<CalendarRangeDateState>);

                Vue.nextTick(() => { expect(mockCalendarRangeDateState.updateState).toHaveBeenCalledWith({ begin: '2019-10-10', end: '2020-01-01' }); });
            });
        });

        describe(`updating value`, () => {
            it(`will pass the new value to state`, () => {
                initializeWrapper();
                wrapper.vm.onInput({ begin: '2019-10-10', end: '2020-01-01' });

                const mockCalendarRangeDateState: CalendarRangeDateState = ((CalendarRangeDateState as any) as jest.Mocked<CalendarRangeDateState>);

                Vue.nextTick(() => { expect(mockCalendarRangeDateState.updateState).toHaveBeenCalledWith({ begin: '2019-10-10', end: '2020-01-01' }); });
            });
        });
    });


});

