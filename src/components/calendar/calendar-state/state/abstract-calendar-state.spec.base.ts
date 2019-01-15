import CalendarState, { Calendar, CalendarEvent, CalendarEvents, DayState, MonthState, YearState } from './calendar-state';

const MIN_DATE: string = '2017-06-15';
const MAX_DATE: string = '2021-08-13';
const CURRENT_VALUE: string = '2019-12-14';

const NEW_DAY_STATE: Partial<DayState> = {
    day: 3,
    month: 5,
    year: 2019,
    isDisabled: false
};

const abstractCalendarStateTests: Function = (stateBuilder: (currentValue: string, minDate: string, maxDate: string) => CalendarState) => {

    describe(`when calling event (from abstract class)`, () => {
        let calendarState: CalendarState;
        let calendarEvents: CalendarEvents;
        beforeEach(() => {
            calendarState = stateBuilder(CURRENT_VALUE, MIN_DATE, MAX_DATE);
            calendarEvents = calendarState.buildCurrentCalendar().calendarEvents;

        });
        describe(`day events`, () => {
            describe(`${CalendarEvent.DAY_SELECT}`, () => {
                it(`will set focus on selected day`, () => {
                    calendarEvents[CalendarEvent.DAY_SELECT](NEW_DAY_STATE as DayState);

                    const selectedDays: DayState[] = calendarState.buildCurrentCalendar().calendar
                        .days.filter((day: DayState) => day.hasFocus);

                    expect(selectedDays).toHaveLength(1);
                    expect(selectedDays[0].day).toBe(3);
                    expect(selectedDays[0].month).toBe(5);
                    expect(selectedDays[0].year).toBe(2019);
                });
            });
        });

        describe(`month events`, () => {
            describe(`${CalendarEvent.MONTH_SELECT}`, () => {
                it(`will update to the selected month`, () => {
                    calendarEvents[CalendarEvent.MONTH_SELECT]({ month: 1, isDisabled: false, isCurrent: false } as MonthState);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.month()).toEqual(1);
                });

                it(`when selecting a month before the minimum date, the current month will be set to the minimum`, () => {
                    calendarState = stateBuilder('2019-06-15', '2019-06-01', MAX_DATE);
                    calendarEvents[CalendarEvent.MONTH_SELECT]({ month: 1, isDisabled: false, isCurrent: false } as MonthState);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.month()).toEqual(5);
                });

                it(`when selecting a month after the maximum date, the current month will be set to the maximum`, () => {
                    calendarState = stateBuilder('2019-06-15', MIN_DATE, '2019-06-01');
                    calendarEvents[CalendarEvent.MONTH_SELECT]({ month: 11, isDisabled: false, isCurrent: false } as MonthState);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.month()).toEqual(5);
                });
            });

            describe(`${CalendarEvent.MONTH_NEXT}`, () => {
                it(`will update to the next month`, () => {
                    const initialCalendar: Calendar = calendarState.buildCurrentCalendar().calendar;
                    const currentMonth: number = initialCalendar.dates.current.month();
                    calendarEvents[CalendarEvent.MONTH_NEXT]({} as Event);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.month()).toEqual((currentMonth + 1) % 12);
                });

                it(`when currently at limit month, the current month will be unchanged`, () => {
                    calendarState = stateBuilder(MAX_DATE, MIN_DATE, MAX_DATE);
                    const initialCalendar: Calendar = calendarState.buildCurrentCalendar().calendar;
                    const currentMonth: number = initialCalendar.dates.current.month();
                    calendarEvents[CalendarEvent.MONTH_NEXT]({} as Event);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.month()).toEqual(currentMonth);
                });
            });

            describe(`${CalendarEvent.MONTH_PREVIOUS}`, () => {
                it(`will update to the previous month`, () => {
                    const initialCalendar: Calendar = calendarState.buildCurrentCalendar().calendar;
                    const currentMonth: number = initialCalendar.dates.current.month();
                    calendarEvents[CalendarEvent.MONTH_PREVIOUS]({} as Event);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.month()).toEqual(currentMonth - 1);
                });

                it(`when currently at limit month, the current month will be unchanged`, () => {
                    calendarState = stateBuilder(MIN_DATE, MIN_DATE, MAX_DATE);
                    const initialCalendar: Calendar = calendarState.buildCurrentCalendar().calendar;
                    const currentMonth: number = initialCalendar.dates.current.month();
                    calendarEvents[CalendarEvent.MONTH_PREVIOUS]({} as Event);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.month()).toEqual(currentMonth);
                });
            });
        });

        describe(`year events`, () => {
            describe(`${CalendarEvent.YEAR_SELECT}`, () => {
                it(`will update to the selected year`, () => {
                    calendarEvents[CalendarEvent.YEAR_SELECT]({ year: 2018, isDisabled: false, isCurrent: false } as YearState);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.fullYear()).toEqual(2018);
                });

                it(`when selecting a year before the minimum date, the current month will be set to the minimum`, () => {
                    calendarEvents[CalendarEvent.YEAR_SELECT]({ year: 2001, isDisabled: false, isCurrent: false } as YearState);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.fullYear()).toEqual(calendar.dates.min.fullYear());
                });

                it(`when selecting a year after the maximum date, the current month will be set to the maximum`, () => {
                    calendarEvents[CalendarEvent.YEAR_SELECT]({ year: 2020, isDisabled: false, isCurrent: false } as YearState);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.fullYear()).toEqual(2020);
                });
            });

            describe(`${CalendarEvent.YEAR_NEXT}`, () => {
                it(`will update to the next year`, () => {
                    const initialCalendar: Calendar = calendarState.buildCurrentCalendar().calendar;
                    const currentYear: number = initialCalendar.dates.current.fullYear();
                    calendarEvents[CalendarEvent.YEAR_NEXT]({} as Event);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.fullYear()).toEqual(currentYear + 1);
                });

                it(`when currently at limit year, the current year will be unchanged`, () => {
                    calendarState = stateBuilder(MAX_DATE, MIN_DATE, MAX_DATE);
                    const initialCalendar: Calendar = calendarState.buildCurrentCalendar().calendar;
                    const currentYear: number = initialCalendar.dates.current.fullYear();
                    calendarEvents[CalendarEvent.YEAR_NEXT]({} as Event);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.fullYear()).toEqual(currentYear);
                });
            });

            describe(`${CalendarEvent.YEAR_PREVIOUS}`, () => {
                it(`will update to the previous year`, () => {
                    const initialCalendar: Calendar = calendarState.buildCurrentCalendar().calendar;
                    const currentYear: number = initialCalendar.dates.current.fullYear();
                    calendarEvents[CalendarEvent.YEAR_PREVIOUS]({} as Event);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.fullYear()).toEqual(currentYear - 1);
                });

                it(`when currently at limit year, the current year will be unchanged`, () => {
                    calendarState = stateBuilder(MIN_DATE, MIN_DATE, MAX_DATE);
                    const initialCalendar: Calendar = calendarState.buildCurrentCalendar().calendar;
                    const currentYear: number = initialCalendar.dates.current.fullYear();
                    calendarEvents[CalendarEvent.YEAR_PREVIOUS]({} as Event);

                    const calendar: Calendar = calendarState.buildCurrentCalendar().calendar;

                    expect(calendar.dates.current.fullYear()).toEqual(currentYear);
                });
            });
        });
    });
};

export default abstractCalendarStateTests;
