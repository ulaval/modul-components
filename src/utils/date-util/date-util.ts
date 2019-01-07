
export enum DatePrecision {
    DAY = 'day',
    MONTH = 'month',
    YEAR = 'year'
}

export default class DateUtil {

    private innerDate: Date;

    constructor(value?: any)
    constructor(year: number, month: number, day: number)
    constructor(year?: any, month?: any, day?: any) {
        switch (arguments.length) {
            case 1:
                const value: DateUtil | Date | String = arguments[0];
                if (value instanceof DateUtil) {
                    this.innerDate = new Date(value.fullYear(), value.month(), value.day());
                } else if (value instanceof Date) {
                    this.innerDate = new Date(value);
                } else if (typeof (value) === 'string') {
                    if (Date.parse(value)) {
                        const tempDate: Date = new Date(Date.parse(value));
                        this.innerDate = new Date(Date.UTC(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate()));
                    } else {
                        this.innerDate = this.convertDateString(value);
                    }
                }
                break;
            case 3:
                this.innerDate = new Date(year, month, day);
                break;
            default:
                this.innerDate = new Date();
        }

        // Required to force UTC format
        if (this.innerDate) {
            this.innerDate = new Date(Date.UTC(this.innerDate.getUTCFullYear(), this.innerDate.getUTCMonth(), this.innerDate.getUTCDate()));
        }
    }

    public isSameOrBefore(otherDate: DateUtil, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(otherDate.innerDate, precision) >= this.toTime(this.innerDate, precision);
    }

    public isBefore(otherDate: DateUtil, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(otherDate.innerDate, precision) > this.toTime(this.innerDate, precision);
    }

    public isSame(otherDate: DateUtil, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(otherDate.innerDate, precision) === this.toTime(this.innerDate, precision);
    }

    public isSameOrAfter(otherDate: DateUtil, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(otherDate.innerDate, precision) <= this.toTime(this.innerDate, precision);
    }

    public isAfter(otherDate: DateUtil, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(otherDate.innerDate, precision) < this.toTime(this.innerDate, precision);
    }

    public isBetween(lowerDate: DateUtil, higherDate: DateUtil, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(lowerDate.innerDate, precision) <= this.toTime(this.innerDate, precision)
            && this.toTime(this.innerDate, precision) <= this.toTime(higherDate.innerDate, precision);
    }

    public isBetweenStrict(lowerDate: DateUtil, higherDate: DateUtil, precision: DatePrecision = DatePrecision.DAY): boolean {
        return this.toTime(lowerDate.innerDate, precision) < this.toTime(this.innerDate, precision)
            && this.toTime(this.innerDate, precision) < this.toTime(higherDate.innerDate, precision);
    }

    public compare(date: DateUtil): number {
        const current: number = this.toTime(this.innerDate, DatePrecision.DAY);
        const other: number = this.toTime(date.innerDate, DatePrecision.DAY);

        if (current < other) {
            return -1;
        } else if (current > other) {
            return 1;
        }
        return 0;
    }

    public toISO(): string {
        return this.innerDate.toISOString();
    }

    public fullYear(): number {
        return this.innerDate.getUTCFullYear();
    }

    public month(): number {
        return this.innerDate.getUTCMonth();
    }

    public day(): number {
        return this.innerDate.getUTCDate();
    }

    public dayOfWeek(): number {
        return this.innerDate.getUTCDay();
    }

    /**
     * Compares if two dates are equals
     *
     * @param otherDate date to compare with
     */
    public equals(otherDate: Date | DateUtil): boolean {
        if (otherDate instanceof Date) {
            return this.toTime(otherDate, DatePrecision.DAY) === this.toTime(this.innerDate, DatePrecision.DAY);
        } else if (otherDate instanceof DateUtil) {
            return this.toTime(otherDate.innerDate, DatePrecision.DAY) === this.toTime(this.innerDate, DatePrecision.DAY);
        }
        return false;
    }

    public deltaInDays(other: DateUtil): number {
        return Math.round(Math.abs(other.innerDate.getTime() - this.innerDate.getTime()) / (1000 * 3600 * 24));
    }

    private convertDateString(value: string): Date {
        const dateFormat: RegExp = /(^(\d{1,4})[\.|\\/|-](\d{1,2})[\.|\\/|-](\d{1,4}))(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
        const parts: string[] = dateFormat.exec(value) as string[];
        if (parts.length >= 4) {
            const first: string = parts[2];
            const second: string = (parts[3] === '0') ? '1' : parts[3];
            const third: string = parts[4];
            let year: string;
            let month: string;
            let day: string;
            year = (first.length > third.length) ? first : third;
            month = this.padString(second);
            day = this.padString((first.length > third.length) ? third : second);
            if (year.length === 2) {
                year = '20' + year;
            }
            return new Date(Date.parse(`${year}-${month}-${day}`));
        }
        throw Error(`Date ${value} cannot be inferred from regEx pattern`);
    }

    private padString(input: string): string {
        return ('000' + input).slice(-2);
    }

    private toTime(date: Date, precision: DatePrecision): number {
        let toTimeDate: Date;
        switch (precision) {
            case DatePrecision.YEAR:
                toTimeDate = new Date(date.getUTCFullYear(), 1, 1);
                break;
            case DatePrecision.MONTH:
                toTimeDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
                break;
            default: // DatePrecision.DAY
                toTimeDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
                break;
        }
        return toTimeDate.getTime();
    }
}
