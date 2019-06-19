import 'cleave.js/dist/addons/cleave-phone.i18n.js';
import { CountryCode, getExampleNumber, PhoneNumber } from 'libphonenumber-js';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { FRENCH } from '../../utils/i18n/i18n';
import { SpritesService } from '../../utils/svg/sprites';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { PHONEFIELD_NAME } from '../component-names';
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
    @Model('input')
    public value: string;

    @Prop()
    public label: string;

    @Prop({ default: 'ca' })
    public defaultCountry: string;

    public $refs: {
        inputMask: MInputMask;
    };

    protected id: string = `mIntegerfield-${uuid.generate()}`;
    private examples: any = require('libphonenumber-js/examples.mobile.json');

    countryModelInternal: string = '';
    internalCountry: CountryOptions = { name: '', iso2: '', dialCode: '' };
    selectedCountries: CountryOptions[] = this.$i18n.currentLang() === FRENCH ? allCountriesFr : allCountriesEn;
    countries: CountryOptions[] = this.selectedCountries.sort((a, b) => (this.nameNormalize(a.name) > this.nameNormalize(b.name)) ? 1 : ((this.nameNormalize(b.name) > this.nameNormalize(a.name)) ? -1 : 0));

    i18nInternalLabel: string = this.$i18n.translate('m-phonefield:phone-label');
    i18nCountryLabel: string = this.$i18n.translate('m-phonefield:country-label');
    i18nExample: string = this.$i18n.translate('m-phonefield:example');

    @Emit('input')
    emitNewValue(_newValue: string): void { }

    created(): void {
        this.countryModelInternal = this.defaultCountry;
        this.internalCountry = this.countries.find((country: CountryOptions) => country.iso2 === this.countryModelInternal)!;
    }

    get isoCountries(): string[] {
        return this.countries.map(contry => contry.iso2);
    }

    get propLabel(): string {
        return this.label ? this.label : this.i18nInternalLabel;
    }

    get hasPhonefieldError(): boolean {
        return this.as<InputState>().hasError;
    }

    get isPhonefieldValid(): boolean {
        return this.as<InputState>().isValid;
    }

    get inputMaskOptions(): InputMaskOptions {
        return {
            phone: true,
            phoneRegionCode: this.phoneRegionCode,
            prefix: this.prefix
        };
    }

    get phoneRegionCode(): string {
        return this.internalCountry ? this.internalCountry.iso2.toUpperCase() : '';
    }

    get prefix(): string {
        return '+' + this.internalCountry.dialCode;
    }

    get example(): string {
        const phoneNumber: PhoneNumber | undefined = getExampleNumber(this.phoneRegionCode as CountryCode, this.examples);
        return phoneNumber ? phoneNumber.formatInternational() : '';
    }

    get countryModel(): string {
        return this.countryModelInternal;
    }

    set countryModel(value: string) {
        this.model = '';
        this.internalCountry = this.countries.find((country: CountryOptions) => country.iso2 === value)!;
        this.countryModelInternal = value;
    }

    get model(): string {
        return !this.value ? '' : this.value;
    }

    set model(value: string) {
        this.emitNewValue(value);
    }

    nameNormalize(name: string): string {
        return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    spriteId(iso: string): string | undefined {
        if (document.getElementById('m-svg__flag-' + iso)) {
            return '#m-svg__flag-' + iso;
        } else if (iso) {
            this.$log.warn('"' + iso + '" is not a valid iso country. Make sure that the sprite has been loaded via the $svg instance service.');
        }
    }

    onContryChanged(contryIso: string): void {
        this.countryModel = contryIso;
        this.focusInput();
    }


    public async focusInput(): Promise<any> {
        await this.$nextTick();
        this.$refs.inputMask.focusAndSelectAll();
    }

}

const PhonefieldPlugin: PluginObject<any> = {
    install(v): void {
        v.use(InputStyle);
        v.use(SelectPlugin);
        v.use(ValidationMesagePlugin);

        const svg: SpritesService = (v.prototype).$svg;
        if (svg) {
            svg.addSprites(require('../../assets/icons/sprites-flags.svg'));

        } else {
            v.prototype.$log.error(
                'PhonefieldPlugin.install -> You must use the svg plugin.'
            );
        }


        v.component(PHONEFIELD_NAME, MPhonefield);
    }
};

export default PhonefieldPlugin;
