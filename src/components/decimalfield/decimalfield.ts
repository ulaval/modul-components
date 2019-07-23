import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import L10nPlugin, { MDecimalFormat } from '../../utils/l10n/l10n';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { DECIMALFIELD_NAME } from '../component-names';
import { InputMaskOptions, MInputMask } from '../input-mask/input-mask';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';
import WithRender from './decimalfield.html?style=./decimalfield.scss';

@WithRender
@Component({
    mixins: [
        InputState,
        InputWidth,
        InputLabel,
        InputManagement
    ],
    components: {
        MInputMask
    }
})
export class MDecimalfield extends ModulVue {
    @Prop()
    public value: number;

    @Prop({
        default: 2
    })
    public rounding: number;

    @Prop({
        default: 14
    })
    public precision: number;

    @Prop({ default: false })
    public forceRoundingFormat: boolean;

    protected id: string = `mDecimalfield-${uuid.generate()}`;

    private get hasDecimalfieldError(): boolean {
        return this.as<InputState>().hasError;
    }

    private get isDecimalfieldValid(): boolean {
        return this.as<InputState>().isValid;
    }

    private get inputMaskOptions(): InputMaskOptions {
        const decimalFormat: MDecimalFormat = this.$l10n.getDecimalFormat(this.currentLocale);
        return {
            numeral: true,
            numeralThousandsGroupStyle: 'thousand',
            numeralIntegerScale: this.precision - this.rounding,
            numeralDecimalScale: this.rounding,
            numeralDecimalMark: decimalFormat.decimalMark,
            numeralPositiveOnly: true,
            stripLeadingZeroes: true,
            delimiter: decimalFormat.thousandSeparator,
            removeTrailingDecimalMark: true,
            forceDecimalScale: this.forceRoundingFormat
        };
    }

    get currentLocale(): string {
        return (this as ModulVue).$i18n.currentLocale;
    }

    private get model(): string {
        return (!this.value && this.value !== 0 ? '' : this.value).toString();
    }

    private set model(value: string) {
        const valueAsNumber: number = Number.parseFloat(value);
        this.emitNewValue(valueAsNumber);
    }

    @Emit('input')
    emitNewValue(_newValue: number): void { }
}

const DecimalfieldPlugin: PluginObject<any> = {
    install(v): void {
        v.use(L10nPlugin);
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.component(DECIMALFIELD_NAME, MDecimalfield);
    }
};

export default DecimalfieldPlugin;
