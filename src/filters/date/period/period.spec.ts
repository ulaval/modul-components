import Vue from 'vue';
import { addMessages } from '../../../../tests/helpers/lang';
import { PERIOD_NAME } from '../../filter-names';
import { MPeriod, MPeriodFilterParams, PeriodFilter } from './period';

describe(PERIOD_NAME, () => {
    beforeEach(() => {
        addMessages(Vue, ['filters/date/period/period.lang.en.json', 'filters/date/date/date.lang.en.json']);
    });

    describe(`Given both dates are present`, () => {
        describe(`When fullmode is on`, () => {
            it(`should return a complete formatted period`, () => {
                const startDate: Date = new Date(2019, 3, 8);
                const endDate: Date = new Date(2019, 4, 14);
                const period: MPeriod = {
                    start: startDate,
                    end: endDate
                };
                const periodParams: MPeriodFilterParams = {
                    period,
                    fullMode: true
                };
                startDate.toLocaleDateString = jest.fn(() => '8 avril 2019');
                endDate.toLocaleDateString = jest.fn(() => '14 mai 2019');

                expect(PeriodFilter.formatPeriod(periodParams)).toEqual('Du 8 avril 2019 au 14 mai 2019');
            });
        });

        describe(`Given fullmode is off`, () => {
            describe(`When both start date and end date are the same day`, () => {
                it(`should return a formatted period with only one date`, () => {
                    const startDate: Date = new Date(2019, 3, 8);
                    const endDate: Date = new Date(2019, 3, 8);
                    const period: MPeriod = {
                        start: startDate,
                        end: endDate
                    };
                    const periodParams: MPeriodFilterParams = {
                        period
                    };
                    startDate.toLocaleDateString = jest.fn(() => '8 avril 2019');
                    endDate.toLocaleDateString = jest.fn(() => '8 avril 2019');

                    expect(PeriodFilter.formatPeriod(periodParams)).toEqual('Le 8 avril 2019');
                });
            });

            describe(`When both start date and end date are the same month`, () => {
                it(`should return a formatted period with 2 dates, but only one year and only one month`, () => {
                    const startDate: Date = new Date(2019, 3, 8);
                    const endDate: Date = new Date(2019, 3, 14);
                    const period: MPeriod = {
                        start: startDate,
                        end: endDate
                    };
                    const periodParams: MPeriodFilterParams = {
                        period
                    };
                    startDate.toLocaleDateString = jest.fn(() => '8');
                    endDate.toLocaleDateString = jest.fn(() => '14 avril 2019');
                    jest.spyOn(Vue.prototype.$i18n, 'getCurrentLocale').mockReturnValue('fr-CA');

                    expect(PeriodFilter.formatPeriod(periodParams)).toEqual('Du 8 au 14 avril 2019');
                    expect(startDate.toLocaleDateString).toHaveBeenCalledWith(['fr-CA'], {
                        year: undefined,
                        month: undefined,
                        day: 'numeric'
                    });
                });
            });

            describe(`When both start date and end date are the same year`, () => {
                it(`should return a formatted period with 2 dates, but only one year`, () => {
                    const startDate: Date = new Date(2019, 3, 8);
                    const endDate: Date = new Date(2019, 4, 14);
                    const period: MPeriod = {
                        start: startDate,
                        end: endDate
                    };
                    const periodParams: MPeriodFilterParams = {
                        period
                    };
                    startDate.toLocaleDateString = jest.fn(() => '8 avril');
                    endDate.toLocaleDateString = jest.fn(() => '14 mai 2019');
                    jest.spyOn(Vue.prototype.$i18n, 'getCurrentLocale').mockReturnValue('fr-CA');

                    expect(PeriodFilter.formatPeriod(periodParams)).toEqual('Du 8 avril au 14 mai 2019');
                    expect(startDate.toLocaleDateString).toHaveBeenCalledWith(['fr-CA'], {
                        year: undefined,
                        month: 'long',
                        day: 'numeric'
                    });
                });
            });

            describe(`When start date and end date have a different year`, () => {
                it(`should return a formatted period with 2 dates`, () => {
                    const startDate: Date = new Date(2019, 3, 8);
                    const endDate: Date = new Date(2020, 4, 14);
                    const period: MPeriod = {
                        start: startDate,
                        end: endDate
                    };
                    const periodParams: MPeriodFilterParams = {
                        period
                    };
                    startDate.toLocaleDateString = jest.fn(() => '8 avril 2019');
                    endDate.toLocaleDateString = jest.fn(() => '14 mai 2020');

                    expect(PeriodFilter.formatPeriod(periodParams)).toEqual('Du 8 avril 2019 au 14 mai 2020');
                });
            });
        });
    });

    describe(`Given the end date is missing`, () => {
        it(`then we only show the start date`, () => {
            const startDate: Date = new Date(2019, 3, 8);
            const period: MPeriod = {
                start: startDate
            };
            const periodParams: MPeriodFilterParams = {
                period
            };
            startDate.toLocaleDateString = jest.fn(() => '8 avril 2019');

            expect(PeriodFilter.formatPeriod(periodParams)).toEqual('Débute le 8 avril 2019');
        });
    });

    describe(`Given the start date is missing`, () => {
        it(`then we only show the end date`, () => {
            const endDate: Date = new Date(2019, 3, 8);
            const period: MPeriod = {
                end: endDate
            };
            const periodParams: MPeriodFilterParams = {
                period
            };
            endDate.toLocaleDateString = jest.fn(() => '8 avril 2019');

            expect(PeriodFilter.formatPeriod(periodParams)).toEqual('Se termine le 8 avril 2019');
        });
    });

    describe(`Given both dates are missing`, () => {
        it(`then it throws an error`, () => {
            const period: MPeriod = {};
            const periodParams: MPeriodFilterParams = {
                period
            };

            expect(() => PeriodFilter.formatPeriod(periodParams)).toThrow(Error);
        });
    });
});
