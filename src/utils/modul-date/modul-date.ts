

/**
 * Level of precision required when comparing two dates
 * Day: yyyy-mm-dd
 * Month: yyyy-mm
 * Year: yyyy
 */
export enum DatePrecision {
    DAY = 'day',
    MONTH = 'month',
    YEAR = 'year'
}

export enum DateComparison {
    IS_BEFORE = -1,
    IS_EQUAL = 0,
    IS_AFTER = 1
}

export const DATE_FORMAT_REGEX: RegExp = /(^(\d{1,4})[\.|\\\/|-](\d{1,2})(([\.|\\\/|-])(\d{1,4}))?)$/;
export default class ModulDate {

    private innerDate: Date;

    /**
     * A DateUtil can be constructed different ways
     * new DateUtil() - defaults to today's date
     * new DateUtil('') - defaults to today's date
     * new DateUtil(<Date>) - from a javascript date object
     * new DateUtil(<DateUtil>) - from a DateUtil date object
     * new DateUtil(year, month, day) - Year and day represent their respective values, month is the index of the month (0: January, ..., 11: December)
     * new DateUtil(<regex>) -  any format that matches:
     *                          [{1, 4} digits] [separator] [{1, 2} digits] [separator] [{1, 4} digits] [separator].
     *                          At least one of the {1, 4} blocks must have 4 digits
     *
     * @param value (optionnal) string | Date (JS date) | DateUtil (this class)
     * @param year (optionnal) Year in format 2 or 4 digits
     * @param month (optionnal) Month index (0: January, ..., 11: December)
     * @param day (optionnal) Day of the month
     */
    constructor(value?: any)
    constructor(year: number, month: number, day: number)
    constructor(year?: any, month?: any, day?: any) {
        switch (arguments.length) {
            case 1:
                const value: ModulDate | Date | String = arguments[0];
                if (value instanceof ModulDate) {
                    this.innerDate = new Date(value.fullYear(), value.month(), value.day());
                } else if (value instanceof Date) {
                    this.innerDate = new Date(value);
                } else if (typeof (value) === 'string') {
                    this.dateFromString(value);
                } else {
                    const date: Date = new Date();
                    this.innerDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                }
                break;
            case 3:
                this.innerDate = new Date(year, month, day);
                break;
            default:
                const date: Date = new Date();
                this.innerDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
    }

    /**
     * Check if the current date is before or equal to the received date.
     *
     * @param otherDate date to be compared with
     * @param precision level of precision for comparison @see DatePrecision
     */
    public isSameOrBefore(otherDate: ModulDate, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(otherDate.innerDate, precision) >= this.toTime(this.innerDate, precision);
    }

    /**
     * Check if the current date is strictly before to the received date.
     *
     * @param otherDate date to be compared with
     * @param precision level of precision for comparison @see DatePrecision
     */
    public isBefore(otherDate: ModulDate, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(otherDate.innerDate, precision) > this.toTime(this.innerDate, precision);
    }

    /**
     * Check if the current date is equal to the received date.
     *
     * @param otherDate date to be compared with
     * @param precision level of precision for comparison @see DatePrecision
     */
    public isSame(otherDate: ModulDate, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(otherDate.innerDate, precision) === this.toTime(this.innerDate, precision);
    }

    /**
     * Check if the current date is equal or after to the received date.
     *
     * @param otherDate date to be compared with
     * @param precision level of precision for comparison @see DatePrecision
     */
    public isSameOrAfter(otherDate: ModulDate, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(otherDate.innerDate, precision) <= this.toTime(this.innerDate, precision);
    }

    /**
     * Check if the current date or after to the received date.
     *
     * @param otherDate date to be compared with
     * @param precision level of precision for comparison @see DatePrecision
     */
    public isAfter(otherDate: ModulDate, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(otherDate.innerDate, precision) < this.toTime(this.innerDate, precision);
    }

    /**
     * Check if the current date is equal to one of the bounds or between them.
     *
     * @param lowerDate lower bound
     * @param higherDate higher bound
     * @param precision level of precision for comparison @see DatePrecision
     */
    public isBetween(lowerDate: ModulDate, higherDate: ModulDate, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(lowerDate.innerDate, precision) <= this.toTime(this.innerDate, precision)
            && this.toTime(this.innerDate, precision) <= this.toTime(higherDate.innerDate, precision);
    }

    /**
     * Check if the current date is strictly between bounds them.
     *
     * @param lowerDate lower bound
     * @param higherDate higher bound
     * @param precision level of precision for comparison @see DatePrecision
     */
    public isBetweenStrict(lowerDate: ModulDate, higherDate: ModulDate, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(lowerDate.innerDate, precision) < this.toTime(this.innerDate, precision)
            && this.toTime(this.innerDate, precision) < this.toTime(higherDate.innerDate, precision);
    }

    /**
     * Compare the current date with the received date to determine if the current date is before, equal or after the
     * received date
     *
     * @param date date to be compared with
     * @returns @see DateComparison
     */
    public compare(date: ModulDate): number {
        const current: number = this.toTime(this.innerDate, DatePrecision.DAY);
        const other: number = this.toTime(date.innerDate, DatePrecision.DAY);

        if (current < other) {
            return DateComparison.IS_BEFORE;
        } else if (current > other) {
            return DateComparison.IS_AFTER;
        }
        return DateComparison.IS_EQUAL;
    }

    /**
     * format date following the date part of the standard ISO-8601
     */
    public toString(): string {
        return this.innerDate.toISOString().split('T')[0];
    }

    /**
     * format date following the date part of the standard ISO-8601
     */
    public toISOString(): string {
        return this.innerDate.toISOString();
    }

    /**
     * format date following the locale representation of a date
     */
    public toLocaleDateString(): string {
        return this.innerDate.toLocaleDateString();
    }

    /**
     * Getter for the year value
     */
    public fullYear(): number {
        return this.innerDate.getFullYear();
    }

    /**
     * Getter for the month value
     */
    public month(): number {
        return this.innerDate.getMonth();
    }

    /**
     * Getter for the day of the month value
     */
    public day(): number {
        return this.innerDate.getDate();
    }

    /**
     * Getter for the day of the week value
     */
    public dayOfWeek(): number {
        return this.innerDate.getDay();
    }

    /**
     * Compares if two dates are equals
     *
     * @param otherDate date to compare with
     */
    public equals(otherDate: any): boolean {
        if (otherDate instanceof Date) {
            return this.toTime(otherDate, DatePrecision.DAY) === this.toTime(this.innerDate, DatePrecision.DAY);
        } else if (otherDate instanceof ModulDate) {
            return this.toTime(otherDate.innerDate, DatePrecision.DAY) === this.toTime(this.innerDate, DatePrecision.DAY);
        }
        return false;
    }

    /**
     * Calculates the number of days between the current date and the received date.
     *
     * @param other
     * @return Number of days in absolute format
     */
    public deltaInDays(other: ModulDate): number {
        return Math.round(Math.abs(other.innerDate.getTime() - this.innerDate.getTime()) / (1000 * 3600 * 24));
    }

    /**
     * Add an unit of time to a copy of the current date and return it.
     *
     * @param valueToAdd The value to add to the time unit.
     * @param unitOfTime The kind of time unit to be added.
     * @return A new Date
     */
    public add(valueToAdd: number, unitOfTime: 'year'): Date {
        return this.subtract(-valueToAdd, unitOfTime);
    }

    /**
     * subtract an unit of time to a copy of the current date and return it.
     *
     * @param valueToSubtract The value to add to the time unit.
     * @param unitOfTime The kind of time unit to be added.
     * @return A new Date
     */
    public subtract(valueToSubtract: number, unitOfTime: 'year'): Date {
        const newDate: Date = new Date(this.innerDate);
        switch (unitOfTime) {
            case 'year':
                newDate.setFullYear(newDate.getFullYear() - valueToSubtract);
                break;
            default: throw new Error(`modul-date: Unknown substract unitOfTime: ${unitOfTime}`);
        }

        return newDate;
    }

    /**
     * Return a date representing the end of the day of a given date (23:59:59).
     *
     * @return A new Date
     */
    public beginOfDay(): Date {
        return new Date(this.innerDate.getFullYear(), this.innerDate.getMonth(), this.innerDate.getDate(), 0, 0, 0, 0);
    }

    /**
     * Return a date representing the end of the day of a given date (23:59:59).
     *
     * @return A new Date
     */
    public endOfDay(): Date {
        return new Date(this.innerDate.getFullYear(), this.innerDate.getMonth(), this.innerDate.getDate(), 23, 59, 59, 999);
    }

    public toDate(): Date {
        return this.innerDate;
    }

    private dateFromString(value: string): void {
        if (value === '') {
            this.innerDate = new Date();
        } else {
            this.innerDate = this.convertStringToDate(value);
        }
    }

    private convertStringToDate(value: string): Date {
        // If the string is an iso string, we use it directly.
        if (value.split('T')[1]) {
            return new Date(value);
        }

        // Otherwise we try to build the date from a partial date string (2010-12-01 or 2010/12/01)

        if (!DATE_FORMAT_REGEX.test(value)) {
            throw Error(`Impossible to find date parts in date`);
        } else {
            const stringToDelete: RegExp = /[\.|\\/|-]/g;
            const parts: string[] = value.split(stringToDelete);

            let first: string = parts[0];
            let second: string = parts[1];
            let third: string = parts[2] || '1';

            if (parseInt(first, 10) > 12 && parseInt(second, 10) > 12 && parseInt(third, 10) > 12) {
                throw Error(`No suitable month value`);
            } else if (parseInt(first, 10) > 31 && parseInt(third, 10) > 31) {
                throw Error(`No suitable day of month value`);
            }

            if (third.length === 4 || third.length > first.length) {
                third = [first, first = third][0];
            }
            const year: string = (first.length === 2) ? '20' + first : first;

            if (parseInt(second, 10) > 12) {
                third = [second, second = third][0];
            }
            const month: string = this.padString(second);
            const day: string = this.padString(third);
            const date: Date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
            return date;
        }
    }

    private padString(input: string): string {
        return ('000' + input).slice(-2);
    }

    private toTime(date: Date, precision: DatePrecision): number {
        let toTimeDate: Date;
        switch (precision) {
            case DatePrecision.YEAR:
                toTimeDate = new Date(date.getFullYear(), 1, 1);
                break;
            case DatePrecision.MONTH:
                toTimeDate = new Date(date.getFullYear(), date.getMonth(), 1);
                break;
            default: // DatePrecision.DAY:
                toTimeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        return toTimeDate.getTime();
    }
}

