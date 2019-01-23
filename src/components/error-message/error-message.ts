import moment from 'moment';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { FormatMode } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import AccordionPlugin from '../accordion/accordion';
import { ERROR_MESSAGE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import MessagePlugin from '../message/message';
import PanelPlugin from '../panel/panel';
import WithRender from './error-message.html?style=./error-message.scss';


@WithRender
@Component
export class MErrorMessage extends ModulVue {
    @Prop()
    public error?: Error;

    @Prop({
        default: () => moment()
    })
    public date: moment.Moment;

    @Prop()
    public referenceNumber?: string;

    @Prop({
        default: false
    })
    public stacktrace: boolean;

    private get userAgent(): string {
        return window.navigator.userAgent;
    }

    private get i18nDate(): string {
        let result: string[] | undefined = undefined;
        if (this.date) {
            result = [this.date.format('YYYY-MM-DD'), this.date.format('HH:mm:ss')];
        }
        return this.$i18n.translate('m-error-message:date', result, 0, '', true, FormatMode.Default);
    }

    private get propStacktrace(): boolean {
        return this.stacktrace && !!this.error;
    }
}

const ErrorMessagePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.error('MErrorMessage will be deprecated in modul v.1.0');

        v.use(I18nPlugin);
        v.use(AccordionPlugin);
        v.use(LinkPlugin);
        v.use(MessagePlugin);
        v.use(PanelPlugin);
        v.component(ERROR_MESSAGE_NAME, MErrorMessage);
    }
};

export default ErrorMessagePlugin;
