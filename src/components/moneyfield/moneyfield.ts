import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import L10nPlugin, { MCurrency } from '../../utils/l10n/l10n';
import { ModulVue } from '../../utils/vue/vue';
import { MONEYFIELD_NAME } from '../component-names';
import IntegerfieldPlugin from '../integerfield/integerfield';
import MessagePlugin from '../message/message';
import WithRender from './moneyfield.html';

// TODO: Everything here is dispensable.  This will be all replaced by a wrapper of decimal-field.
@WithRender
@Component({
    inheritAttrs: false,
    mixins: [
        InputState,
        InputWidth,
        InputLabel,
        InputManagement
    ]
})
export class MMoneyfield extends ModulVue {
    @Prop()
    value: number;

    get currencyDetail(): MCurrency {
        return (this as ModulVue).$l10n.getCurrencyDetail(this.currentLocale);
    }

    get currentLocale(): string {
        return (this as ModulVue).$i18n.currentLocale;
    }

    get bindData(): any {
        return Object.assign({}, this.$props || {}, this.$attrs || {});
    }
}

const MoneyFieldPlugin: PluginObject<any> = {
    install(v): void {
        v.use(MessagePlugin);
        v.use(L10nPlugin);
        v.use(IntegerfieldPlugin);
        v.component(MONEYFIELD_NAME, MMoneyfield);
    }
};

export default MoneyFieldPlugin;
