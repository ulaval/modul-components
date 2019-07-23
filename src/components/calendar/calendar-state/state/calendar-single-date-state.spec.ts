import ModulDate, { DatePrecision } from '../../../../utils/modul-date/modul-date';
import { MAX_DATE_OFFSET, MIN_DATE_OFFSET } from './abstract-calendar-state';
import abstractCalendarStateTests from './abstract-calendar-state.spec.base';
import CalendarSingleDateState from './calendar-single-date-state';
import CalendarState, { Calendar, CalendarCurrentState, CalendarEvent, CalendarEvents, DaySelectCallBack, DayState } from './calendar-state';

const NOW: ModulDate = new ModulDate();

const CURRENT_VALUE: string = '2019-03-15';
const CURRENT_VALUE_NEAR_MIN: string = '2018-01-30';
const CURRENT_VALUE_NEAR_MAX: string = '2020-01-01';

const MIN_DATE: string = '2018-01-15';
const MAX_DATE: string = '2020-01-15';

const NEW_DATE: string = '2019-06-03';

const NEW_DAY_STATE: DayState = {
    date: new ModulDate('2019-06-03'),
    day: 3, month: 5, year: 2019,
    isDisabled: false, isHighlighted: false,
    isInNextMonth: false, isInPreviousMonth: false,
    isSelected: false, isToday: false,
    hasFocus: false,
    isSelectionStart: false,
    isSelectionEnd: false
};


const DAY_SELECT_CALLBACK: DaySelectCallBack = jest.fn() as DaySelectCallBack;

