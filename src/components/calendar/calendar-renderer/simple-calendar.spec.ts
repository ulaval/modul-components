import { mount, RefSelector, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { addMessages } from '../../../../tests/helpers/lang';
import { renderComponent } from '../../../../tests/helpers/render';
import ModulDate from '../../../utils/modul-date/modul-date';
import uuid from '../../../utils/uuid/uuid';
import { Calendar, CalendarEvent, YearState } from '../calendar-state/state/calendar-state';
import MSimpleCalendar, { PickerMode } from './simple-calendar';

jest.mock('../../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

const MIN_YEAR: number = 2015;
const MAX_YEAR: number = 2023;
const CURRENT_YEAR: number = 2019;
const CURRENT_MONTH_INDEX: number = 0;
const CURRENT_MONTH_LENGTH: number = 31;
const DAY_OFFSET: number = 28;

const CURRENT_DAY: number = 15;
const FOCUSED_DAY: number = 12;
const HIGHLIGHTED_DAYS: number[] = [20, 21, 22, 23];
const SELECTED_DAY: number = 18;
const DISABLED_DAY: number = 28;

const PREVIOUS_YEAR_REF: RefSelector = { ref: 'previousYear' };
const CURRENT_YEAR_REF: RefSelector = { ref: 'currentYear' };
const NEXT_YEAR_REF: RefSelector = { ref: 'nextYear' };

const PREVIOUS_MONTH_REF: RefSelector = { ref: 'previousMonth' };
const CURRENT_MONTH_REF: RefSelector = { ref: 'currentMonth' };
const NEXT_MONTH_REF: RefSelector = { ref: 'nextMonth' };

const padString: Function = (value: any): string => {
    return ('000' + value).slice(-2);
};

const SELECTABLE_DAY_REF: RefSelector = { ref: `day${CURRENT_YEAR}${padString(CURRENT_MONTH_INDEX + 1)}${padString(CURRENT_DAY)}` };
const SELECTABLE_MONTH_REF: RefSelector = { ref: `month${padString(CURRENT_MONTH_INDEX + 1)}` };
const SELECTABLE_YEAR_REF: RefSelector = { ref: `year${CURRENT_YEAR}` };

let wrapper: Wrapper<MSimpleCalendar>;
let calendar: Calendar;
let initialPickerMode: any;
let showMonthBeforeAfter: any;
let monthsNames: any;
let monthsNamesLong: any;
let daysNames: any;

const initializeWrapper: Function = (): void => {
    wrapper = mount(MSimpleCalendar, {
        localVue: Vue,
        propsData: {
            calendar, initialPickerMode, showMonthBeforeAfter, monthsNames, monthsNamesLong, daysNames
        }
    });
};

const range: Function = (start, end): number[] => {
    const length: number = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
};

const initCalendar: Function = (): Calendar => {
    let currentMonthOffset: number = -1;

    return {
        dates: {
            min: new ModulDate(`${MIN_YEAR}-01-15`),
            current: new ModulDate('2019-01-15'),
            max: new ModulDate(`${MAX_YEAR}-01-15`)
        },
        years: range(MIN_YEAR, MAX_YEAR).map((year: number) => {
            return {
                year: year,
                isCurrent: year === CURRENT_YEAR
            };
        }),
        months: range(0, 11).map((month: number) => {
            return {
                month: month,
                isDisabled: false,
                isCurrent: month === CURRENT_MONTH_INDEX
            };
        }),
        days: range(1, 35).map((day: number) => {
            const currentDay: number = ((day + DAY_OFFSET) % CURRENT_MONTH_LENGTH) + 1;

            let currentMonth: number = CURRENT_MONTH_INDEX + currentMonthOffset;
            let currentYear: number = CURRENT_YEAR;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear -= 1;
            } else if (currentMonth > 11) {
                currentMonth = 0;
                currentYear += 1;
            }

            if (currentDay === 31) {
                currentMonthOffset += 1;
            }

            return {
                day: currentDay,
                month: currentMonth,
                year: currentYear,
                isDisabled: day === DISABLED_DAY,
                isToday: day === CURRENT_DAY,
                isSelected: day === SELECTED_DAY,
                isInPreviousMonth: currentMonthOffset < 0,
                isInNextMonth: currentMonthOffset > 0,
                isHighlighted: HIGHLIGHTED_DAYS.filter((hiDay: number) => hiDay === day).length > 0,
                hasFocus: day === FOCUSED_DAY
            };
        })
    };
};

describe('Simple calendar', () => {
    beforeAll(() => {
        addMessages(Vue, [
            'components/calendar/calendar.lang.en.json'
        ]);
    });

    beforeEach(() => {
        calendar = initCalendar();
    });

    it('validate initial calendar', () => {
        expect(calendar.days.length % 7).toBe(0);
        expect(calendar.days.length).toBeGreaterThanOrEqual(7);
        expect(calendar.months).toHaveLength(12);
        expect(calendar.years).toHaveLength(MAX_YEAR - MIN_YEAR + 1);
    });

    describe(`in day picker mode`, () => {
        beforeEach(() => {
            initialPickerMode = PickerMode.DAY;
        });

        it(`should render a calendar`, async () => {
            initializeWrapper();
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`when hiding days from previous and following month, these days should be hidden`, async () => {
            showMonthBeforeAfter = false;
            initializeWrapper();
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
        describe(`event handling`, () => {

            beforeEach(() => {
                initializeWrapper();
            });

            describe(`when selecting a day`, () => {
                it(`will call event handler`, () => {
                    wrapper.setMethods({ 'onDaySelect': jest.fn() });
                    const dayElement: Wrapper<Vue> = wrapper.find(SELECTABLE_DAY_REF);

                    dayElement.trigger('click', calendar.days[CURRENT_DAY + 1]);

                    expect(wrapper.vm.onDaySelect).toHaveBeenCalledTimes(1);
                });

                it(`will throw related calendar event`, () => {
                    const dayElement: Wrapper<Vue> = wrapper.find(SELECTABLE_DAY_REF);

                    dayElement.trigger('click', calendar.days[CURRENT_DAY + 1]);

                    expect(wrapper.emitted(CalendarEvent.DAY_SELECT)).toEqual([[calendar.days[CURRENT_DAY + 1]]]);
                });
            });

            describe(`when a mouse enter a day`, () => {
                it(`will call event handler`, () => {
                    wrapper.setMethods({ 'onDayMouseEnter': jest.fn() });
                    const dayElement: Wrapper<Vue> = wrapper.find(SELECTABLE_DAY_REF);

                    dayElement.trigger('mouseenter', calendar.days[CURRENT_DAY + 1]);

                    expect(wrapper.vm.onDayMouseEnter).toHaveBeenCalledTimes(1);
                });

                it(`will throw related calendar event`, () => {
                    const dayElement: Wrapper<Vue> = wrapper.find(SELECTABLE_DAY_REF);

                    dayElement.trigger('mouseenter', calendar.days[CURRENT_DAY + 1]);

                    expect(wrapper.emitted(CalendarEvent.DAY_MOUSE_ENTER)).toEqual([[calendar.days[CURRENT_DAY + 1]]]);
                });

            });

            describe(`when a mouse leave a day`, () => {
                it(`will call event handler`, () => {
                    wrapper.setMethods({ 'onDayMouseLeave': jest.fn() });
                    const dayElement: Wrapper<Vue> = wrapper.find(SELECTABLE_DAY_REF);

                    dayElement.trigger('mouseleave', calendar.days[CURRENT_DAY + 1]);

                    expect(wrapper.vm.onDayMouseLeave).toHaveBeenCalledTimes(1);
                });

                it(`will throw related calendar event`, () => {
                    const dayElement: Wrapper<Vue> = wrapper.find(SELECTABLE_DAY_REF);

                    dayElement.trigger('mouseleave', calendar.days[CURRENT_DAY + 1]);

                    expect(wrapper.emitted(CalendarEvent.DAY_MOUSE_LEAVE)).toEqual([[calendar.days[CURRENT_DAY + 1]]]);
                });
            });

            describe('when changing year', () => {
                describe('to next year', () => {
                    it(`will call event handler`, () => {
                        wrapper.setMethods({ 'onYearNext': jest.fn() });
                        const nextYearElement: Wrapper<Vue> = wrapper.find(NEXT_YEAR_REF);

                        nextYearElement.trigger('click');

                        expect(wrapper.vm.onYearNext).toHaveBeenCalledTimes(1);
                    });

                    it(`will throw related calendar event`, () => {
                        const nextYearElement: Wrapper<Vue> = wrapper.find(NEXT_YEAR_REF);

                        nextYearElement.trigger('click');

                        expect(wrapper.vm.onYearNext).toBeDefined();
                    });
                });
                describe('to previous year', () => {
                    it(`will call event handler`, () => {
                        wrapper.setMethods({ 'onYearPrevious': jest.fn() });
                        const previousYearElement: Wrapper<Vue> = wrapper.find(PREVIOUS_YEAR_REF);

                        previousYearElement.trigger('click');

                        expect(wrapper.vm.onYearPrevious).toHaveBeenCalledTimes(1);
                    });

                    it(`will throw related calendar event`, () => {
                        const previousYearElement: Wrapper<Vue> = wrapper.find(PREVIOUS_YEAR_REF);

                        previousYearElement.trigger('click');

                        expect(wrapper.vm.onYearPrevious).toBeDefined();
                    });
                });
            });

            describe('when changing month', () => {
                describe('to next month', () => {
                    it(`will call event handler`, () => {
                        wrapper.setMethods({ 'onMonthNext': jest.fn() });
                        const nextMonthElement: Wrapper<Vue> = wrapper.find(NEXT_MONTH_REF);

                        nextMonthElement.trigger('click');

                        expect(wrapper.vm.onMonthNext).toHaveBeenCalledTimes(1);
                    });

                    it(`will throw related calendar event`, () => {
                        const nextMonthElement: Wrapper<Vue> = wrapper.find(NEXT_MONTH_REF);

                        nextMonthElement.trigger('click');

                        expect(wrapper.vm.onMonthPrevious).toBeDefined();
                    });
                });

                describe('to previous month', () => {
                    it(`will call event handler`, () => {
                        wrapper.setMethods({ 'onMonthPrevious': jest.fn() });
                        const previousMonthElement: Wrapper<Vue> = wrapper.find(PREVIOUS_MONTH_REF);

                        previousMonthElement.trigger('click');

                        expect(wrapper.vm.onMonthPrevious).toHaveBeenCalledTimes(1);
                    });

                    it(`will throw related calendar event`, () => {
                        const previousMonthElement: Wrapper<Vue> = wrapper.find(PREVIOUS_MONTH_REF);

                        previousMonthElement.trigger('click');

                        expect(wrapper.vm.onMonthPrevious).toBeDefined();
                    });
                });
            });

            describe('when changing picker mode', () => {
                describe('to year', () => {
                    it(`will call event handler`, () => {
                        wrapper.setMethods({ 'onYearClick': jest.fn() });
                        const yearElement: Wrapper<Vue> = wrapper.find(CURRENT_YEAR_REF);

                        yearElement.trigger('click');

                        expect(wrapper.vm.onYearClick).toHaveBeenCalledTimes(1);
                    });

                    it(`will switch picker mode to year`, () => {
                        const yearElement: Wrapper<Vue> = wrapper.find(CURRENT_YEAR_REF);

                        yearElement.trigger('click');

                        expect(wrapper.vm.isPickerModeDay).toBe(false);
                        expect(wrapper.vm.isPickerModeMonth).toBe(false);
                        expect(wrapper.vm.isPickerModeYear).toBe(true);
                    });
                });
                describe('to month', () => {
                    it(`will call event handler`, () => {
                        wrapper.setMethods({ 'onMonthClick': jest.fn() });
                        const monthElement: Wrapper<Vue> = wrapper.find(CURRENT_MONTH_REF);

                        monthElement.trigger('click');

                        expect(wrapper.vm.onMonthClick).toHaveBeenCalledTimes(1);
                    });

                    it(`will switch picker mode to year`, () => {
                        const monthElement: Wrapper<Vue> = wrapper.find(CURRENT_MONTH_REF);

                        monthElement.trigger('click');

                        expect(wrapper.vm.isPickerModeDay).toBe(false);
                        expect(wrapper.vm.isPickerModeMonth).toBe(true);
                        expect(wrapper.vm.isPickerModeYear).toBe(false);
                    });
                });
            });
        });
    });

    describe(`in month picker mode`, () => {
        beforeEach(() => {
            initialPickerMode = PickerMode.MONTH;
        });

        it(`should render a list of months`, async () => {
            initializeWrapper();
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        describe(`when selecting a month`, () => {
            beforeEach(() => {
                initializeWrapper();
            });

            it(`will call event handler`, () => {
                wrapper.setMethods({ 'onMonthSelect': jest.fn() });
                const monthElement: Wrapper<Vue> = wrapper.find(SELECTABLE_MONTH_REF);

                monthElement.trigger('click', calendar.months[CURRENT_MONTH_INDEX]);

                expect(wrapper.vm.onMonthSelect).toHaveBeenCalledTimes(1);
            });

            it(`will throw related calendar event`, () => {
                const monthElement: Wrapper<Vue> = wrapper.find(SELECTABLE_MONTH_REF);

                monthElement.trigger('click', calendar.months[CURRENT_MONTH_INDEX]);

                expect(wrapper.emitted(CalendarEvent.MONTH_SELECT)).toEqual([[calendar.months[CURRENT_MONTH_INDEX]]]);
            });

            it(`will switch picker mode to day`, () => {
                const monthElement: Wrapper<Vue> = wrapper.find(SELECTABLE_MONTH_REF);

                monthElement.trigger('click', calendar.months[CURRENT_MONTH_INDEX]);

                expect(wrapper.vm.isPickerModeDay).toBe(true);
                expect(wrapper.vm.isPickerModeMonth).toBe(false);
                expect(wrapper.vm.isPickerModeYear).toBe(false);
            });
        });
    });

    describe(`in year picker mode`, () => {
        beforeEach(() => {
            initialPickerMode = PickerMode.YEAR;
        });

        it(`should render a list of years`, async () => {
            initializeWrapper();
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        describe(`when selecting a year`, () => {
            let year: YearState;

            beforeEach(() => {
                initializeWrapper();
                year = calendar.years.find((value: YearState) => value.year === CURRENT_YEAR);
            });

            it(`will call event handler`, () => {
                wrapper.setMethods({ 'onYearSelect': jest.fn() });
                const yearElement: Wrapper<Vue> = wrapper.find(SELECTABLE_YEAR_REF);

                yearElement.trigger('click', year);

                expect(wrapper.vm.onYearSelect).toHaveBeenCalledTimes(1);
            });

            it(`will throw related calendar event`, () => {
                const yearElement: Wrapper<Vue> = wrapper.find(SELECTABLE_YEAR_REF);

                yearElement.trigger('click', year);

                expect(wrapper.emitted(CalendarEvent.YEAR_SELECT)).toEqual([[year]]);
            });

            it(`will switch picker mode to month`, () => {
                const yearElement: Wrapper<Vue> = wrapper.find(SELECTABLE_YEAR_REF);

                yearElement.trigger('click', year);

                expect(wrapper.vm.isPickerModeDay).toBe(false);
                expect(wrapper.vm.isPickerModeMonth).toBe(true);
                expect(wrapper.vm.isPickerModeYear).toBe(false);
            });
        });
    });
});
