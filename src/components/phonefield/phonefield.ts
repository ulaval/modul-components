import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../../utils/vue/vue';
import { PHONEFIELD_NAME } from '../component-names';
import WithRender from './phonefield.html?style=./phonefield.scss';


@WithRender
@Component
export class MPhonefield extends ModulVue {

    private countryLabel: string = this.$i18n.translate('m-phone-number:label.country');
    private phoneLabel: string = this.$i18n.translate('m-phone-number:label.phone');
    private extensionLabel: string = this.$i18n.translate('m-phone-number:label.extension');
    private countryPlaceholder: string = this.$i18n.translate('m-phone-number:placeholder.country');
    private numberPlaceholder: string = this.$i18n.translate('m-phone-number:placeholder.number');
    private extensionPlaceholder: string = this.$i18n.translate('m-phone-number:placeholder.extension');
    private phoneExample: string = this.$i18n.translate('m-phone-number:example');
}

const PhonefieldPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(PHONEFIELD_NAME, MPhonefield);
    }
};

export default PhonefieldPlugin;
