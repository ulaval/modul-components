import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputMaxWidth, InputMaxWidthValues, InputWidth } from '../../mixins/input-width/input-width';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { PHONEFIELD_NAME } from '../component-names';
import FlagPlugin from '../flag/flag';
import { InputMaskOptions, MInputMask } from '../input-mask/input-mask';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';
import allCountries from './assets/all-countries';
import WithRender from './phonefield.html?style=./phonefield.scss';

interface CountryOptions {
    name: string;
    iso2: string;
    dialCode: string;
    priority?: number;
    areaCodes?: string[];
}

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

    @Prop()
    public label: string;

    private i18nInternalLabel: string = this.$i18n.translate('m-phonefield:phone-label');
    private i18nExample: string = this.$i18n.translate('m-phonefield:example');

    private countryDropdownWidth: InputMaxWidthValues = InputMaxWidthValues.Medium;
    private countryDropdownMaxWidth: InputMaxWidth = InputMaxWidth.None;
    private countryModelInternal: string = '';
    private internalCountry: CountryOptions = { name: '', iso2: '', dialCode: '' };
    private internalPrefix: string = '';
    protected id: string = `mIntegerfield-${uuid.generate()}`;

    created(): void {
        this.countryModelInternal = 'ca';
        this.internalCountry = this.countries.find((country: CountryOptions) => country.iso2 === this.countryModelInternal)!;
    }

    private get countries(): CountryOptions[] {
        return allCountries;
    }

    private get propLabel(): string {
        return this.label ? this.label : this.i18nInternalLabel;
    }

    private get hasPhonefieldError(): boolean {
        return this.as<InputState>().hasError;
    }

    private get isPhonefieldValid(): boolean {
        return this.as<InputState>().isValid;
    }

    private get inputMaskOptions(): InputMaskOptions {
        return {
            phone: true,
            phoneRegionCode: this.phoneRegionCode,
            prefix: this.prefix
        };
    }

    private get phoneRegionCode(): string {
        return this.internalCountry.iso2.toUpperCase();
    }

    private get prefix(): string {
        return '+' + this.internalCountry.dialCode;
    }

    private get example(): string {
        return this.prefix + ' ' + '418-123-1234';
    }

    private get countryModel(): string {
        return this.countryModelInternal;
    }

    private set countryModel(value: string) {
        this.model = '';
        this.internalCountry = this.countries.find((country: CountryOptions) => country.iso2 === value)!;
        this.countryModelInternal = value;
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
        v.use(FlagPlugin);
        v.use(ValidationMesagePlugin);
        v.component(PHONEFIELD_NAME, MPhonefield);
    }
};

export default PhonefieldPlugin;
