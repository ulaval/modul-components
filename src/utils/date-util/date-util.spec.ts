import DateUtil, { DateComparison, DatePrecision } from './date-util';


const testSuiteRunner: (testSuite: any) => void = (testSuite) => {
    describe(testSuite.suite, () => {
        testSuite.groupes.forEach((testGroup: any) => {
            describe(`with ${testGroup.name}`, () => {
                testGroup.testCases.forEach((testCase: any) => {
                    it(`then is ${testCase.expected ? '' : 'not '}${testCase.description}`, () => {
                        const result: boolean = testCase.test();

                        expect(result).toBe(testCase.expected);
                    });
                });
            });
        });
    });
};

describe(`DateUtil`, () => {
    describe(`initialization`, () => {
        describe(`without params`, () => {
            it(`then is equal to today's date`, () => {
                const dateUtil: DateUtil = new DateUtil();

                const result: boolean = dateUtil.equals(new Date());

                expect(result).toBe(true);
            });
        });

        describe(`from a DateUtil object`, () => {
            it(`then is equal to the provided date`, () => {
                const originalDateUtil: DateUtil = new DateUtil('2018-01-01');
                const dateUtil: DateUtil = new DateUtil(originalDateUtil);

                const result: boolean = dateUtil.equals(originalDateUtil);

                expect(result).toBe(true);
            });
        });

        describe('from a JavaScript Date object', () => {
            it(`then is equal to the provided date`, () => {
                const date: Date = new Date('2018-01-01');
                const dateUtil: DateUtil = new DateUtil(date);

                const result: boolean = dateUtil.equals(date);

                expect(result).toBe(true);
            });

            it(`then makes a copy of the provided date`, () => {
                const date: Date = new Date('2018-01-01');
                const dateUtil: DateUtil = new DateUtil(date);
                date.setDate(11);

                const result: boolean = dateUtil.equals(date);

                expect(result).toBe(false);
            });
        });

        describe(`from an empty string`, () => {
            it(`then is equal to today`, () => {
                const dateUtil: DateUtil = new DateUtil('');
                const now: DateUtil = new DateUtil();

                const result: boolean = dateUtil.equals(now);

                expect(result).toBe(true);
            });
        });

        describe('from a string', () => {
            describe(`of a supported format`, () => {
                [{ comparable: '2018-01-01', date: '2018-01-01', expectedResult: true },
                { comparable: '2018-01-20', date: '18-20-1', expectedResult: true },
                { comparable: '2018-01-03', date: '2018/1/3', expectedResult: true },
                { comparable: '2018-01-01', date: '18/1/1', expectedResult: true },
                { comparable: '2018-05-01', date: '01-05-2018', expectedResult: true },
                { comparable: '2018-01-01', date: '01/01/2018', expectedResult: true },
                { comparable: '2018-01-18', date: '18/1/18', expectedResult: true }
                ].forEach((testCase: any) => {
                    it(`then a date with format '${testCase.date}' is a date comparable with date '${testCase.comparable}'`, () => {
                        const dateUtil: DateUtil = new DateUtil(testCase.date);
                        const comparabledateUtil: DateUtil = new DateUtil(testCase.comparable);

                        const result: boolean = comparabledateUtil.equals(dateUtil);

                        expect(dateUtil.toString()).toBe(testCase.comparable);
                        expect(result).toBe(testCase.expectedResult);
                    });
                });
            });

            describe('of an unsupported format', () => {

                [{ date: 'aaaaaa' },
                { date: '13-13-13' },
                { date: '2018-01-2018' }
                ].forEach((testCase: any) => {
                    it(`then a date with format '${testCase.date}' will throw an error'`, () => {
                        const test: Function = () => {
                            const date: DateUtil = new DateUtil(testCase.date);
                        };

                        expect(test).toThrow(Error);
                    });
                });
            });
        });

        describe(`with an unsupported type`, () => {
            it(`then is equal to today`, () => {
                const dateUtil: DateUtil = new DateUtil({});
                const now: DateUtil = new DateUtil();

                const result: boolean = now.equals(dateUtil);

                expect(result).toBe(true);
            });
        });

        describe(`with date parts individually`, () => {
            it(`then is equal to the provided date`, () => {
                const date: DateUtil = new DateUtil(2019, 0, 15);
                const comparableDateUtil: DateUtil = new DateUtil('2019-01-15');

                const result: boolean = date.equals(comparableDateUtil);

                expect(result).toBe(true);
            });
        });
    });
    describe(`serialization`, () => {
        it(`of a date to string, will match the string format`, () => {
            const dateUtil: DateUtil = new DateUtil('2018-01-01');

            const result: string = dateUtil.toString();

            expect(result).toBe('2018-01-01');
        });
    });

    describe(`difference`, () => {
        describe(`between two dates in days`, () => {
            let firstDate: DateUtil;
            let secondDate: DateUtil;

            const expectedNumberOfDays: number = 26457;

            beforeEach(() => {
                firstDate = new DateUtil('1947-01-15');
                secondDate = new DateUtil('2019-06-23');
            });


            it(`when dates are provided in chronological order, will calculate the number of days between dates`, () => {
                const result: number = firstDate.deltaInDays(secondDate);

                expect(result).toBe(expectedNumberOfDays);
            });

            it(`when dates are provided in reverse chronological order, will calculate the number of days between dates`, () => {
                const result: number = secondDate.deltaInDays(firstDate);

                expect(result).toBe(expectedNumberOfDays);
            });
        });
    });

    describe('getters', () => {
        it(`can extract date components`, () => {
            const date: DateUtil = new DateUtil('2019-01-15');

            expect(date.fullYear()).toBe(2019);
            expect(date.month()).toBe(0);
            expect(date.day()).toBe(15);
            expect(date.dayOfWeek()).toBe(2);

        });
    });

    describe(`comparison`, () => {

        describe(`when checking for equality`, () => {
            describe('with a javascript Date object', () => {
                it(`will be equal if the dates are the same`, () => {
                    const date: Date = new Date('2019-01-15');
                    const dateUtil: DateUtil = new DateUtil('2019-01-15');

                    const result: boolean = dateUtil.equals(date);

                    expect(result).toBe(true);
                });

                it(`will not be equal if the dates are different`, () => {
                    const date: Date = new Date('2019-01-15');
                    const dateUtil: DateUtil = new DateUtil('2019-01-16');

                    const result: boolean = dateUtil.equals(date);

                    expect(result).toBe(false);
                });
            });

            describe('with a DateUtil object', () => {
                it(`will be equal if the dates are the same`, () => {
                    const dateUtil: DateUtil = new DateUtil('2019-01-15');
                    const otherDateUtil: DateUtil = new DateUtil('2019-01-15');

                    const result: boolean = dateUtil.equals(otherDateUtil);

                    expect(result).toBe(true);
                });

                it(`will not be equal if the dates are different`, () => {
                    const dateUtil: DateUtil = new DateUtil('2019-01-15');
                    const otherDateUtil: DateUtil = new DateUtil('2019-01-16');

                    const result: boolean = dateUtil.equals(otherDateUtil);

                    expect(result).toBe(false);
                });
            });

            describe('with anything else', () => {
                it(`will not be equal`, () => {
                    const dateUtil: DateUtil = new DateUtil('2019-01-15');

                    const result: boolean = dateUtil.equals('2019-01-15');

                    expect(result).toBe(false);
                });
            });
        });

        describe(`when checking date chronology`, () => {
            let testDate: DateUtil;

            beforeEach(() => {
                testDate = new DateUtil('2019-01-15');
            });

            it(`can determine if date comes before`, () => {
                const date: DateUtil = new DateUtil('2019-01-14');

                const result: DateComparison = date.compare(testDate);

                expect(result).toBe(DateComparison.IS_BEFORE);
            });

            it(`can determine if date is the same`, () => {
                const date: DateUtil = new DateUtil('2019-01-15');

                const result: DateComparison = date.compare(testDate);

                expect(result).toBe(DateComparison.IS_EQUAL);
            });

            it(`can determine if date comes after`, () => {
                const date: DateUtil = new DateUtil('2019-01-16');

                const result: DateComparison = date.compare(testDate);

                expect(result).toBe(DateComparison.IS_AFTER);
            });
        });

        describe(`with a single date that is`, () => {
            const earlyDateUtil: DateUtil = new DateUtil('2018-05-31');
            const currentDateUtil: DateUtil = new DateUtil('2018-06-10');
            const lateDateUtil: DateUtil = new DateUtil('2018-06-11');

            const pivotDateUtil: DateUtil = new DateUtil('2018-06-10');

            [{
                suite: 'before pivot',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly before', test: () => earlyDateUtil.isBefore(pivotDateUtil), expected: true },
                        { description: 'before', test: () => earlyDateUtil.isSameOrBefore(pivotDateUtil), expected: true },
                        { description: 'same', test: () => earlyDateUtil.isSame(pivotDateUtil), expected: false },
                        { description: 'after', test: () => earlyDateUtil.isSameOrAfter(pivotDateUtil), expected: false },
                        { description: 'strictly after', test: () => earlyDateUtil.isAfter(pivotDateUtil), expected: false }

                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly before', test: () => earlyDateUtil.isBefore(pivotDateUtil, DatePrecision.DAY), expected: true },
                        { description: 'before', test: () => earlyDateUtil.isSameOrBefore(pivotDateUtil, DatePrecision.DAY), expected: true },
                        { description: 'same', test: () => earlyDateUtil.isSame(pivotDateUtil, DatePrecision.DAY), expected: false },
                        { description: 'after', test: () => earlyDateUtil.isSameOrAfter(pivotDateUtil, DatePrecision.DAY), expected: false },
                        { description: 'strictly after', test: () => earlyDateUtil.isAfter(pivotDateUtil, DatePrecision.DAY), expected: false }

                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly before', test: () => earlyDateUtil.isBefore(pivotDateUtil, DatePrecision.MONTH), expected: true },
                        { description: 'before', test: () => earlyDateUtil.isSameOrBefore(pivotDateUtil, DatePrecision.MONTH), expected: true },
                        { description: 'same', test: () => earlyDateUtil.isSame(pivotDateUtil, DatePrecision.MONTH), expected: false },
                        { description: 'after', test: () => earlyDateUtil.isSameOrAfter(pivotDateUtil, DatePrecision.MONTH), expected: false },
                        { description: 'strictly after', test: () => earlyDateUtil.isAfter(pivotDateUtil, DatePrecision.MONTH), expected: false }

                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly before', test: () => earlyDateUtil.isBefore(pivotDateUtil, DatePrecision.YEAR), expected: false },
                        { description: 'before', test: () => earlyDateUtil.isSameOrBefore(pivotDateUtil, DatePrecision.YEAR), expected: true },
                        { description: 'same', test: () => earlyDateUtil.isSame(pivotDateUtil, DatePrecision.YEAR), expected: true },
                        { description: 'after', test: () => earlyDateUtil.isSameOrAfter(pivotDateUtil, DatePrecision.YEAR), expected: true },
                        { description: 'strictly after', test: () => earlyDateUtil.isAfter(pivotDateUtil, DatePrecision.YEAR), expected: false }

                    ]
                }]
            },
            {
                suite: 'same as pivot',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'not strictly before', test: () => currentDateUtil.isBefore(pivotDateUtil, DatePrecision.DAY), expected: false },
                        { description: 'before', test: () => currentDateUtil.isSameOrBefore(pivotDateUtil, DatePrecision.DAY), expected: true },
                        { description: 'same', test: () => currentDateUtil.isSame(pivotDateUtil, DatePrecision.DAY), expected: true },
                        { description: 'after', test: () => currentDateUtil.isSameOrAfter(pivotDateUtil, DatePrecision.DAY), expected: true },
                        { description: 'strictly after', test: () => currentDateUtil.isAfter(pivotDateUtil, DatePrecision.DAY), expected: false }

                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly before', test: () => currentDateUtil.isBefore(pivotDateUtil, DatePrecision.DAY), expected: false },
                        { description: 'before', test: () => currentDateUtil.isSameOrBefore(pivotDateUtil, DatePrecision.DAY), expected: true },
                        { description: 'same', test: () => currentDateUtil.isSame(pivotDateUtil, DatePrecision.DAY), expected: true },
                        { description: 'after', test: () => currentDateUtil.isSameOrAfter(pivotDateUtil, DatePrecision.DAY), expected: true },
                        { description: 'strictly after', test: () => currentDateUtil.isAfter(pivotDateUtil, DatePrecision.DAY), expected: false }

                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly before', test: () => currentDateUtil.isBefore(pivotDateUtil, DatePrecision.MONTH), expected: false },
                        { description: 'before', test: () => currentDateUtil.isSameOrBefore(pivotDateUtil, DatePrecision.MONTH), expected: true },
                        { description: 'same', test: () => currentDateUtil.isSame(pivotDateUtil, DatePrecision.MONTH), expected: true },
                        { description: 'after', test: () => currentDateUtil.isSameOrAfter(pivotDateUtil, DatePrecision.MONTH), expected: true },
                        { description: 'strictly after', test: () => currentDateUtil.isAfter(pivotDateUtil, DatePrecision.MONTH), expected: false }

                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly before', test: () => currentDateUtil.isBefore(pivotDateUtil, DatePrecision.YEAR), expected: false },
                        { description: 'before', test: () => currentDateUtil.isSameOrBefore(pivotDateUtil, DatePrecision.YEAR), expected: true },
                        { description: 'same', test: () => currentDateUtil.isSame(pivotDateUtil, DatePrecision.YEAR), expected: true },
                        { description: 'after', test: () => currentDateUtil.isSameOrAfter(pivotDateUtil, DatePrecision.YEAR), expected: true },
                        { description: 'strictly after', test: () => currentDateUtil.isAfter(pivotDateUtil, DatePrecision.YEAR), expected: false }

                    ]
                }]
            },
            {
                suite: 'after pivot',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly before', test: () => lateDateUtil.isBefore(pivotDateUtil), expected: false },
                        { description: 'before', test: () => lateDateUtil.isSameOrBefore(pivotDateUtil), expected: false },
                        { description: 'same', test: () => lateDateUtil.isSame(pivotDateUtil), expected: false },
                        { description: 'after', test: () => lateDateUtil.isSameOrAfter(pivotDateUtil), expected: true },
                        { description: 'strictly after', test: () => lateDateUtil.isAfter(pivotDateUtil), expected: true }

                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly before', test: () => lateDateUtil.isBefore(pivotDateUtil, DatePrecision.DAY), expected: false },
                        { description: 'before', test: () => lateDateUtil.isSameOrBefore(pivotDateUtil, DatePrecision.DAY), expected: false },
                        { description: 'same', test: () => lateDateUtil.isSame(pivotDateUtil, DatePrecision.DAY), expected: false },
                        { description: 'after', test: () => lateDateUtil.isSameOrAfter(pivotDateUtil, DatePrecision.DAY), expected: true },
                        { description: 'strictly after', test: () => lateDateUtil.isAfter(pivotDateUtil, DatePrecision.DAY), expected: true }

                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly before', test: () => lateDateUtil.isBefore(pivotDateUtil, DatePrecision.MONTH), expected: false },
                        { description: 'before', test: () => lateDateUtil.isSameOrBefore(pivotDateUtil, DatePrecision.MONTH), expected: true },
                        { description: 'same', test: () => lateDateUtil.isSame(pivotDateUtil, DatePrecision.MONTH), expected: true },
                        { description: 'after', test: () => lateDateUtil.isSameOrAfter(pivotDateUtil, DatePrecision.MONTH), expected: true },
                        { description: 'strictly after', test: () => lateDateUtil.isAfter(pivotDateUtil, DatePrecision.MONTH), expected: false }

                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly before', test: () => lateDateUtil.isBefore(pivotDateUtil, DatePrecision.YEAR), expected: false },
                        { description: 'before', test: () => lateDateUtil.isSameOrBefore(pivotDateUtil, DatePrecision.YEAR), expected: true },
                        { description: 'same', test: () => lateDateUtil.isSame(pivotDateUtil, DatePrecision.YEAR), expected: true },
                        { description: 'after', test: () => lateDateUtil.isSameOrAfter(pivotDateUtil, DatePrecision.YEAR), expected: true },
                        { description: 'strictly after', test: () => lateDateUtil.isAfter(pivotDateUtil, DatePrecision.YEAR), expected: false }

                    ]
                }]
            }].forEach(testSuiteRunner);
        });
        describe(`between two dates`, () => {

            const earlyDateUtil: DateUtil = new DateUtil('2018-06-10');
            const sameAsLowerBound: DateUtil = new DateUtil('2018-06-15');
            const insideDateUtil: DateUtil = new DateUtil('2018-06-18');
            const sameAsUpperBound: DateUtil = new DateUtil('2018-06-20');
            const lateDateUtil: DateUtil = new DateUtil('2018-06-25');

            const lowerDateUtil: DateUtil = new DateUtil('2018-06-15');
            const upperDateUtil: DateUtil = new DateUtil('2018-06-20');


            [{
                suite: 'for a date that is before',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly between', test: () => earlyDateUtil.isBetweenStrict(lowerDateUtil, upperDateUtil), expected: false },
                        { description: 'between', test: () => earlyDateUtil.isBetween(lowerDateUtil, upperDateUtil), expected: false }
                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly between', test: () => earlyDateUtil.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.DAY), expected: false },
                        { description: 'between', test: () => earlyDateUtil.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.DAY), expected: false }
                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly between', test: () => earlyDateUtil.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.MONTH), expected: false },
                        { description: 'between', test: () => earlyDateUtil.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.MONTH), expected: true }
                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly between', test: () => earlyDateUtil.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.YEAR), expected: false },
                        { description: 'between', test: () => earlyDateUtil.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.YEAR), expected: true }
                    ]
                }]
            },
            {
                suite: 'for a date that is on lower bound',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsLowerBound.isBetweenStrict(lowerDateUtil, upperDateUtil), expected: false },
                        { description: 'between', test: () => sameAsLowerBound.isBetween(lowerDateUtil, upperDateUtil), expected: true }
                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsLowerBound.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.DAY), expected: false },
                        { description: 'between', test: () => sameAsLowerBound.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.DAY), expected: true }
                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsLowerBound.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.MONTH), expected: false },
                        { description: 'between', test: () => sameAsLowerBound.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.MONTH), expected: true }
                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsLowerBound.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.YEAR), expected: false },
                        { description: 'between', test: () => sameAsLowerBound.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.YEAR), expected: true }
                    ]
                }]
            },
            {
                suite: 'for a date that is inside',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly between', test: () => insideDateUtil.isBetweenStrict(lowerDateUtil, upperDateUtil), expected: true },
                        { description: 'between', test: () => insideDateUtil.isBetween(lowerDateUtil, upperDateUtil), expected: true }
                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly between', test: () => insideDateUtil.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.DAY), expected: true },
                        { description: 'between', test: () => insideDateUtil.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.DAY), expected: true }
                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly between', test: () => insideDateUtil.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.MONTH), expected: false },
                        { description: 'between', test: () => insideDateUtil.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.MONTH), expected: true }
                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly between', test: () => insideDateUtil.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.YEAR), expected: false },
                        { description: 'between', test: () => insideDateUtil.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.YEAR), expected: true }
                    ]
                }]
            },
            {
                suite: 'for a date that is on upper bound',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsUpperBound.isBetweenStrict(lowerDateUtil, upperDateUtil), expected: false },
                        { description: 'between', test: () => sameAsUpperBound.isBetween(lowerDateUtil, upperDateUtil), expected: true }
                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsUpperBound.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.DAY), expected: false },
                        { description: 'between', test: () => sameAsUpperBound.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.DAY), expected: true }
                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsUpperBound.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.MONTH), expected: false },
                        { description: 'between', test: () => sameAsUpperBound.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.MONTH), expected: true }
                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsUpperBound.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.YEAR), expected: false },
                        { description: 'between', test: () => sameAsUpperBound.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.YEAR), expected: true }
                    ]
                }]
            },
            {
                suite: 'for a date that is date after',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly between', test: () => lateDateUtil.isBetweenStrict(lowerDateUtil, upperDateUtil), expected: false },
                        { description: 'between', test: () => lateDateUtil.isBetween(lowerDateUtil, upperDateUtil), expected: false }
                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly between', test: () => lateDateUtil.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.DAY), expected: false },
                        { description: 'between', test: () => lateDateUtil.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.DAY), expected: false }
                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly between', test: () => lateDateUtil.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.MONTH), expected: false },
                        { description: 'between', test: () => lateDateUtil.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.MONTH), expected: true }
                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly between', test: () => lateDateUtil.isBetweenStrict(lowerDateUtil, upperDateUtil, DatePrecision.YEAR), expected: false },
                        { description: 'between', test: () => lateDateUtil.isBetween(lowerDateUtil, upperDateUtil, DatePrecision.YEAR), expected: true }
                    ]
                }]
            }].forEach(testSuiteRunner);
        });
    });
});
