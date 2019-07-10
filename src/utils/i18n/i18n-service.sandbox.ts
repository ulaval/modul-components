import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { FormatMode, FRENCH, Messages } from './i18n';
import WithRender from './i18n-service.sandbox.html?style=./i18n-service.sandbox.scss';


enum Width {
    SMALL = 'small',
    NORMAL = 'normal'
}

@WithRender
@Component
export class MI18nServivceSandbox extends ModulVue {

    width: Width = Width.NORMAL;

    private defaultI18nService: Messages;
    private sPrintFI18nService: Messages;
    private vPrintFI18nService: Messages;

    private currentLang: string = FRENCH;

    created(): void {
        this.$log.log('‑'.charCodeAt(0));
        this.$log.log('—'.charCodeAt(0));
        this.$log.log('–'.charCodeAt(0));

        this.defaultI18nService = new Messages({ curLang: this.currentLang, formatMode: FormatMode.Default });
        this.defaultI18nService.addMessages(FRENCH, require('./i18n-service.sandbox.lang.fr.json'));

        this.sPrintFI18nService = new Messages({ curLang: this.currentLang, formatMode: FormatMode.Sprintf });
        this.sPrintFI18nService.addMessages(FRENCH, require('./i18n-service.sandbox.lang.fr.json'));

        this.vPrintFI18nService = new Messages({ curLang: this.currentLang, formatMode: FormatMode.Vsprintf });
        this.vPrintFI18nService.addMessages(FRENCH, require('./i18n-service.sandbox.lang.fr.json'));
    }

    toggleWidth(): void {
        this.width = this.isSmall ? Width.NORMAL : Width.SMALL;
    }

    get isSmall(): boolean {
        return this.width === Width.SMALL;
    }

    get control(): { [key: string]: string }[] {
        return [
            { mode: 'default', value: this.defaultI18nService.translate('i18n-service-sandbox:control') },
            { mode: 'sprintf', value: this.sPrintFI18nService.translate('i18n-service-sandbox:control') },
            { mode: 'vsprintf', value: this.vPrintFI18nService.translate('i18n-service-sandbox:control') }
        ];
    }

    get stringWithNBSP(): { [key: string]: string }[] {
        return [
            { mode: 'default (should not work)', value: this.defaultI18nService.translate('i18n-service-sandbox:with-nbsp') },
            { mode: 'sprintf', value: this.sPrintFI18nService.translate('i18n-service-sandbox:with-nbsp') },
            { mode: 'vsprintf', value: this.vPrintFI18nService.translate('i18n-service-sandbox:with-nbsp') }
        ];
    }

    get stringWithNBHYPHEN(): { [key: string]: string }[] {
        return [
            { mode: 'default (should not work)', value: this.defaultI18nService.translate('i18n-service-sandbox:with-nbhyphen') },
            { mode: 'sprintf', value: this.sPrintFI18nService.translate('i18n-service-sandbox:with-nbhyphen') },
            { mode: 'vsprintf', value: this.vPrintFI18nService.translate('i18n-service-sandbox:with-nbhyphen') }
        ];
    }

    get stringWithENDASH(): { [key: string]: string }[] {
        return [
            { mode: 'default (should not work)', value: this.defaultI18nService.translate('i18n-service-sandbox:with-endash') },
            { mode: 'sprintf', value: this.sPrintFI18nService.translate('i18n-service-sandbox:with-endash') },
            { mode: 'vsprintf', value: this.vPrintFI18nService.translate('i18n-service-sandbox:with-endash') }
        ];
    }

    get stringWithEMDASH(): { [key: string]: string }[] {
        return [
            { mode: 'default (should not work)', value: this.defaultI18nService.translate('i18n-service-sandbox:with-emdash') },
            { mode: 'sprintf', value: this.sPrintFI18nService.translate('i18n-service-sandbox:with-emdash') },
            { mode: 'vsprintf', value: this.vPrintFI18nService.translate('i18n-service-sandbox:with-emdash') }
        ];
    }
}

const ScrollToSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`m-i18n-service-sandbox`, MI18nServivceSandbox);
    }
};

export default ScrollToSandboxPlugin;
