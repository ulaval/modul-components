import ModulDate, { DatePrecision } from '../../../../utils/modul-date/modul-date';
import { MAX_DATE_OFFSET, MIN_DATE_OFFSET, RangeDate, SingleDate } from './abstract-calendar-state';
import abstractCalendarStateTests from './abstract-calendar-state.spec.base';
import CalendarRangeDateState from './calendar-range-date-state';
import CalendarState, { Calendar, CalendarCurrentState, CalendarEvent, CalendarEvents, DaySelectCallBack, DayState } from './calendar-state';

const NOW: ModulDate = new ModulDate();

const CURRENT_VALUE_BEGIN: RangeDate = { begin: '2019-03-15' };
const CURRENT_VALUE_END: RangeDate = { end: '2019-04-16' };
const CURRENT_VALUE_BOTH: RangeDate = { begin: '2019-03-15', end: '2019-04-16' };

const CURRENT_DATE_NEAR_MIN_DATE: string = '2018-01-30';
const CURRENT_DATE_NEAR_MAX_DATE: string = '2020-01-01';

const FIRST_DATE_PICKED: string = '2019-06-03';
const SECOND_DATE_PICKED: string = '2019-06-06';

const MIN_DATE: string = '2018-01-15';
const MAX_DATE: string = '2020-01-15';

const FIRST_DAY_STATE: DayState = {
    date: new ModulDate('2019-06-03'),
    day: 3, month: 5, year: 2019,
    isDisabled: false, isHighlighted: false,
    isInNextMonth: false, isInPreviousMonth: false,
    isSelected: false, isToday: false,
    hasFocus: false,
    isSelectionStart: false,
    isSelectionEnd: false
};

const SECOND_DAY_STATE: DayState = {
    date: new ModulDate('2019-06-10'),
    day: 10, month: 5, year: 2019,
    isDisabled: false, isHighlighted: false,
    isInNextMonth: false, isInPreviousMonth: false,
    isSelected: false, isToday: false,
    hasFocus: false,
    isSelectionStart: false,
    isSelectionEnd: false
};

const DAY_SELECT_CALLBACK: DaySelectCallBack = jest.fn() as DaySelectCallBack;

