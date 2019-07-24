import 'moment/locale/fr';
import Vue, { PluginObject } from 'vue';
import { FormatMode } from '../../../utils/i18n/i18n';
import { ModulVue } from '../../../utils/vue/vue';
import { TIME_NAME, TIME_PERIOD_NAME } from '../../filter-names';
import { TimeFilterOptions } from './time';

export interface TimeFilterOptions {
    preposition: TimeFilterPrepositions;
}

export enum TimeFilterPrepositions {
    From = 'from',
    Until = 'until',
    At = 'at',
    None = 'none'
}

const prepositionToTrad: { [key: string]: string } = {
    [TimeFilterPrepositions.From]: 'f-m-time:fromTime',
    [TimeFilterPrepositions.Until]: 'f-m-time:untilTime',
    [TimeFilterPrepositions.At]: 'f-m-time:atTime',
    [TimeFilterPrepositions.None]: 'f-m-time:timeOnly'
};

export type SupportedTimeTypes = Date | string | undefined;
export interface MTimeRange<T extends SupportedTimeTypes = string> {
    from?: T;
    to?: T;
}

function getLocalDateTime(time: SupportedTimeTypes): Date | undefined {
    let date: Date | undefined = undefined;
    try {
        if (time instanceof Date) {
            date = new Date(time);
        } else if (typeof time === 'string') {
            const now: Date = new Date();
            const datePart: string = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
            const timePart: string = !time.includes(':') ? `${time.padStart(2, '0')}:00:00` : time.split(':').length === 2 ? `${time}:00` : time;
            date = new Date(`${datePart}T${timePart}Z`);
            date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
        }
        return isNaN(date as any) ? undefined : date;
    } catch {
        return undefined;
    }

    throw new Error('Unhandled time type.');
}

function extractHourValueAsString(value: SupportedTimeTypes): string | undefined {
    if (!value) {
        return undefined;
    }

    if (value instanceof Date) {
        return `${value.getHours()}:${value.getMinutes}`;
    } else if (typeof value === 'string') {
        return value;
    } else {
        throw new Error('Unsupported type.  The value must be undefined, a string or a Date');
    }
}


export const timeFilter: (time: SupportedTimeTypes, options?: TimeFilterOptions) => string = (time: SupportedTimeTypes, options: TimeFilterOptions = { preposition: TimeFilterPrepositions.None }) => {
    if (!time) {
        return '';
    }

    const date: Date | undefined = getLocalDateTime(time);
    if (date) {
        const intlOptions: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: date.getMinutes() !== 0 ? 'numeric' : undefined
        };

        const formatedTime: string = new Intl.DateTimeFormat(`${(Vue.prototype as ModulVue).$i18n.currentLocale}`, intlOptions).format(date).replace(/ /g, String.fromCharCode(160));
        return ModulVue.prototype.$i18n.translate(prepositionToTrad[options.preposition], { time: formatedTime }, 0, '', true, FormatMode.Vsprintf);
    }
    return '';
};

export interface TimePeriodFilterOptions {
    preposition: boolean;
}

export const timePeriodFilter: <T extends SupportedTimeTypes>(timeRange?: MTimeRange<T>, options?: TimePeriodFilterOptions) => string =
    <T extends SupportedTimeTypes>(timeRange?: MTimeRange<T>, options: TimePeriodFilterOptions = { preposition: false }) => {
        if (!timeRange || (!timeRange.from && !timeRange.to)) {
            return '';
        }

        const formattedFrom: string = timeFilter(timeRange.from);
        const formattedTo: string = timeFilter(timeRange.to);

        if (!timeRange.from && timeRange.to) {
            return timeFilter(timeRange.to, { preposition: options.preposition ? TimeFilterPrepositions.Until : TimeFilterPrepositions.None });
        }

        if (timeRange.from && !timeRange.to) {
            return timeFilter(timeRange.from, { preposition: options.preposition ? TimeFilterPrepositions.From : TimeFilterPrepositions.None });
        }

        const fromAsString: string | undefined = extractHourValueAsString(timeRange.from);
        const toAsString: string | undefined = extractHourValueAsString(timeRange.to);
        if (fromAsString !== toAsString) {
            return ModulVue.prototype.$i18n.translate(!options.preposition ? 'f-m-time:timePeriod' : 'f-m-time:timePeriodWithPreposition', { from: formattedFrom, to: formattedTo }, 0, '', true, FormatMode.Vsprintf);
        } else {
            return timeFilter(timeRange.from, { preposition: options.preposition ? TimeFilterPrepositions.At : TimeFilterPrepositions.None });
        }
    };

const TimeFilterPlugin: PluginObject<any> = {
    install(v): void {
        v.filter(TIME_NAME, timeFilter);
        v.filter(TIME_PERIOD_NAME, timePeriodFilter);
    }
};

export default TimeFilterPlugin;
