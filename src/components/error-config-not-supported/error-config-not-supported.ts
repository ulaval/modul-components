import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { ERROR_CONFIG_NOT_SUPPORTED_NAME } from '../component-names';
import ErrorTemplatePlugin, { Link, MErrorTemplateSkin } from '../error-template/error-template';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
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
            (Vue.prototype as any).$i18n.translate('m-error-config-not-supported:hint.primary')]
    })
    public hints: string[];

    readonly skin: string = MErrorTemplateSkin.Warning;

    readonly iconName: string = 'm-svg__warning';
}

const ErrorConfigNotSupportedPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ERROR_CONFIG_NOT_SUPPORTED_NAME, 'plugin.install');
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.use(ErrorTemplatePlugin);
        v.component(ERROR_CONFIG_NOT_SUPPORTED_NAME, MErrorConfigNotSupported);
    }
};

export default ErrorConfigNotSupportedPlugin;
