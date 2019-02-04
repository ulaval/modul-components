import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { FRENCH, Messages } from '../../../utils/i18n/i18n';
import { ModulVue } from '../../../utils/vue/vue';
import { ERROR_COOKIES_NOT_SUPPORTED_NAME } from '../../component-names';
import MessagePagePlugin, { Link } from '../../message-page/message-page';
import { MMessageState } from '../../message/message';
import WithRender from './error-cookies-not-supported.html';


@WithRender
@Component
export class MErrorCookiesNotSupported extends ModulVue {

    @Prop({
        default: () => (Vue.prototype).$i18n.translate('m-error-cookies-not-supported:title')
    })
    public title: string;

    @Prop({
        default: () => [
            new Link((Vue.prototype).$i18n.translate('m-error-cookies-not-supported:home-label'), '\\')]
    })
    public links: Link[];

    @Prop({
        default: () => [
            (Vue.prototype).$i18n.translate('m-error-cookies-not-supported:hint.primary')]
    })
    public hints: string[];

    readonly state: string = MMessageState.Warning;

    readonly svgName: string = 'm-svg__error-cookies-disabled';
}

const ErrorCookiesNotSupportedPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(MessagePagePlugin);
        v.component(ERROR_COOKIES_NOT_SUPPORTED_NAME, MErrorCookiesNotSupported);
    }
};

export default ErrorCookiesNotSupportedPlugin;
