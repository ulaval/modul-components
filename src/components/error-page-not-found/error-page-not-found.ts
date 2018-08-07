import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { ERROR_PAGE_NOT_FOUND_NAME } from '../component-names';
import ErrorTemplatePlugin, { Link, MErrorTemplateSkin } from '../error-template/error-template';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import WithRender from './error-page-not-found.html';

@WithRender
@Component
export class MErrorPageNotFound extends ModulVue {

    @Prop({
        default: () => (Vue.prototype as any).$i18n.translate('m-error-page-not-found:title')
    })
    public title: string;

    @Prop({
        default: () => [
            new Link((Vue.prototype as any).$i18n.translate('m-error-page-not-found:home-label'), `\\`)]
    })
    public links: Link[];

    @Prop({
        default: () => [
            (Vue.prototype as any).$i18n.translate('m-error-page-not-found:hint.primary')]
    })
    public hints: string[];

    readonly skin: string = MErrorTemplateSkin.Warning;

    readonly iconName: string = 'm-svg__search';
}

const ErrorPageNotFoundPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ERROR_PAGE_NOT_FOUND_NAME, 'plugin.install');
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.use(ErrorTemplatePlugin);
        v.component(ERROR_PAGE_NOT_FOUND_NAME, MErrorPageNotFound);
    }
};

export default ErrorPageNotFoundPlugin;
