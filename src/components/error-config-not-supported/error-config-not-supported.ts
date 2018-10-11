import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { ERROR_CONFIG_NOT_SUPPORTED_NAME } from '../component-names';
import MessagePagePlugin, { Link } from '../message-page/message-page';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import { MMessageState } from '../message/message';
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
        v.prototype.$log.debug(ERROR_CONFIG_NOT_SUPPORTED_NAME, 'plugin.install');
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.use(MessagePagePlugin);
        v.component(ERROR_CONFIG_NOT_SUPPORTED_NAME, MErrorConfigNotSupported);
    }
};

export default ErrorConfigNotSupportedPlugin;
