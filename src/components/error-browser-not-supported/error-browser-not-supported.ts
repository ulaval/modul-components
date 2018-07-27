import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { MediaQueries } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import { ModulVue } from '../../utils/vue/vue';
import { ERROR_BROWSER_NOT_SUPPORTED_NAME } from '../component-names';
import ErrorTemplatePlugin, { Link, MErrorTemplateSkin } from '../error-template/error-template';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import WithRender from './error-browser-not-supported.html';

@WithRender
@Component({
    mixins: [ MediaQueries ]
})
export class MErrorBrowserNotSupported extends ModulVue {

    @Prop({
        default: () => (Vue.prototype as any).$i18n.translate('m-error-browser-not-supported:title')
    })
    public title: string;

    @Prop({ default: () => [] })
    public links: Link[];

    @Prop({
        default: () => []
    })
    public hints: string[];

    readonly skin: string = MErrorTemplateSkin.Warning;

    readonly iconName: string = 'm-svg__warning';

    private get mqAwareLinks(): Link[] {
        if (this.links.length === 0) {
            return this.as<MediaQueries>().isMqMinS ? [new Link(this.$i18n.translate('m-error-browser-not-supported:update-browser.desktop'), 'http://outdatedbrowser.com/fr', true)] : [];
        }
        return this.links;
    }

    private get mqAwareHints(): string[] {
        if (this.hints.length === 0) {
            return this.as<MediaQueries>().isMqMinS ? [this.$i18n.translate('m-error-browser-not-supported:hint.primary.desktop')] : [this.$i18n.translate('m-error-browser-not-supported:hint.primary.mobile')];
        }
        return this.hints;
    }
}

const ErrorBrowserNotSupported: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ERROR_BROWSER_NOT_SUPPORTED_NAME, 'plugin.install');
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.use(MediaQueriesPlugin);
        v.use(ErrorTemplatePlugin);
        v.component(ERROR_BROWSER_NOT_SUPPORTED_NAME, MErrorBrowserNotSupported);
    }
};

export default ErrorBrowserNotSupported;
