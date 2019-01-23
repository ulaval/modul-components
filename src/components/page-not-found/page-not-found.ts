import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { PAGE_NOT_FOUND_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import MessagePlugin from '../message/message';
import WithRender from './page-not-found.html';


@WithRender
@Component
export class MPageNotFound extends Vue {
    @Prop({
        default: () => Vue.prototype.$i18n.translate('m-page-not-found:back-to-portal')
    })
    public backToLabel: string;
}

const PageNotFoundPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.error('MPageNotFound will be deprecated in modul v.1.0');

        v.prototype.$log.debug(PAGE_NOT_FOUND_NAME, 'plugin.install');
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.use(MessagePlugin);
        v.component(PAGE_NOT_FOUND_NAME, MPageNotFound);
    }
};

export default PageNotFoundPlugin;
