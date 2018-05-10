import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './error-message.html';
import { Prop } from 'vue-property-decorator';
import moment from 'moment';
import AccordionPlugin from '../accordion/accordion';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import MessagePlugin from '../message/message';
import ModalPlugin from '../modal/modal';

const ERROR_MESSAGE_NAME: string = 'm-error-message';

@WithRender
@Component
export class MErrorMessage extends Vue {
    @Prop()
    public error?: Error;

    @Prop({
        default: moment()
    })
    public date: moment.Moment;

    @Prop()
    public referenceNumber?: string;

    private get userAgent(): string {
        return window.navigator.userAgent;
    }

    private get dateInfo(): string[] | undefined {
        let result: string[] | undefined = undefined;
        if (this.date) {
            result = [this.date.format('YYYY-MM-DD'), this.date.format('HH:mm:ss')];
        }
        return result;
    }
}

const ErrorMessagePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ERROR_MESSAGE_NAME, 'plugin.install');
        v.use(I18nPlugin);
        v.use(AccordionPlugin);
        v.use(LinkPlugin);
        v.use(MessagePlugin);
        v.component(ERROR_MESSAGE_NAME, MErrorMessage);
    }
};

export default ErrorMessagePlugin;
