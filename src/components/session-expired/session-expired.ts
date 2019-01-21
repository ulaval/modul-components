import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './session-expired.html';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import MessagePlugin from '../message/message';
import { Prop } from 'vue-property-decorator';
import { SESSION_EXPIRED_NAME } from '../component-names';

@WithRender
@Component
export class MSessionExpired extends Vue {
    @Prop({
        default: () => Vue.prototype.$i18n.translate('m-session-expired:back-to-portal')
    })
    public backToLabel: string;
}

const SessionExpiredPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.error('MSessionExpired will be deprecated in modul v.1.0');

        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.use(MessagePlugin);
        v.component(SESSION_EXPIRED_NAME, MSessionExpired);
    }
};

export default SessionExpiredPlugin;
