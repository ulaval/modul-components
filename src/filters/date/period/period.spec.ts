import Vue from 'vue';
import { addMessages } from '../../../../tests/helpers/lang';
import { PERIOD_NAME } from '../../filter-names';
import { MFormatMode, ModulPeriod, PeriodFilter } from './period';

describe(PERIOD_NAME, () => {
    beforeEach(() => {
        addMessages(Vue, ['filters/date/period/period.lang.en.json', 'filters/date/date/date.lang.en.json']);
    });

    describe(`Given both dates are present`, () => {

        describe(`Given fullmode is off`, () => {
            describe(`When both start date and end date are the same day`, () => {
                it(`should return a formatted period with only one date without shortDate periode params`, () => {
                    const startDate: Date = new Date(2019, 3, 8);
                    const endDate: Date = new Date(2019, 3, 8);
                    const period: ModulPeriod = {
                        start: startDate,
                        end: endDate
                    };
                    startDate.toLocaleDateString = jest.fn(() => '8 avril 2019');
                    endDate.toLocaleDateString = jest.fn(() => '8 avril 2019');

                    expect(PeriodFilter.formatPeriod(period)).toEqual('Le 8 avril 2019');
                });

                it(`should return a formatted period with only one date with shortDate periode params`, () => {
                    const startDate: Date = new Date(2019, 3, 8);
                    const endDate: Date = new Date(2019, 3, 8);
                    const period: ModulPeriod = {
                        start: startDate,
                        end: endDate
                    };
                    startDate.toLocaleDateString = jest.fn(() => '8 sept. 2019');
                    endDate.toLocaleDateString = jest.fn(() => '8 sept. 2019');

                    expect(PeriodFilter.formatPeriod(period, MFormatMode.ShortMonth)).toEqual('Le 8 sept. 2019');
                });
            });

            describe(`When both start date and end date are the same month`, () => {
                it(`should return a formatted period with 2 dates, but only one year and only one month without shortDate periode params`, () => {
                    const startDate: Date = new Date(2019, 3, 8);
                    const endDate: Date = new Date(2019, 3, 14);
                    const period: ModulPeriod = {
                        start: startDate,
                        end: endDate
                    };
                    startDate.toLocaleDateString = jest.fn(() => '8');
                    endDate.toLocaleDateString = jest.fn(() => '14 avril 2019');
                    jest.spyOn(Vue.prototype.$i18n, 'getCurrentLocale').mockReturnValue('fr-CA');

                    expect(PeriodFilter.formatPeriod(period)).toEqual('Du 8 au 14 avril 2019');
                    expect(startDate.toLocaleDateString).toHaveBeenCalledWith(['fr-CA'], {
                        year: undefined,
                        month: undefined,
                        day: 'numeric'
                    });
                });

                it(`should return a formatted period with 2 dates, but only one year and only one month with shortDate periode params`, () => {
                    const startDate: Date = new Date(2019, 3, 8);
                    const endDate: Date = new Date(2019, 3, 14);
                    const period: ModulPeriod = {
                        start: startDate,
                        end: endDate
                    };
                    startDate.toLocaleDateString = jest.fn(() => '8');
                    endDate.toLocaleDateString = jest.fn(() => '14 sept. 2019');
                    jest.spyOn(Vue.prototype.$i18n, 'getCurrentLocale').mockReturnValue('fr-CA');

                    expect(PeriodFilter.formatPeriod(period, MFormatMode.ShortMonth)).toEqual('Du 8 au 14 sept. 2019');
                    expect(startDate.toLocaleDateString).toHaveBeenCalledWith(['fr-CA'], {
                        year: undefined,
                        month: undefined,
                        day: 'numeric'
                    });
                });
            });

            describe(`When both start date and end date are the same year`, () => {
                it(`should return a formatted period with 2 dates, but only one year without shortDate periode params`, () => {
                    const startDate: Date = new Date(2019, 3, 8);
                    const endDate: Date = new Date(2019, 4, 14);
                    const period: ModulPeriod = {
                        start: startDate,
                        end: endDate
                    };
                    startDate.toLocaleDateString = jest.fn(() => '8 avril');
                    endDate.toLocaleDateString = jest.fn(() => '14 mai 2019');
                    jest.spyOn(Vue.prototype.$i18n, 'getCurrentLocale').mockReturnValue('fr-CA');

                    expect(PeriodFilter.formatPeriod(period)).toEqual('Du 8 avril au 14 mai 2019');
                    expect(startDate.toLocaleDateString).toHaveBeenCalledWith(['fr-CA'], {
                        year: undefined,
                        month: 'long',
                        day: 'numeric'
                    });
                });

                it(`should return a formatted period with 2 dates, but only one year with shortDate periode params`, () => {
                    const startDate: Date = new Date(2019, 3, 8);
                    const endDate: Date = new Date(2019, 4, 14);
                    const period: ModulPeriod = {
                        start: startDate,
                        end: endDate
                    };
                    startDate.toLocaleDateString = jest.fn(() => '8 avril');
                    endDate.toLocaleDateString = jest.fn(() => '14 sept. 2019');
                    jest.spyOn(Vue.prototype.$i18n, 'getCurrentLocale').mockReturnValue('fr-CA');

                    expect(PeriodFilter.formatPeriod(period, MFormatMode.ShortMonth)).toEqual('Du 8 avril au 14 sept. 2019');
                    expect(startDate.toLocaleDateString).toHaveBeenCalledWith(['fr-CA'], {
                        year: undefined,
                        month: 'short',
                        day: 'numeric'
                    });
                });
            });

            describe(`When start date and end date have a different year without shortDate periode params`, () => {
                it(`should return a formatted period with 2 dates`, () => {
                    const startDate: Date = new Date(2019, 3, 8);
                    const endDate: Date = new Date(2020, 4, 14);
                    const period: ModulPeriod = {
                        start: startDate,
                        end: endDate
                    };
                    startDate.toLocaleDateString = jest.fn(() => '8 avril 2019');
                    endDate.toLocaleDateString = jest.fn(() => '14 mai 2020');

                    expect(PeriodFilter.formatPeriod(period)).toEqual('Du 8 avril 2019 au 14 mai 2020');
                });
            });

            describe(`When start date and end date have a different year with shortDate periode params`, () => {
                it(`should return a formatted period with 2 dates`, () => {
                    const startDate: Date = new Date(2019, 3, 8);
                    const endDate: Date = new Date(2020, 4, 14);
                    const period: ModulPeriod = {
                        start: startDate,
                        end: endDate
                    };
                    startDate.toLocaleDateString = jest.fn(() => '8 avril 2019');
                    endDate.toLocaleDateString = jest.fn(() => '14 nov. 2020');

                    expect(PeriodFilter.formatPeriod(period, MFormatMode.ShortMonth)).toEqual('Du 8 avril 2019 au 14 nov. 2020');
                });
            });
        });
    });

    describe(`Given the end date is missing`, () => {
        it(`then we only show the start date`, () => {
            const startDate: Date = new Date(2019, 3, 8);
            const period: ModulPeriod = {
                start: startDate
            };
            startDate.toLocaleDateString = jest.fn(() => '8 avril 2019');

            expect(PeriodFilter.formatPeriod(period)).toEqual('Débute le 8 avril 2019');
        });
    });

    describe(`Given the start date is missing`, () => {
        it(`then we only show the end date`, () => {
            const endDate: Date = new Date(2019, 3, 8);
            const period: ModulPeriod = {
                end: endDate
            };
            endDate.toLocaleDateString = jest.fn(() => '8 avril 2019');

            expect(PeriodFilter.formatPeriod(period)).toEqual('Se termine le 8 avril 2019');
        });
    });

    describe(`Given both dates are missing`, () => {
        it(`then it throws an error`, () => {
            const period: ModulPeriod = {};

            expect(() => PeriodFilter.formatPeriod(period)).toThrow(Error);
        });
    });
});
