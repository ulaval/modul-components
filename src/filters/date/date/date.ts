import 'moment/locale/fr';

import moment from 'moment';
import Vue, { PluginObject } from 'vue';

import { FormatMode, Messages } from '../../../utils/i18n/i18n';
import { DATE_NAME } from '../../filter-names';

export let dateFilter: (date: Date, short?: boolean) => string = (date, short) => {
    let i18n: Messages = (Vue.prototype).$i18n as Messages;
    let regexp: RegExp = /(\$)\d*(\D*)\d*(\$)/;
    let formattedDate: string = moment(date).format(i18n.translate(short ? 'f-m-date:short' : 'f-m-date:long', undefined, 0, '', undefined, FormatMode.Vsprintf));
    let match: RegExpExecArray | null = regexp.exec(formattedDate);
    if (match) {
        return formattedDate.replace(match[1], '').replace(match[2], match[2] ? `<sup>${match[2]}</sup>` : '').replace(match[3], '');
    }
    return formattedDate;
};

