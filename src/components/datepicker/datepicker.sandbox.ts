import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import I18nPlugin, { FRENCH, I18nPluginOptions } from '../../utils/i18n/i18n';
import { DATEPICKER_NAME } from '../component-names';
import DatepickerPlugin from './datepicker';
import WithRender from './datepicker.sandbox.html';

@WithRender
@Component
export class MDatepickerSandbox extends Vue {
}

const DatepickerSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        let opt: I18nPluginOptions = { curLang: FRENCH };
        Vue.use(I18nPlugin, opt);
        v.use(DatepickerPlugin);
        v.component(`${DATEPICKER_NAME}-sandbox`, MDatepickerSandbox);
    }
};

export default DatepickerSandboxPlugin;
