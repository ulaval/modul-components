import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { ERROR_ACCESS_DENIED_NAME } from '../component-names';
import ErrorTemplatePlugin, { Link, MErrorTemplateSkin } from '../error-template/error-template';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import WithRender from './error-access-denied.html';

@WithRender
@Component
export class MErrorAccessDenied extends ModulVue {

    @Prop({
        default: () => (Vue.prototype as any).$i18n.translate('m-error-access-denied:title')
    })
    public title: string;

    @Prop()
    public links: Link[];

    @Prop({
        default: () => [
            (Vue.prototype as any).$i18n.translate('m-error-access-denied:hint.primary')]
    })
    public hints: string[];

    readonly skin: string = MErrorTemplateSkin.Information;

    readonly svgName: string = 'm-svg__error-access-denied';
}

const ErrorAccessDeniedPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ERROR_ACCESS_DENIED_NAME, 'plugin.install');
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.use(ErrorTemplatePlugin);
        v.component(ERROR_ACCESS_DENIED_NAME, MErrorAccessDenied);
    }
};

export default ErrorAccessDeniedPlugin;
