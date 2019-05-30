import Vue from 'vue';

export interface DateFilterParams {
    shortMode?: boolean;
    showMonth?: boolean;
    showYear?: boolean;
    showDay?: boolean;
}
export let dateFilter: (date: Date, params?: DateFilterParams) => string = (date, params) => {
    const defaultParams: DateFilterParams = {
        shortMode: false,
        showMonth: true,
        showYear: true,
        showDay: true
    };
    const appliedParams: DateFilterParams = Object.assign(defaultParams, params);
    const options: Intl.DateTimeFormatOptions = {
        year: appliedParams.showYear ? 'numeric' : undefined,
        month: appliedParams.showMonth ? (appliedParams.shortMode ? 'short' : 'long') : undefined,
        day: appliedParams.showDay ? 'numeric' : undefined
    };
    const locale: string = (Vue.prototype).$i18n.getCurrentLocale();
    let formattedDate: string = date.toLocaleDateString([locale], options);

    formattedDate = addOrdinal(formattedDate, locale);
    return formattedDate;
};

let addOrdinal: (date: string, locale: string) => string = (date, locale) => {
    const regexp2: RegExp = /(^1 )|(^1$)/;
    let match: RegExpExecArray | null = regexp2.exec(date);
    if (match && locale === 'fr-CA') {
        return date.replace(match[0], `${match[0].trim()}<sup>er</sup> `);
    }
    return date;
};
