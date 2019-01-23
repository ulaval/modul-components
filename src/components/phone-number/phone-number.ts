import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../../utils/vue/vue';
import { PHONE_NUMBER_NAME } from '../component-names';
import WithRender from './phone-number.html?style=./phone-number.scss';


@WithRender
@Component
export class MPhoneNumber extends ModulVue {

    private countryLabel: string = this.$i18n.translate('m-phone-number:label.country');
    private phoneLabel: string = this.$i18n.translate('m-phone-number:label.phone');
    private extensionLabel: string = this.$i18n.translate('m-phone-number:label.extension');
    private countryPlaceholder: string = this.$i18n.translate('m-phone-number:placeholder.country');
    private numberPlaceholder: string = this.$i18n.translate('m-phone-number:placeholder.number');
    private extensionPlaceholder: string = this.$i18n.translate('m-phone-number:placeholder.extension');
    private phoneExample: string = this.$i18n.translate('m-phone-number:example');

    private canada: string = this.$i18n.translate('m-phone-number:canada');
    private usa: string = this.$i18n.translate('m-phone-number:usa');
    private france: string = this.$i18n.translate('m-phone-number:france');
    private others: string = this.$i18n.translate('m-phone-number:others');

    private countryModel: string = '';

    private get countries(): string[] {
        let countriesList: string[] = [];
        countriesList.push(this.canada, this.usa, this.france, this.others);
        return countriesList;
    }

    private get asExample(): boolean {
        return this.countryModel !== '' && this.countryModel !== this.others;
    }

    private get exampleText(): string {
        let text: string;
        switch (this.countryModel) {
            case this.canada:
                text = '999 999 9999';
                break;

            case this.usa:
                text = '999 999 9999';
                break;

            case this.france:
                text = '99 99 99 99 99';
                break;

            default:
                text = '';
        }
        return text;
    }

    private get isNumberDisable(): boolean {
        return this.countryModel === '';
    }
}

const PhoneNumberPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.error('MPhoneNumber will be deprecated in modul v.1.0');

        v.component(PHONE_NUMBER_NAME, MPhoneNumber);
    }
};

export default PhoneNumberPlugin;
