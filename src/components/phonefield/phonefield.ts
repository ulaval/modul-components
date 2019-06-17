import 'cleave.js/dist/addons/cleave-phone.i18n.js';
import { CountryCode, getExampleNumber, PhoneNumber } from 'libphonenumber-js';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { FRENCH } from '../../utils/i18n/i18n';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { PHONEFIELD_NAME } from '../component-names';
import FlagPlugin from '../flag/flag';
import { InputMaskOptions, MInputMask } from '../input-mask/input-mask';
import InputStyle from '../input-style/input-style';
import SelectPlugin from '../select/select';
import ValidationMesagePlugin from '../validation-message/validation-message';
import allCountriesEn from './assets/all-countries-en';
import allCountriesFr from './assets/all-countries-fr';
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

    @Prop({ default: 'ca' })
    public defaultCountry: string;

    private i18nInternalLabel: string = this.$i18n.translate('m-phonefield:phone-label');
    private i18nCountryLabel: string = this.$i18n.translate('m-phonefield:country-label');
    private i18nExample: string = this.$i18n.translate('m-phonefield:example');

    private countryModelInternal: string = '';
    private internalCountry: CountryOptions = { name: '', iso2: '', dialCode: '' };
    private internalPrefix: string = '';
    protected id: string = `mIntegerfield-${uuid.generate()}`;
    protected exemples: any = require('libphonenumber-js/examples.mobile.json');

    created(): void {
        this.countryModelInternal = this.defaultCountry;
        this.internalCountry = this.countries.find((country: CountryOptions) => country.iso2 === this.countryModelInternal)!;
    }

    private get countries(): CountryOptions[] {
        const countries: CountryOptions[] = this.$i18n.currentLang() === FRENCH ? allCountriesFr : allCountriesEn;
        return countries.sort((a, b) => (this.nameNormalize(a.name) > this.nameNormalize(b.name)) ? 1 : ((this.nameNormalize(b.name) > this.nameNormalize(a.name)) ? -1 : 0));
    }

    private get isoCountries(): string[] {
        return this.countries.map(contry => contry.iso2);
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
        return this.internalCountry ? this.internalCountry.iso2.toUpperCase() : '';
    }

    private get prefix(): string {
        return '+' + this.internalCountry.dialCode;
    }

    private get example(): string {
        const phoneNumber: PhoneNumber | undefined = getExampleNumber(this.phoneRegionCode as CountryCode, this.exemples);
        return phoneNumber ? phoneNumber.formatInternational() : '';
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

    private nameNormalize(name: string): string {
        return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    @Emit('input')
    emitNewValue(_newValue: string): void { }
}

const PhonefieldPlugin: PluginObject<any> = {
    install(v): void {
        v.use(InputStyle);
        v.use(SelectPlugin);
        v.use(FlagPlugin);
        v.use(ValidationMesagePlugin);
        v.component(PHONEFIELD_NAME, MPhonefield);
    }
};

export default PhonefieldPlugin;
