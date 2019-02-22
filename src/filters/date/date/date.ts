import Vue from 'vue';

export let dateFilter: (date: Date, short?: boolean) => string = (date, short) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: (short ? 'short' : 'long'),
        day: 'numeric'
    };
    const locale: string = (Vue.prototype).$i18n.getCurrentLocale();
    let formattedDate: string = date.toLocaleDateString([locale], options);

    formattedDate = addOrdinal(formattedDate, locale);
    return formattedDate;
};

let addOrdinal: (date: string, locale: string) => string = (date, locale) => {
    const regexp2: RegExp = /^1 /;
    let match: RegExpExecArray | null = regexp2.exec(date);
    if (match && locale === 'fr-CA') {
        return date.replace(match[0], `${match[0].trim()}<sup>er</sup> `);
    }
    return date;
};