describe(`A single date state`, () => {

    let calendarSingleDateState: CalendarState;
    beforeEach(() => {
        calendarSingleDateState = new CalendarSingleDateState(CURRENT_VALUE, MIN_DATE, MAX_DATE);
        calendarSingleDateState.onDateSelect(DAY_SELECT_CALLBACK);
    });

    describe('when building a calendar', () => {
        let calendar: Calendar;

        describe(`from default value`, () => {

            beforeEach(() => {
                calendarSingleDateState = new CalendarSingleDateState();
                calendar = calendarSingleDateState.buildCurrentCalendar().calendar;
            });

            it(`then the currently displayed value will be for today`, () => {
                expect(calendar.dates.current.toString()).toBe(NOW.toString());
            });

            it(`then the minimum date will be today minus ${MIN_DATE_OFFSET} years`, () => {
                const nowMinusOffset: ModulDate = new ModulDate(NOW.fullYear() - MIN_DATE_OFFSET, NOW.month(), NOW.day());

                expect(calendar.dates.min.isSame(nowMinusOffset, DatePrecision.DAY)).toBe(true);
            });

            it(`then the maximum date will be today plus ${MAX_DATE_OFFSET} years`, () => {
                const nowPlusOffset: ModulDate = new ModulDate(NOW.fullYear() + MAX_DATE_OFFSET, NOW.month(), NOW.day());

                expect(calendar.dates.max.isSame(nowPlusOffset, DatePrecision.DAY)).toBe(true);
            });

            it(`then current value will be undefined`, () => {
                const selectedDate: DayState[] = calendar.days.filter((day: DayState) => day.isSelected === true);

                expect(selectedDate).toHaveLength(0);
            });

            it(`today will be highlighted`, () => {
                const today: DayState[] = calendar.days.filter((day: DayState) => day.isToday === true);

                expect(today).toHaveLength(1);
            });
        });

        describe(`from provided value`, () => {

            beforeEach(() => {
                calendar = calendarSingleDateState.buildCurrentCalendar().calendar;
            });

            it(`then the currently displayed value will be for the current value's month`, () => {
                expect(calendar.dates.current.toString()).toBe(CURRENT_VALUE);
            });

            it(`then the minimum date will be ${MIN_DATE}`, () => {
                expect(calendar.dates.min.isSame(new ModulDate(MIN_DATE), DatePrecision.DAY)).toBe(true);
            });

            it(`then the maximum date will be ${MAX_DATE}`, () => {
                expect(calendar.dates.max.isSame(new ModulDate(MAX_DATE), DatePrecision.DAY)).toBe(true);
            });

            it(`then current value will be defined`, () => {
                const selectedDate: DayState[] = calendar.days.filter((day: DayState) => day.isSelected === true);

                expect(selectedDate).toHaveLength(1);
            });

            it(`dates before the minumum will be disabled`, () => {
                const calendar: Calendar = new CalendarSingleDateState(CURRENT_VALUE_NEAR_MIN, MIN_DATE, MAX_DATE).buildCurrentCalendar().calendar;

                const disabledDays: DayState[] = calendar.days.filter((day: DayState) => day.isDisabled);

                expect(disabledDays).toHaveLength(15);
            });

            it(`dates after the maximu will be disabled`, () => {
                const calendar: Calendar = new CalendarSingleDateState(CURRENT_VALUE_NEAR_MAX, MIN_DATE, MAX_DATE).buildCurrentCalendar().calendar;

                const disabledDays: DayState[] = calendar.days.filter((day: DayState) => day.isDisabled);

                expect(disabledDays).toHaveLength(17);
            });
        });
    });

    describe(`when updating value`, () => {
        it(`will update current date through callback`, () => {
            calendarSingleDateState.updateState(NEW_DATE);

            const calendar: Calendar = calendarSingleDateState.buildCurrentCalendar().calendar;

            expect(calendar.value).toBe(NEW_DATE);
        });

        it(`will update the currently displayed date`, () => {
            calendarSingleDateState.updateState(NEW_DATE);

            const currentDate: string = calendarSingleDateState.buildCurrentCalendar().calendar.dates.current.toString();

            expect(currentDate).toBe(NEW_DATE);
        });

        it(`will update current date when new value is undefined`, () => {
            calendarSingleDateState.updateState(undefined as any);

            const calendar: Calendar = calendarSingleDateState.buildCurrentCalendar().calendar;

            expect(calendar.value).toBe('');
        });
    });

    describe('calendar events', () => {
        let calendarEvents: CalendarEvents;

        beforeEach(() => {
            calendarEvents = calendarSingleDateState.buildCurrentCalendar().calendarEvents;
        });

        describe(`when building events`, () => {
            it(`then all events will be correctly initialized`, () => {
                expect(Object.keys(calendarEvents)).toHaveLength(11);
                expect(calendarEvents[CalendarEvent.DAY_SELECT]).toBeDefined();
                expect(calendarEvents[CalendarEvent.DAY_MOUSE_ENTER]).toBeDefined();
                expect(calendarEvents[CalendarEvent.DAY_MOUSE_ENTER]).toBeDefined();
                expect(calendarEvents[CalendarEvent.DAY_KEYBOARD_TAB]).toBeDefined();
                expect(calendarEvents[CalendarEvent.MONTH_SELECT]).toBeDefined();
                expect(calendarEvents[CalendarEvent.MONTH_NEXT]).toBeDefined();
                expect(calendarEvents[CalendarEvent.MONTH_PREVIOUS]).toBeDefined();
                expect(calendarEvents[CalendarEvent.YEAR_SELECT]).toBeDefined();
                expect(calendarEvents[CalendarEvent.YEAR_NEXT]).toBeDefined();
                expect(calendarEvents[CalendarEvent.YEAR_PREVIOUS]).toBeDefined();
                expect(calendarEvents[CalendarEvent.YEAR_MONTH_SELECT]).toBeDefined();
            });
        });
        describe(`day events`, () => {
            describe(`${CalendarEvent.DAY_SELECT}`, () => {
                it(`will update selected day`, () => {
                    calendarEvents[CalendarEvent.DAY_SELECT](NEW_DAY_STATE);

                    const selectedDays: DayState[] = calendarSingleDateState.buildCurrentCalendar().calendar
                        .days.filter((day: DayState) => day.isSelected);

                    expect(selectedDays).toHaveLength(1);
                    expect(selectedDays[0].day).toBe(3);
                    expect(selectedDays[0].month).toBe(5);
                    expect(selectedDays[0].year).toBe(2019);
                });

                it(`will update current date through callback`, () => {
                    calendarSingleDateState.onDateSelect((date: string) => expect(date).toBe(NEW_DATE));
                    calendarEvents[CalendarEvent.DAY_SELECT](NEW_DAY_STATE);
                });

                it(`will update the currently displayed date`, () => {
                    calendarEvents[CalendarEvent.DAY_SELECT](NEW_DAY_STATE);

                    const currentDate: string = calendarSingleDateState.buildCurrentCalendar().calendar.dates.current.toString();

                    expect(currentDate).toBe(NEW_DATE);
                });

                it(`will do nothing if day is disabled`, () => {
                    const newDay: DayState = Object.assign(NEW_DAY_STATE, { isDisabled: true });
                    calendarEvents[CalendarEvent.DAY_SELECT](newDay);

                    const currentDate: string = calendarSingleDateState.buildCurrentCalendar().calendar.dates.current.toString();

                    expect(currentDate).toBe(CURRENT_VALUE);
                });
            });

            describe(`${CalendarEvent.DAY_MOUSE_ENTER}`, () => {
                it(`wont change the state of the calendar`, () => {
                    const initialCalendarState: CalendarCurrentState = calendarSingleDateState.buildCurrentCalendar();

                    calendarEvents[CalendarEvent.DAY_MOUSE_ENTER](NEW_DAY_STATE);

                    const newCalendarState: CalendarCurrentState = calendarSingleDateState.buildCurrentCalendar();

                    expect(newCalendarState).toEqual(initialCalendarState);
                });
            });

            describe(`${CalendarEvent.DAY_MOUSE_LEAVE}`, () => {
                it(`wont change the state of the calendar`, () => {
                    const initialCalendarState: CalendarCurrentState = calendarSingleDateState.buildCurrentCalendar();

                    calendarEvents[CalendarEvent.DAY_MOUSE_LEAVE](NEW_DAY_STATE);

                    const newCalendarState: CalendarCurrentState = calendarSingleDateState.buildCurrentCalendar();

                    expect(newCalendarState).toEqual(initialCalendarState);
                });
            });
        });
    });

    abstractCalendarStateTests((value: string, minDate: string, maxDate: string) => new CalendarSingleDateState(value, minDate, maxDate));

});
