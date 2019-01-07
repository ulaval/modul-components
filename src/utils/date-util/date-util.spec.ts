import DateUtil, { DatePrecision } from './date-util';


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
        describe(`from an empty string`, () => {
            it(`then is equal to today's date`, () => {
                const dateUtil: DateUtil = new DateUtil();

                const result: boolean = dateUtil.equals(new Date());

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

        describe('from a string', () => {
            let comparabledateUtil: DateUtil;
            const date: string = '2018-01-01';

            beforeEach(() => {
                comparabledateUtil = new DateUtil(date);
            });
            [{ date: '2018-01-01', expectedResult: true },
            { date: '18-1-1', expectedResult: true },
            { date: '2018/1/1', expectedResult: true },
            { date: '18/1/1', expectedResult: true },
            { date: '01-01-2018', expectedResult: true },
            { date: '01/01/2018', expectedResult: true },
            { date: '1/1/18', expectedResult: true }
            ].forEach((testCase: any) => {
                it(`then a date with format '${testCase.date}' is a date comparable with date '${date}'`, () => {
                    const dateUtil: DateUtil = new DateUtil(testCase.date);

                    const result: boolean = comparabledateUtil.equals(dateUtil);

                    expect(result).toBe(testCase.expectedResult);
                });
            });
        });
    });
    describe(`serialization`, () => {
        it(`of a date to ISO will match ISO format`, () => {
            const dateUtil: DateUtil = new DateUtil('2018-01-01');

            const result: string = dateUtil.toISO();

            expect(result).toBe('2018-01-01T00:00:00.000Z');
        });
    });
    describe(`comparison`, () => {
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
