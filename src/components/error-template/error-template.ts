import moment from 'moment';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import MessagePlugin from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import AccordionPlugin from '../accordion/accordion';
import { ERROR_TEMPLATE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import { MMessageState } from '../message/message';
import WithRender from './error-template.html?style=./error-template.scss';

@WithRender
@Component
export class MErrorTemplate extends ModulVue {

    /**
     * Must refer to the possible states for component m-message
     */
    @Prop({validator: value =>
        value === MMessageState.Success ||
        value === MMessageState.Information ||
        value === MMessageState.Warning ||
        value === MMessageState.Error}
        )
    public type: MMessageState;

    @Prop()
    public message: string;

    @Prop()
    public hints?: string[] | undefined;

    @Prop()
    public links?: {label: string, url: string}[] | undefined;

    /**
     * Shows details on the error (date, referenceNumber and stack [if present])
     */
    @Prop({
        default: false
    })
    public displayErrorDetails: boolean;  // mettre un ? //

    @Prop({
        default: () => moment()
    })
    public errorDate: moment.Moment;   // mettre un ? //

    @Prop()
    public errorReferenceNumber?: string | undefined;

    /**
     * The stacktrace will always be displayed if provided and displayErrorDetails is true
     */
    @Prop()
    public stack?: string | undefined;

    private get userAgent(): string {
        return window.navigator.userAgent;
    }

    private get dateInfo(): string[] | undefined {
        let result: string[] | undefined = undefined;
        if (this.errorDate) {
            result = [this.errorDate.format('YYYY-MM-DD'), this.errorDate.format('HH:mm:ss')];
        }
        return result;
    }
}

const ErrorTemplatePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ERROR_TEMPLATE_NAME, 'plugin.install');
        v.use(I18nPlugin);
        v.use(AccordionPlugin);
        v.use(LinkPlugin);
        v.use(MessagePlugin);
        v.component(ERROR_TEMPLATE_NAME, MErrorTemplate);
    }
};

export default ErrorTemplatePlugin;
