import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import L10nPlugin, { MCurrency } from '../../utils/l10n/l10n';
import { MMoney, MMoneyFactory } from '../../utils/money/money';
import { ModulVue } from '../../utils/vue/vue';
import { MONEYFIELD_NAME } from '../component-names';
import IntegerfieldPlugin from '../integerfield/integerfield';
import MessagePlugin from '../message/message';
import WithRender from './moneyfield.html';

// TODO: Everything here is dispensable.  This will be all replaced by a wrapper of decimal-field.
@WithRender
@Component({
    mixins: [
        InputState,
        InputWidth,
        InputLabel,
        InputManagement
    ]
})
export class MMoneyfield extends ModulVue {
    @Prop()
    public value: MMoney;

    public internalValue: MMoney;

    get currencyDetail(): MCurrency {
        return (this as ModulVue).$l10n.getCurrencyDetail(this.currentLocale);
    }

    get currentLocale(): string {
        return (this as ModulVue).$i18n.currentLocale;
    }

    get propsNumberField(): any {
        const amount: number = !(this.value || {}).amount && (this.value || {}).amount !== 0 ? NaN : this.value.amount;
        return Object.assign({ ...this.$props }, { value: amount.toString() });
    }

    updateModel(newValue: string): void {
        const newNumberValue: number = newValue || newValue === '0' ? parseFloat(newValue) : NaN;
        const newMoney: MMoney = MMoneyFactory.createAllParams(newNumberValue, this.currencyDetail.type);

        if (((newMoney || {}).amount !== (this.internalValue || {}).amount) || ((newMoney || {}).currency !== (this.internalValue || {}).currency)) {
            this.internalValue = MMoneyFactory.createAllParams(newNumberValue, this.currencyDetail.type);
            this.$emit('input', this.internalValue);
        }
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
