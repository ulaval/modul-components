import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { FRENCH, Messages } from '../../../utils/i18n/i18n';
import { ModulVue } from '../../../utils/vue/vue';
import { ERROR_CONFIG_NOT_SUPPORTED_NAME } from '../../component-names';
import MessagePagePlugin, { Link } from '../../message-page/message-page';
import { MMessageState } from '../../message/message';
import WithRender from './error-config-not-supported.html';


@WithRender
@Component
export class MErrorConfigNotSupported extends ModulVue {

    @Prop({
        default: () => (Vue.prototype as any).$i18n.translate('m-error-config-not-supported:title')
    })
    public title: string;

    @Prop({ default: () => [] })
    public links: Link[];

    @Prop({
        default: () => [
            (Vue.prototype as any).$i18n.translate('m-error-config-not-supported:hint.primary'),
            (Vue.prototype as any).$i18n.translate('m-error-config-not-supported:hint.secondary')]
    })
    public hints: string[];

    readonly state: string = MMessageState.Warning;

    readonly svgName: string = 'm-svg__error-config-not-supported';
}

const ErrorConfigNotSupportedPlugin: PluginObject<any> = {
    install(v, options): void {
        const i18n: Messages = (v.prototype as any).$i18n;
        if (i18n) {
            i18n.addMessages(FRENCH, require('./error-config-not-supported.lang.fr.json'));
        }

        v.use(MessagePagePlugin);
        v.component(ERROR_CONFIG_NOT_SUPPORTED_NAME, MErrorConfigNotSupported);
    }
};

export default ErrorConfigNotSupportedPlugin;
