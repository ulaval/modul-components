import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './session-expired.html';
import { Prop } from 'vue-property-decorator';
import { SESSION_EXPIRED_NAME } from '../component-names';

@WithRender
@Component
export class MSessionExpired extends Vue {
    @Prop({
        default: () => Vue.prototype.$i18n.translate('m-session-expired:back-to-portal')
    })
    public backToLabel: string | undefined;
}

const SessionExpiredPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(SESSION_EXPIRED_NAME, 'plugin.install');
        v.component(SESSION_EXPIRED_NAME, MSessionExpired);
    }
};

export default SessionExpiredPlugin;
