import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { CalendarCurrentState } from './abstract-calendar-state';
import { MCalendarRangeDateState } from './calendar-range-date-state';

let wrapper: Wrapper<MCalendarRangeDateState>;
let minDate: any;
let maxDate: any;
let value: any;

const initialiserWrapper: Function = (): void => {
    wrapper = mount(MCalendarRangeDateState, {
        localVue: Vue,
        propsData: {
            minDate, maxDate, value
        }
    });
};

describe('Calendar State for a date range', () => {
    beforeEach(() => {
        minDate = undefined;
        maxDate = undefined;
        value = undefined;
    });

    describe(`date initialization`, () => {
        describe(`with default values`, () => {
            let calendarCurrentState: CalendarCurrentState;
            beforeEach(() => {
                initialiserWrapper();
            });

            it(`will set required dates to their default values`, () => {
                console.log(wrapper);
                /*let test: any = wrapper.vm.$scopedSlots.default;

                const minYear: number = calendarCurrentState.calendar.dates['min'].fullYear();
                const currentYear: number = calendarCurrentState.calendar.dates['current'].fullYear();
                const maxYear: number = calendarCurrentState.calendar.dates['max'].fullYear();

                expect(currentYear - minYear).toBe(MIN_DATE_OFFSET);
                expect(maxYear - currentYear).toBe(MAX_DATE_OFFSET);*/
            });

        });
    });
});
