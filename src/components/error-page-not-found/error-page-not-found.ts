import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { ERROR_PAGE_NOT_FOUND } from '../component-names';
import ErrorTemplatePlugin, { Link, MErrorTemplateSkin } from '../error-template/error-template';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import MessagePlugin from '../message/message';
import PanelPlugin from '../panel/panel';
import WithRender from './error-page-not-found.html?style=./error-page-not-found.scss';

@WithRender
@Component
export class MErrorPageNotFound extends ModulVue {

    @Prop({
        default: () => (Vue.prototype as any).$i18n.translate('m-page-not-found:title')
    })
    public title: string;

    @Prop({
        default: () => [
            new Link((Vue.prototype as any).$i18n.translate('m-page-not-found:home-label'), '\\')]
    })
    public links: Link[];

    @Prop({
        default: () => [
            (Vue.prototype as any).$i18n.translate('m-page-not-foundy:hint.primary')]
    })
    public hints: string[];

    readonly skin: string = MErrorTemplateSkin.Error;

    readonly iconName: string = 'error';
}

const ErrorPageNotFoundPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ERROR_PAGE_NOT_FOUND, 'plugin.install');
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.use(MessagePlugin);
        v.use(PanelPlugin);
        v.use(ErrorTemplatePlugin);
        v.component(ERROR_PAGE_NOT_FOUND, MErrorPageNotFound);
    }
};

export default ErrorPageNotFoundPlugin;
