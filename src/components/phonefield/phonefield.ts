import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { PHONEFIELD_NAME } from '../component-names';
import { InputMaskOptions, MInputMask } from '../input-mask/input-mask';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';
import WithRender from './phonefield.html?style=./phonefield.scss';


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
export class MPhonefield extends ModulVue {
    @Prop()
    public value: string;

    private countryLabel: string = this.$i18n.translate('m-phone-number:label.country');
    private phoneLabel: string = this.$i18n.translate('m-phone-number:label.phone');
    private extensionLabel: string = this.$i18n.translate('m-phone-number:label.extension');
    private countryPlaceholder: string = this.$i18n.translate('m-phone-number:placeholder.country');
    private numberPlaceholder: string = this.$i18n.translate('m-phone-number:placeholder.number');
    private extensionPlaceholder: string = this.$i18n.translate('m-phone-number:placeholder.extension');
    private phoneExample: string = this.$i18n.translate('m-phone-number:example');

    protected id: string = `mIntegerfield-${uuid.generate()}`;

    private get hasPhonefieldError(): boolean {
        return this.as<InputState>().hasError;
    }

    private get isPhonefieldValid(): boolean {
        return this.as<InputState>().isValid;
    }

    private get inputMaskOptions(): InputMaskOptions {
        return {
            numeral: false,
            numeralThousandsGroupStyle: 'none',
            numeralIntegerScale: 0,
            numeralDecimalScale: 0,
            numeralDecimalMark: '',
            numeralPositiveOnly: false,
            stripLeadingZeroes: false,
            delimiter: '',
            phoneRegionCode: this.phoneRegionCode,
            phone: true,
            prefix: this.prefix
        };
    }

    private get prefix(): string {
        return '+1';
    }

    private get phoneRegionCode(): string {
        return 'CA';
    }

    private get model(): string {
        return !this.value ? '' : this.value;
    }

    private set model(value: string) {
        this.emitNewValue(value);
    }

    @Emit('input')
    emitNewValue(_newValue: string): void { }
}

const PhonefieldPlugin: PluginObject<any> = {
    install(v): void {
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.component(PHONEFIELD_NAME, MPhonefield);
    }
};

export default PhonefieldPlugin;