describe(`A range date state`, () => {
    let calendarRangeDateState: CalendarState;
    beforeEach(() => {
        calendarRangeDateState = new CalendarRangeDateState(CURRENT_VALUE_BOTH, MIN_DATE, MAX_DATE);
        calendarRangeDateState.onDateSelect(DAY_SELECT_CALLBACK);
    });

    describe('when building a calendar', () => {
        let calendar: Calendar;

        describe(`from default value`, () => {

            beforeEach(() => {
                calendarRangeDateState = new CalendarRangeDateState();
                calendar = calendarRangeDateState.buildCurrentCalendar().calendar;
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

        describe(`from a date range with only a begin value`, () => {
            beforeEach(() => {
                calendarRangeDateState = new CalendarRangeDateState(CURRENT_VALUE_BEGIN);
                calendar = calendarRangeDateState.buildCurrentCalendar().calendar;
            });

            it(`then the currently displayed value will be for today`, () => {
                expect(calendar.dates.current.toString()).toBe(CURRENT_VALUE_BEGIN.begin);
            });

            it(`then the minimum date will be today minus ${MIN_DATE_OFFSET} years`, () => {
                const nowMinusOffset: ModulDate = new ModulDate(NOW.fullYear() - MIN_DATE_OFFSET, NOW.month(), NOW.day());

                expect(calendar.dates.min.isSame(nowMinusOffset, DatePrecision.DAY)).toBe(true);
            });

            it(`then the maximum date will be today plus ${MAX_DATE_OFFSET} years`, () => {
                const nowPlusOffset: ModulDate = new ModulDate(NOW.fullYear() + MAX_DATE_OFFSET, NOW.month(), NOW.day());

                expect(calendar.dates.max.isSame(nowPlusOffset, DatePrecision.DAY)).toBe(true);
            });

            it(`then current value will be defined`, () => {
                const selectedDate: DayState[] = calendar.days.filter((day: DayState) => day.isSelected === true);

                expect(selectedDate).toHaveLength(1);
            });
        });

        describe(`from a date range with only a end value`, () => {
            beforeEach(() => {
                calendarRangeDateState = new CalendarRangeDateState(CURRENT_VALUE_END);
                calendar = calendarRangeDateState.buildCurrentCalendar().calendar;
            });

            it(`then the currently displayed value will be for today`, () => {
                expect(calendar.dates.current.toString()).toBe(CURRENT_VALUE_END.end);
            });

            it(`then the minimum date will be today minus ${MIN_DATE_OFFSET} years`, () => {
                const nowMinusOffset: ModulDate = new ModulDate(NOW.fullYear() - MIN_DATE_OFFSET, NOW.month(), NOW.day());

                expect(calendar.dates.min.isSame(nowMinusOffset, DatePrecision.DAY)).toBe(true);
            });

            it(`then the maximum date will be today plus ${MAX_DATE_OFFSET} years`, () => {
                const nowPlusOffset: ModulDate = new ModulDate(NOW.fullYear() + MAX_DATE_OFFSET, NOW.month(), NOW.day());

                expect(calendar.dates.max.isSame(nowPlusOffset, DatePrecision.DAY)).toBe(true);
            });

            it(`then current value will be defined`, () => {
                const selectedDate: DayState[] = calendar.days.filter((day: DayState) => day.isSelected === true);

                expect(selectedDate).toHaveLength(1);
            });
        });

        describe(`from a date range with all values provided`, () => {
            beforeEach(() => {
                calendarRangeDateState = new CalendarRangeDateState(CURRENT_VALUE_BOTH, MIN_DATE, MAX_DATE);
                calendar = calendarRangeDateState.buildCurrentCalendar().calendar;
            });

            it(`then the currently displayed value will be for the current value's month`, () => {
                expect(calendar.dates.current.toString()).toBe(CURRENT_VALUE_BOTH.begin);
            });

            it(`then the minimum date will be ${MIN_DATE}`, () => {
                expect(calendar.dates.min.isSame(new ModulDate(MIN_DATE), DatePrecision.DAY)).toBe(true);
            });

            it(`then the maximum date will be ${MAX_DATE}`, () => {
                expect(calendar.dates.max.isSame(new ModulDate(MAX_DATE), DatePrecision.DAY)).toBe(true);
            });

            it(`then current value will be selected`, () => {
                const selectedDate: DayState[] = calendar.days.filter((day: DayState) => day.isSelected === true);

                expect(selectedDate).toHaveLength(1);
            });

            it(`then values between selected dates will be highlighted`, () => {
                const selectedDate: DayState[] = calendar.days.filter((day: DayState) => day.isHighlighted === true);

                expect(selectedDate).toHaveLength(23);
            });

            it(`dates before the minumum will be disabled`, () => {
                const calendar: Calendar = new CalendarRangeDateState({ begin: CURRENT_DATE_NEAR_MIN_DATE, end: SECOND_DATE_PICKED }, MIN_DATE, MAX_DATE).buildCurrentCalendar().calendar;

                const disabledDays: DayState[] = calendar.days.filter((day: DayState) => day.isDisabled);

                expect(disabledDays).toHaveLength(15);
            });

            it(`dates after the maximum will be disabled`, () => {
                const calendar: Calendar = new CalendarRangeDateState({ begin: CURRENT_DATE_NEAR_MAX_DATE, end: SECOND_DATE_PICKED }, MIN_DATE, MAX_DATE).buildCurrentCalendar().calendar;

                const disabledDays: DayState[] = calendar.days.filter((day: DayState) => day.isDisabled);

                expect(disabledDays).toHaveLength(17);
            });
        });
    });

    describe(`when updating value`, () => {
        describe(`without prior value`, () => {
            it(`will update begin value`, () => {
                const calendarRangeDateState: CalendarRangeDateState = new CalendarRangeDateState();
                calendarRangeDateState.updateState({ begin: FIRST_DATE_PICKED });

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: FIRST_DATE_PICKED, end: '' });

            });

            it(`will update end value`, () => {
                const calendarRangeDateState: CalendarRangeDateState = new CalendarRangeDateState();
                calendarRangeDateState.updateState({ end: FIRST_DATE_PICKED });

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: '', end: FIRST_DATE_PICKED });

            });

            it(`will update both values`, () => {
                const calendarRangeDateState: CalendarRangeDateState = new CalendarRangeDateState();
                calendarRangeDateState.updateState({ begin: FIRST_DATE_PICKED, end: SECOND_DATE_PICKED });

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: FIRST_DATE_PICKED, end: SECOND_DATE_PICKED });

            });
        });

        describe(`with a begin date`, () => {
            let calendarRangeDateState: CalendarRangeDateState;

            beforeAll(() => {
                calendarRangeDateState = new CalendarRangeDateState(CURRENT_VALUE_BEGIN);
            });

            it(`when updating begin value, will replace begin value and clear end value`, () => {
                const calendarRangeDateState: CalendarRangeDateState = new CalendarRangeDateState();
                calendarRangeDateState.updateState({ begin: FIRST_DATE_PICKED });

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: FIRST_DATE_PICKED, end: '' });

            });

            it(`when updating end value, will clear begin value and replace end value`, () => {
                calendarRangeDateState.updateState({ end: FIRST_DATE_PICKED });

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: '', end: FIRST_DATE_PICKED });
            });

            it(`when updating both values, will replace both values`, () => {
                calendarRangeDateState.updateState({ begin: FIRST_DATE_PICKED, end: SECOND_DATE_PICKED });

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: FIRST_DATE_PICKED, end: SECOND_DATE_PICKED });
            });

            it(`when updating with nothing, will clear both values`, () => {
                calendarRangeDateState.updateState({});

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: '', end: '' });
            });
        });

        describe(`with a end date`, () => {
            let calendarRangeDateState: CalendarRangeDateState;

            beforeAll(() => {
                calendarRangeDateState = new CalendarRangeDateState(CURRENT_VALUE_END);
            });

            it(`when updating begin value, will replace begin value and clear end value`, () => {
                const calendarRangeDateState: CalendarRangeDateState = new CalendarRangeDateState();
                calendarRangeDateState.updateState({ begin: FIRST_DATE_PICKED });

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: FIRST_DATE_PICKED, end: '' });

            });

            it(`when updating end value, will clear begin value and replace end value`, () => {
                calendarRangeDateState.updateState({ end: FIRST_DATE_PICKED });

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: '', end: FIRST_DATE_PICKED });
            });

            it(`when updating both values, will replace both values`, () => {
                calendarRangeDateState.updateState({ begin: FIRST_DATE_PICKED, end: SECOND_DATE_PICKED });

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: FIRST_DATE_PICKED, end: SECOND_DATE_PICKED });
            });

            it(`when updating with nothing, will clear both values`, () => {
                calendarRangeDateState.updateState({});

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: '', end: '' });
            });
        });

        describe(`with a both values`, () => {
            let calendarRangeDateState: CalendarRangeDateState;

            beforeAll(() => {
                calendarRangeDateState = new CalendarRangeDateState(CURRENT_VALUE_BOTH);
            });

            it(`when updating begin value, will replace begin value and clear end value`, () => {
                const calendarRangeDateState: CalendarRangeDateState = new CalendarRangeDateState();
                calendarRangeDateState.updateState({ begin: FIRST_DATE_PICKED });

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: FIRST_DATE_PICKED, end: '' });

            });

            it(`when updating end value, will clear begin value and replace end value`, () => {
                calendarRangeDateState.updateState({ end: FIRST_DATE_PICKED });

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: '', end: FIRST_DATE_PICKED });
            });

            it(`when updating both values, will replace both values`, () => {
                calendarRangeDateState.updateState({ begin: FIRST_DATE_PICKED, end: SECOND_DATE_PICKED });

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: FIRST_DATE_PICKED, end: SECOND_DATE_PICKED });
            });

            it(`when updating with nothing, will clear both values`, () => {
                calendarRangeDateState.updateState({});

                const calendar: Calendar = calendarRangeDateState.buildCurrentCalendar().calendar;

                expect(calendar.value).toEqual({ begin: '', end: '' });
            });
        });
    });
    describe('calendar events', () => {
        let calendarEvents: CalendarEvents;

        beforeEach(() => {
            calendarEvents = calendarRangeDateState.buildCurrentCalendar().calendarEvents;
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

                it('when picking a first date, without prior date selection, will update the date range', () => {
                    calendarRangeDateState = new CalendarRangeDateState(undefined, MIN_DATE, MAX_DATE);
                    const calendarState: CalendarCurrentState = calendarRangeDateState.buildCurrentCalendar();
                    const events: CalendarEvents = calendarState.calendarEvents;
                    events[CalendarEvent.DAY_SELECT](FIRST_DAY_STATE);

                    const selectedDays: DayState[] = calendarRangeDateState.buildCurrentCalendar().calendar
                        .days.filter((day: DayState) => day.isSelected);

                    expect(selectedDays).toHaveLength(1);
                    expect(selectedDays[0].day).toBe(3);
                    expect(selectedDays[0].month).toBe(5);
                    expect(selectedDays[0].year).toBe(2019);
                });

                it('when picking a first date, will update the date range', () => {
                    calendarEvents[CalendarEvent.DAY_SELECT](FIRST_DAY_STATE);

                    const selectedDays: DayState[] = calendarRangeDateState.buildCurrentCalendar().calendar
                        .days.filter((day: DayState) => day.isSelected);

                    expect(selectedDays).toHaveLength(1);
                    expect(selectedDays[0].day).toBe(3);
                    expect(selectedDays[0].month).toBe(5);
                    expect(selectedDays[0].year).toBe(2019);
                });

                it('when picking a second date, will update the date range', () => {
                    calendarEvents[CalendarEvent.DAY_SELECT](FIRST_DAY_STATE);
                    calendarEvents[CalendarEvent.DAY_SELECT](SECOND_DAY_STATE);

                    const selectedDays: DayState[] = calendarRangeDateState.buildCurrentCalendar().calendar
                        .days.filter((day: DayState) => day.isSelected);

                    expect(selectedDays).toHaveLength(2);
                    expect(selectedDays[0].day).toBe(3);
                    expect(selectedDays[0].month).toBe(5);
                    expect(selectedDays[0].year).toBe(2019);

                    expect(selectedDays[1].day).toBe(10);
                    expect(selectedDays[1].month).toBe(5);
                    expect(selectedDays[1].year).toBe(2019);
                });

                it(`will update current date through callback`, () => {
                    calendarRangeDateState.onDateSelect((date: string) => expect(date).toEqual({ begin: FIRST_DATE_PICKED, end: '' }));
                    calendarEvents[CalendarEvent.DAY_SELECT](FIRST_DAY_STATE);

                });

                it(`will update the currently displayed date`, () => {
                    calendarEvents[CalendarEvent.DAY_SELECT](FIRST_DAY_STATE);

                    const currentDate: string = calendarRangeDateState.buildCurrentCalendar().calendar.dates.current.toString();

                    expect(currentDate).toBe(FIRST_DATE_PICKED);
                });

                it(`will do nothing if day is disabled`, () => {
                    const newDay: DayState = Object.assign(FIRST_DAY_STATE, { isDisabled: true });
                    calendarEvents[CalendarEvent.DAY_SELECT](newDay);

                    const currentDate: SingleDate | RangeDate | undefined = calendarRangeDateState.buildCurrentCalendar().calendar.value;

                    expect(currentDate).toEqual(CURRENT_VALUE_BOTH);
                });
            });

            describe(`${CalendarEvent.DAY_MOUSE_ENTER}`, () => {
                it(`when a first date is selected, will highlight dates in interval, up to second date`, () => {
                    calendarRangeDateState = new CalendarRangeDateState({ begin: FIRST_DATE_PICKED }, MIN_DATE, MAX_DATE);
                    const calendarState: CalendarCurrentState = calendarRangeDateState.buildCurrentCalendar();
                    const events: CalendarEvents = calendarState.calendarEvents;
                    events[CalendarEvent.DAY_MOUSE_ENTER](SECOND_DAY_STATE);

                    const highlightedDays: DayState[] = calendarRangeDateState.buildCurrentCalendar().calendar
                        .days.filter((day: DayState) => day.isHighlighted);

                    const selectedDays: DayState[] = calendarRangeDateState.buildCurrentCalendar().calendar
                        .days.filter((day: DayState) => day.isSelected);

                    expect(highlightedDays).toHaveLength(8);
                    expect(selectedDays).toHaveLength(1);

                    expect(highlightedDays[0].day).toBe(3);
                    expect(highlightedDays[0].month).toBe(5);
                    expect(highlightedDays[0].year).toBe(2019);

                    expect(highlightedDays[highlightedDays.length / 2].day).toBe(7);
                    expect(highlightedDays[highlightedDays.length / 2].month).toBe(5);
                    expect(highlightedDays[highlightedDays.length / 2].year).toBe(2019);

                    expect(highlightedDays.slice(-1)[0].day).toBe(10);
                    expect(highlightedDays.slice(-1)[0].month).toBe(5);
                    expect(highlightedDays.slice(-1)[0].year).toBe(2019);
                });
            });

            describe(`${CalendarEvent.DAY_MOUSE_LEAVE}`, () => {
                it(`wont change the state of the calendar`, () => {
                    const initialCalendarState: CalendarCurrentState = calendarRangeDateState.buildCurrentCalendar();

                    calendarEvents[CalendarEvent.DAY_MOUSE_LEAVE](FIRST_DAY_STATE);

                    const newCalendarState: CalendarCurrentState = calendarRangeDateState.buildCurrentCalendar();

                    expect(newCalendarState).toEqual(initialCalendarState);
                });
            });
        });
    });

    abstractCalendarStateTests((value: string, minDate: string, maxDate: string) => new CalendarRangeDateState({ begin: value }, minDate, maxDate));

});
