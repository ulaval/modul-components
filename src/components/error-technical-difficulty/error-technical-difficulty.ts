import moment from 'moment';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import AccordionPlugin from '../accordion/accordion';
import { ERROR_TECHNICAL_DIFFICULTY_NAME } from '../component-names';
import ErrorTemplatePlugin, { Link, MErrorTemplateSkin } from '../error-template/error-template';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import MessagePlugin from '../message/message';
import PanelPlugin from '../panel/panel';
import WithRender from './error-technical-difficulty.html?style=./error-technical-difficulty.scss';

@WithRender
@Component
export class MErrorTechnicalDifficulty extends ModulVue {

    @Prop({
        default: () => (Vue.prototype as any).$i18n.translate('m-error-technical-difficulty:title')
    })
    public title: string;

    @Prop({
        default: () => [
            new Link((Vue.prototype as any).$i18n.translate('m-error-technical-difficulty:home-label'), '\\')]
    })
    public links: Link[];

    @Prop({
        default: () => [
            (Vue.prototype as any).$i18n.translate('m-error-technical-difficulty:hint.primary'),
            (Vue.prototype as any).$i18n.translate('m-error-technical-difficulty:hint.secondary')]
    })
    public hints: string[];

    @Prop({
        default: () => moment()
    })
    public errorDate: moment.Moment;

    /**
     * Reference number must be generated by the parent component
     */
    @Prop()
    public errorReferenceNumber?: string;

    @Prop({
        default: false
    })
    public showStackTrace: boolean;

    /**
     * Javascript Error containing the stack trace to be displayed
     */
    @Prop()
    public error?: Error;

    readonly skin: string = MErrorTemplateSkin.Error;

    readonly iconName: string = 'm-svg__error-technical-difficulty';

    /**
     * Using the value of the props errorDate, generates an array with two values, the date in YYYY-MM-DD format and the time in HH:mm:ss format.
     */
    public get dateInfo(): string[] {
        let result: string[] = [];
        if (this.errorDate) {
            result = [this.errorDate.format('YYYY-MM-DD'), this.errorDate.format('HH:mm:ss')];
        }
        return result;
    }

    /**
     * Defines if the stack trace is to be displayed based on the showStrackTrace prop and the presence of the attribute stack in the error.
     */
    public get propStacktrace(): boolean {
        return this.showStackTrace && !!this.error;
    }

    public get userAgent(): string {
        return window.navigator.userAgent;
    }

}

const ErrorTechnicalDifficultyPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ERROR_TECHNICAL_DIFFICULTY_NAME, 'plugin.install');
        v.use(I18nPlugin);
        v.use(AccordionPlugin);
        v.use(LinkPlugin);
        v.use(MessagePlugin);
        v.use(PanelPlugin);
        v.use(ErrorTemplatePlugin);
        v.component(ERROR_TECHNICAL_DIFFICULTY_NAME, MErrorTechnicalDifficulty);
    }
};

export default ErrorTechnicalDifficultyPlugin;
