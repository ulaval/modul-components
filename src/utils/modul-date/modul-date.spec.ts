import ModulDate, { DateComparison, DatePrecision } from './modul-date';


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

describe(`ModulDate`, () => {
    describe(`initialization`, () => {
        describe(`without params`, () => {
            it(`then is equal to today's date`, () => {
                const modulDate: ModulDate = new ModulDate();

                const result: boolean = modulDate.equals(new Date());

                expect(result).toBe(true);
            });
        });

        describe(`from a ModulDate object`, () => {
            it(`then is equal to the provided date`, () => {
                const originalModulDate: ModulDate = new ModulDate('2018-01-01');
                const modulDate: ModulDate = new ModulDate(originalModulDate);

                const result: boolean = modulDate.equals(originalModulDate);

                expect(result).toBe(true);
            });
        });

        describe('from a JavaScript Date object', () => {
            it(`then is equal to the provided date`, () => {
                const date: Date = new Date('2018-01-01');
                const modulDate: ModulDate = new ModulDate(date);

                const result: boolean = modulDate.equals(date);

                expect(result).toBe(true);
            });

            it(`then makes a copy of the provided date`, () => {
                const date: Date = new Date('2018-01-01');
                const modulDate: ModulDate = new ModulDate(date);
                date.setDate(11);

                const result: boolean = modulDate.equals(date);

                expect(result).toBe(false);
            });
        });

        describe(`from an empty string`, () => {
            it(`then is equal to today`, () => {
                const modulDate: ModulDate = new ModulDate('');
                const now: ModulDate = new ModulDate();

                const result: boolean = modulDate.equals(now);

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
                        const modulDate: ModulDate = new ModulDate(testCase.date);
                        const comparableModulDate: ModulDate = new ModulDate(testCase.comparable);

                        const result: boolean = comparableModulDate.equals(modulDate);

                        expect(modulDate.toString()).toBe(testCase.comparable);
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
                            const date: ModulDate = new ModulDate(testCase.date);
                        };

                        expect(test).toThrow(Error);
                    });
                });
            });
        });

        describe(`with an unsupported type`, () => {
            it(`then is equal to today`, () => {
                const modulDate: ModulDate = new ModulDate({});
                const now: ModulDate = new ModulDate();

                const result: boolean = now.equals(modulDate);

                expect(result).toBe(true);
            });
        });

        describe(`with date parts individually`, () => {
            it(`then is equal to the provided date`, () => {
                const date: ModulDate = new ModulDate(2019, 0, 15);
                const comparableModulDate: ModulDate = new ModulDate('2019-01-15');

                const result: boolean = date.equals(comparableModulDate);

                expect(result).toBe(true);
            });
        });
    });

    describe(`serialization`, () => {
        it(`of a date to string, will match the string format`, () => {
            const modulDate: ModulDate = new ModulDate('2018-01-01');

            const result: string = modulDate.toString();

            expect(result).toBe('2018-01-01');
        });

        it(`of a date to isoString, will match the string format`, () => {
            const modulDate: ModulDate = new ModulDate('2018-01-01');

            const result: string = modulDate.toISOString();

            expect(result).toBe(new Date(2018, 0, 1).toISOString());
        });

        it(`of a date to locale string, will match the string format`, () => {
            const modulDate: ModulDate = new ModulDate('2018-01-01');

            const result: string = modulDate.toLocaleDateString();

            expect(result).toBe(new Date(2018, 0, 1).toLocaleDateString());
        });
    });

    describe(`difference`, () => {
        describe(`between two dates in days`, () => {
            let firstDate: ModulDate;
            let secondDate: ModulDate;

            const expectedNumberOfDays: number = 26457;

            beforeEach(() => {
                firstDate = new ModulDate('1947-01-15');
                secondDate = new ModulDate('2019-06-23');
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
            const date: ModulDate = new ModulDate('2019-01-15');

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
                    const date: Date = new Date(2019, 0, 15);
                    const modulDate: ModulDate = new ModulDate('2019-01-15');

                    const result: boolean = modulDate.equals(date);

                    expect(result).toBe(true);
                });

                it(`will not be equal if the dates are different`, () => {
                    const date: Date = new Date(2019, 0, 15);
                    const modulDate: ModulDate = new ModulDate('2019-01-16');

                    const result: boolean = modulDate.equals(date);

                    expect(result).toBe(false);
                });
            });

            describe('with a ModulDate object', () => {
                it(`will be equal if the dates are the same`, () => {
                    const modulDate: ModulDate = new ModulDate('2019-01-15');
                    const otherModulDate: ModulDate = new ModulDate('2019-01-15');

                    const result: boolean = modulDate.equals(otherModulDate);

                    expect(result).toBe(true);
                });

                it(`will not be equal if the dates are different`, () => {
                    const modulDate: ModulDate = new ModulDate('2019-01-15');
                    const otherModulDate: ModulDate = new ModulDate('2019-01-16');

                    const result: boolean = modulDate.equals(otherModulDate);

                    expect(result).toBe(false);
                });
            });

            describe('with anything else', () => {
                it(`will not be equal`, () => {
                    const modulDate: ModulDate = new ModulDate('2019-01-15');

                    const result: boolean = modulDate.equals('2019-01-15');

                    expect(result).toBe(false);
                });
            });
        });

        describe(`when checking date chronology`, () => {
            let testDate: ModulDate;

            beforeEach(() => {
                testDate = new ModulDate('2019-01-15');
            });

            it(`can determine if date comes before`, () => {
                const date: ModulDate = new ModulDate('2019-01-14');

                const result: DateComparison = date.compare(testDate);

                expect(result).toBe(DateComparison.IS_BEFORE);
            });

            it(`can determine if date is the same`, () => {
                const date: ModulDate = new ModulDate('2019-01-15');

                const result: DateComparison = date.compare(testDate);

                expect(result).toBe(DateComparison.IS_EQUAL);
            });

            it(`can determine if date comes after`, () => {
                const date: ModulDate = new ModulDate('2019-01-16');

                const result: DateComparison = date.compare(testDate);

                expect(result).toBe(DateComparison.IS_AFTER);
            });
        });

        describe(`with a single date that is`, () => {
            const earlyModulDate: ModulDate = new ModulDate('2018-05-31');
            const currentModulDate: ModulDate = new ModulDate('2018-06-10');
            const lateModulDate: ModulDate = new ModulDate('2018-06-11');

            const pivotModulDate: ModulDate = new ModulDate('2018-06-10');

            [{
                suite: 'before pivot',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly before', test: () => earlyModulDate.isBefore(pivotModulDate), expected: true },
                        { description: 'before', test: () => earlyModulDate.isSameOrBefore(pivotModulDate), expected: true },
                        { description: 'same', test: () => earlyModulDate.isSame(pivotModulDate), expected: false },
                        { description: 'after', test: () => earlyModulDate.isSameOrAfter(pivotModulDate), expected: false },
                        { description: 'strictly after', test: () => earlyModulDate.isAfter(pivotModulDate), expected: false }

                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly before', test: () => earlyModulDate.isBefore(pivotModulDate, DatePrecision.DAY), expected: true },
                        { description: 'before', test: () => earlyModulDate.isSameOrBefore(pivotModulDate, DatePrecision.DAY), expected: true },
                        { description: 'same', test: () => earlyModulDate.isSame(pivotModulDate, DatePrecision.DAY), expected: false },
                        { description: 'after', test: () => earlyModulDate.isSameOrAfter(pivotModulDate, DatePrecision.DAY), expected: false },
                        { description: 'strictly after', test: () => earlyModulDate.isAfter(pivotModulDate, DatePrecision.DAY), expected: false }

                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly before', test: () => earlyModulDate.isBefore(pivotModulDate, DatePrecision.MONTH), expected: true },
                        { description: 'before', test: () => earlyModulDate.isSameOrBefore(pivotModulDate, DatePrecision.MONTH), expected: true },
                        { description: 'same', test: () => earlyModulDate.isSame(pivotModulDate, DatePrecision.MONTH), expected: false },
                        { description: 'after', test: () => earlyModulDate.isSameOrAfter(pivotModulDate, DatePrecision.MONTH), expected: false },
                        { description: 'strictly after', test: () => earlyModulDate.isAfter(pivotModulDate, DatePrecision.MONTH), expected: false }

                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly before', test: () => earlyModulDate.isBefore(pivotModulDate, DatePrecision.YEAR), expected: false },
                        { description: 'before', test: () => earlyModulDate.isSameOrBefore(pivotModulDate, DatePrecision.YEAR), expected: true },
                        { description: 'same', test: () => earlyModulDate.isSame(pivotModulDate, DatePrecision.YEAR), expected: true },
                        { description: 'after', test: () => earlyModulDate.isSameOrAfter(pivotModulDate, DatePrecision.YEAR), expected: true },
                        { description: 'strictly after', test: () => earlyModulDate.isAfter(pivotModulDate, DatePrecision.YEAR), expected: false }

                    ]
                }]
            },
            {
                suite: 'same as pivot',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'not strictly before', test: () => currentModulDate.isBefore(pivotModulDate, DatePrecision.DAY), expected: false },
                        { description: 'before', test: () => currentModulDate.isSameOrBefore(pivotModulDate, DatePrecision.DAY), expected: true },
                        { description: 'same', test: () => currentModulDate.isSame(pivotModulDate, DatePrecision.DAY), expected: true },
                        { description: 'after', test: () => currentModulDate.isSameOrAfter(pivotModulDate, DatePrecision.DAY), expected: true },
                        { description: 'strictly after', test: () => currentModulDate.isAfter(pivotModulDate, DatePrecision.DAY), expected: false }

                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly before', test: () => currentModulDate.isBefore(pivotModulDate, DatePrecision.DAY), expected: false },
                        { description: 'before', test: () => currentModulDate.isSameOrBefore(pivotModulDate, DatePrecision.DAY), expected: true },
                        { description: 'same', test: () => currentModulDate.isSame(pivotModulDate, DatePrecision.DAY), expected: true },
                        { description: 'after', test: () => currentModulDate.isSameOrAfter(pivotModulDate, DatePrecision.DAY), expected: true },
                        { description: 'strictly after', test: () => currentModulDate.isAfter(pivotModulDate, DatePrecision.DAY), expected: false }

                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly before', test: () => currentModulDate.isBefore(pivotModulDate, DatePrecision.MONTH), expected: false },
                        { description: 'before', test: () => currentModulDate.isSameOrBefore(pivotModulDate, DatePrecision.MONTH), expected: true },
                        { description: 'same', test: () => currentModulDate.isSame(pivotModulDate, DatePrecision.MONTH), expected: true },
                        { description: 'after', test: () => currentModulDate.isSameOrAfter(pivotModulDate, DatePrecision.MONTH), expected: true },
                        { description: 'strictly after', test: () => currentModulDate.isAfter(pivotModulDate, DatePrecision.MONTH), expected: false }

                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly before', test: () => currentModulDate.isBefore(pivotModulDate, DatePrecision.YEAR), expected: false },
                        { description: 'before', test: () => currentModulDate.isSameOrBefore(pivotModulDate, DatePrecision.YEAR), expected: true },
                        { description: 'same', test: () => currentModulDate.isSame(pivotModulDate, DatePrecision.YEAR), expected: true },
                        { description: 'after', test: () => currentModulDate.isSameOrAfter(pivotModulDate, DatePrecision.YEAR), expected: true },
                        { description: 'strictly after', test: () => currentModulDate.isAfter(pivotModulDate, DatePrecision.YEAR), expected: false }

                    ]
                }]
            },
            {
                suite: 'after pivot',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly before', test: () => lateModulDate.isBefore(pivotModulDate), expected: false },
                        { description: 'before', test: () => lateModulDate.isSameOrBefore(pivotModulDate), expected: false },
                        { description: 'same', test: () => lateModulDate.isSame(pivotModulDate), expected: false },
                        { description: 'after', test: () => lateModulDate.isSameOrAfter(pivotModulDate), expected: true },
                        { description: 'strictly after', test: () => lateModulDate.isAfter(pivotModulDate), expected: true }

                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly before', test: () => lateModulDate.isBefore(pivotModulDate, DatePrecision.DAY), expected: false },
                        { description: 'before', test: () => lateModulDate.isSameOrBefore(pivotModulDate, DatePrecision.DAY), expected: false },
                        { description: 'same', test: () => lateModulDate.isSame(pivotModulDate, DatePrecision.DAY), expected: false },
                        { description: 'after', test: () => lateModulDate.isSameOrAfter(pivotModulDate, DatePrecision.DAY), expected: true },
                        { description: 'strictly after', test: () => lateModulDate.isAfter(pivotModulDate, DatePrecision.DAY), expected: true }

                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly before', test: () => lateModulDate.isBefore(pivotModulDate, DatePrecision.MONTH), expected: false },
                        { description: 'before', test: () => lateModulDate.isSameOrBefore(pivotModulDate, DatePrecision.MONTH), expected: true },
                        { description: 'same', test: () => lateModulDate.isSame(pivotModulDate, DatePrecision.MONTH), expected: true },
                        { description: 'after', test: () => lateModulDate.isSameOrAfter(pivotModulDate, DatePrecision.MONTH), expected: true },
                        { description: 'strictly after', test: () => lateModulDate.isAfter(pivotModulDate, DatePrecision.MONTH), expected: false }

                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly before', test: () => lateModulDate.isBefore(pivotModulDate, DatePrecision.YEAR), expected: false },
                        { description: 'before', test: () => lateModulDate.isSameOrBefore(pivotModulDate, DatePrecision.YEAR), expected: true },
                        { description: 'same', test: () => lateModulDate.isSame(pivotModulDate, DatePrecision.YEAR), expected: true },
                        { description: 'after', test: () => lateModulDate.isSameOrAfter(pivotModulDate, DatePrecision.YEAR), expected: true },
                        { description: 'strictly after', test: () => lateModulDate.isAfter(pivotModulDate, DatePrecision.YEAR), expected: false }

                    ]
                }]
            }].forEach(testSuiteRunner);
        });
        describe(`between two dates`, () => {

            const earlyModulDate: ModulDate = new ModulDate('2018-06-10');
            const sameAsLowerBound: ModulDate = new ModulDate('2018-06-15');
            const insideModulDate: ModulDate = new ModulDate('2018-06-18');
            const sameAsUpperBound: ModulDate = new ModulDate('2018-06-20');
            const lateModulDate: ModulDate = new ModulDate('2018-06-25');

            const lowerModulDate: ModulDate = new ModulDate('2018-06-15');
            const upperModulDate: ModulDate = new ModulDate('2018-06-20');


            [{
                suite: 'for a date that is before',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly between', test: () => earlyModulDate.isBetweenStrict(lowerModulDate, upperModulDate), expected: false },
                        { description: 'between', test: () => earlyModulDate.isBetween(lowerModulDate, upperModulDate), expected: false }
                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly between', test: () => earlyModulDate.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.DAY), expected: false },
                        { description: 'between', test: () => earlyModulDate.isBetween(lowerModulDate, upperModulDate, DatePrecision.DAY), expected: false }
                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly between', test: () => earlyModulDate.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.MONTH), expected: false },
                        { description: 'between', test: () => earlyModulDate.isBetween(lowerModulDate, upperModulDate, DatePrecision.MONTH), expected: true }
                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly between', test: () => earlyModulDate.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.YEAR), expected: false },
                        { description: 'between', test: () => earlyModulDate.isBetween(lowerModulDate, upperModulDate, DatePrecision.YEAR), expected: true }
                    ]
                }]
            },
            {
                suite: 'for a date that is on lower bound',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsLowerBound.isBetweenStrict(lowerModulDate, upperModulDate), expected: false },
                        { description: 'between', test: () => sameAsLowerBound.isBetween(lowerModulDate, upperModulDate), expected: true }
                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsLowerBound.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.DAY), expected: false },
                        { description: 'between', test: () => sameAsLowerBound.isBetween(lowerModulDate, upperModulDate, DatePrecision.DAY), expected: true }
                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsLowerBound.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.MONTH), expected: false },
                        { description: 'between', test: () => sameAsLowerBound.isBetween(lowerModulDate, upperModulDate, DatePrecision.MONTH), expected: true }
                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsLowerBound.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.YEAR), expected: false },
                        { description: 'between', test: () => sameAsLowerBound.isBetween(lowerModulDate, upperModulDate, DatePrecision.YEAR), expected: true }
                    ]
                }]
            },
            {
                suite: 'for a date that is inside',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly between', test: () => insideModulDate.isBetweenStrict(lowerModulDate, upperModulDate), expected: true },
                        { description: 'between', test: () => insideModulDate.isBetween(lowerModulDate, upperModulDate), expected: true }
                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly between', test: () => insideModulDate.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.DAY), expected: true },
                        { description: 'between', test: () => insideModulDate.isBetween(lowerModulDate, upperModulDate, DatePrecision.DAY), expected: true }
                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly between', test: () => insideModulDate.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.MONTH), expected: false },
                        { description: 'between', test: () => insideModulDate.isBetween(lowerModulDate, upperModulDate, DatePrecision.MONTH), expected: true }
                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly between', test: () => insideModulDate.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.YEAR), expected: false },
                        { description: 'between', test: () => insideModulDate.isBetween(lowerModulDate, upperModulDate, DatePrecision.YEAR), expected: true }
                    ]
                }]
            },
            {
                suite: 'for a date that is on upper bound',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsUpperBound.isBetweenStrict(lowerModulDate, upperModulDate), expected: false },
                        { description: 'between', test: () => sameAsUpperBound.isBetween(lowerModulDate, upperModulDate), expected: true }
                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsUpperBound.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.DAY), expected: false },
                        { description: 'between', test: () => sameAsUpperBound.isBetween(lowerModulDate, upperModulDate, DatePrecision.DAY), expected: true }
                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsUpperBound.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.MONTH), expected: false },
                        { description: 'between', test: () => sameAsUpperBound.isBetween(lowerModulDate, upperModulDate, DatePrecision.MONTH), expected: true }
                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly between', test: () => sameAsUpperBound.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.YEAR), expected: false },
                        { description: 'between', test: () => sameAsUpperBound.isBetween(lowerModulDate, upperModulDate, DatePrecision.YEAR), expected: true }
                    ]
                }]
            },
            {
                suite: 'for a date that is date after',
                groupes: [{
                    name: 'default date precision',
                    testCases: [
                        { description: 'strictly between', test: () => lateModulDate.isBetweenStrict(lowerModulDate, upperModulDate), expected: false },
                        { description: 'between', test: () => lateModulDate.isBetween(lowerModulDate, upperModulDate), expected: false }
                    ]
                },
                {
                    name: 'date precision (DAY)',
                    testCases: [
                        { description: 'strictly between', test: () => lateModulDate.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.DAY), expected: false },
                        { description: 'between', test: () => lateModulDate.isBetween(lowerModulDate, upperModulDate, DatePrecision.DAY), expected: false }
                    ]
                },
                {
                    name: 'date precision (MONTH)',
                    testCases: [
                        { description: 'strictly between', test: () => lateModulDate.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.MONTH), expected: false },
                        { description: 'between', test: () => lateModulDate.isBetween(lowerModulDate, upperModulDate, DatePrecision.MONTH), expected: true }
                    ]
                },
                {
                    name: 'date precision (YEAR)',
                    testCases: [
                        { description: 'strictly between', test: () => lateModulDate.isBetweenStrict(lowerModulDate, upperModulDate, DatePrecision.YEAR), expected: false },
                        { description: 'between', test: () => lateModulDate.isBetween(lowerModulDate, upperModulDate, DatePrecision.YEAR), expected: true }
                    ]
                }]
            }].forEach(testSuiteRunner);
        });
    });

    describe(`operations`, () => {
        describe(`add`, () => {
            it(`should return a new date with added years with kind year`, () => {
                const date: Date = new Date(1900, 1, 1);
                const modulDate: ModulDate = new ModulDate(date);

                const newDate: Date = modulDate.add(10, 'year');

                expect(newDate.getFullYear()).toBe(date.getFullYear() + 10);
            });

            it(`should not change the current date`, () => {
                const date: Date = new Date(1900, 1, 1);
                const modulDate: ModulDate = new ModulDate(date);

                modulDate.add(10, 'year');

                expect(modulDate.fullYear()).toBe(1900);
                expect(modulDate.month()).toBe(1);
                expect(modulDate.day()).toBe(1);
            });
        });

        describe(`subtract`, () => {
            it(`should return a new date with added years with kind year`, () => {
                const date: Date = new Date(1900, 1, 1);
                const modulDate: ModulDate = new ModulDate(date);

                const newDate: Date = modulDate.subtract(10, 'year');

                expect(newDate.getFullYear()).toBe(1890);
            });

            it(`should not change the current date`, () => {
                const date: Date = new Date(1900, 1, 1);
                const modulDate: ModulDate = new ModulDate(date);

                modulDate.subtract(10, 'year');

                expect(modulDate.fullYear()).toBe(1900);
                expect(modulDate.month()).toBe(1);
                expect(modulDate.day()).toBe(1);
            });
        });

        describe(`endOfDay`, () => {
            it(`should return end of day of current date`, () => {
                const date: Date = new Date(1990, 1, 1);
                const modulDate: ModulDate = new ModulDate(date);

                const endOfDay: Date = modulDate.endOfDay();

                expect(endOfDay.getFullYear()).toBe(date.getFullYear());
                expect(endOfDay.getMonth()).toBe(date.getMonth());
                expect(endOfDay.getDate()).toBe(date.getDate());
                expect(endOfDay.getHours()).toBe(23);
                expect(endOfDay.getMinutes()).toBe(59);
                expect(endOfDay.getSeconds()).toBe(59);
                expect(endOfDay.getMilliseconds()).toBe(999);
            });

            it(`should return end of day even when date is already at end of day`, () => {
                const date: Date = new Date(1990, 1, 1);
                date.setHours(23, 59, 59, 999);
                const modulDate: ModulDate = new ModulDate(date);

                const endOfDay: Date = modulDate.endOfDay();

                expect(endOfDay.getFullYear()).toBe(date.getFullYear());
                expect(endOfDay.getMonth()).toBe(date.getMonth());
                expect(endOfDay.getDate()).toBe(date.getDate());
                expect(endOfDay.getHours()).toBe(23);
                expect(endOfDay.getMinutes()).toBe(59);
                expect(endOfDay.getSeconds()).toBe(59);
                expect(endOfDay.getMilliseconds()).toBe(999);
            });
        });
    });
});
