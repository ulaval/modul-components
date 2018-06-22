import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import MessagePlugin from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import AccordionPlugin from '../accordion/accordion';
import { ERROR_TEMPLATE_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import WithRender from './error-template.html?style=./error-template.scss';

export enum MErrorTemplateSkin {
    Blue = 'blue',
    Red = 'red',
    Yellow = 'yellow'
}
@WithRender
@Component
export class MErrorTemplate extends ModulVue {

    @Prop({validator: value =>
        value === MErrorTemplateSkin.Blue ||
        value === MErrorTemplateSkin.Red ||
        value === MErrorTemplateSkin.Yellow}
        )
    public skin: MErrorTemplateSkin;

    @Prop()
    public iconName: string;

    @Prop()
    public title: string;

    @Prop()
    public hints?: string[] | undefined;

    @Prop()
    public links?: {label: string, url: string}[] | undefined;

}

const ErrorTemplatePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ERROR_TEMPLATE_NAME, 'plugin.install');
        v.use(I18nPlugin);
        v.use(AccordionPlugin);
        v.use(LinkPlugin);
        v.use(MessagePlugin);
        v.component(ERROR_TEMPLATE_NAME, MErrorTemplate);
    }
};

export default ErrorTemplatePlugin;
