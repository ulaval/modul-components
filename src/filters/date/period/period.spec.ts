import Vue from 'vue';
import { addMessages } from '../../../../tests/helpers/lang';
import { PERIOD_NAME } from '../../filter-names';
import { MPeriod, MShowPeriodParams, periodFilter } from './period';

describe(PERIOD_NAME, () => {
    beforeEach(() => {
        addMessages(Vue, ['filters/date/period/period.lang.en.json', 'filters/date/date/date.lang.en.json']);
    });

    describe(`Given both dates are present`, () => {
        describe(`When fullmode is on`, () => {
            it(`should return a complete formatted period`, () => {
                const period: MPeriod = {
                    start: new Date(2019, 3, 8),
                    end: new Date(2019, 4, 14)
                };
                const periodParams: MShowPeriodParams = {
                    period,
                    fullMode: true
                };
                expect(periodFilter(periodParams)).toEqual('Du 8 avril 2019 au 14 mai 2019');
            });
        });

        describe(`Given fullmode is off`, () => {
            describe(`When both start date and end date are the same day`, () => {
                it(`should return a formatted period with only one date`, () => {
                    const period: MPeriod = {
                        start: new Date(2019, 3, 8),
                        end: new Date(2019, 3, 8)
                    };
                    const periodParams: MShowPeriodParams = {
                        period
                    };
                    expect(periodFilter(periodParams)).toEqual('Le 8 avril 2019');
                });
            });

            xdescribe(`When both start date and end date are the same month`, () => {
                it(`should return a formatted period with 2 dates, but only one year and only one month`, () => {
                    const period: MPeriod = {
                        start: new Date(2019, 3, 8),
                        end: new Date(2019, 3, 14)
                    };
                    const periodParams: MShowPeriodParams = {
                        period
                    };
                    expect(periodFilter(periodParams)).toEqual('Du 8 au 14 avril 2019');
                });
            });

            xdescribe(`When both start date and end date are the same year`, () => {
                it(`should return a formatted period with 2 dates, but only one year`, () => {
                    const period: MPeriod = {
                        start: new Date(2019, 3, 8),
                        end: new Date(2019, 4, 14)
                    };
                    const periodParams: MShowPeriodParams = {
                        period
                    };
                    expect(periodFilter(periodParams)).toEqual('Du 8 avril au 14 mai 2019');
                });
            });

            describe(`When start date and end date have a different year`, () => {
                it(`should return a formatted period with 2 dates`, () => {
                    const period: MPeriod = {
                        start: new Date(2019, 3, 8),
                        end: new Date(2020, 4, 14)
                    };
                    const periodParams: MShowPeriodParams = {
                        period
                    };
                    expect(periodFilter(periodParams)).toEqual('Du 8 avril 2019 au 14 mai 2020');
                });
            });
        });
    });

    describe(`Given the end date is missing`, () => {
        it(`then we only show the start date`, () => {
            const period: MPeriod = {
                start: new Date(2019, 3, 8)
            };
            const periodParams: MShowPeriodParams = {
                period
            };

            expect(periodFilter(periodParams)).toEqual('Débute le 8 avril 2019');
        });
    });

    describe(`Given the start date is missing`, () => {
        it(`then we only show the end date`, () => {
            const period: MPeriod = {
                end: new Date(2019, 3, 8)
            };
            const periodParams: MShowPeriodParams = {
                period
            };

            expect(periodFilter(periodParams)).toEqual('Se termine le 8 avril 2019');
        });
    });

    describe(`Given both dates are missing`, () => {
        it(`then it throws an error`, () => {
            const period: MPeriod = {};
            const periodParams: MShowPeriodParams = {
                period
            };

            expect(() => periodFilter(periodParams)).toThrow(Error);
        });
    });
});
