import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { FRENCH, Messages } from '../../../utils/i18n/i18n';
import { ModulVue } from '../../../utils/vue/vue';
import { ERROR_ACCESS_DENIED_NAME } from '../../component-names';
import MessagePagePlugin, { Link } from '../../message-page/message-page';
import { MMessageState } from '../../message/message';
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

    readonly state: string = MMessageState.Information;

    readonly svgName: string = 'm-svg__error-access-denied';
}

const ErrorAccessDeniedPlugin: PluginObject<any> = {
    install(v, options): void {

        const i18n: Messages = (v.prototype as any).$i18n;
        if (i18n) {
            i18n.addMessages(FRENCH, require('./error-access-denied.lang.fr.json'));
        }

        v.use(MessagePagePlugin);
        v.component(ERROR_ACCESS_DENIED_NAME, MErrorAccessDenied);
    }
};

export default ErrorAccessDeniedPlugin;
