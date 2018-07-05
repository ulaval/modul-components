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

/**
 * Utility class to manage the properties relatied to the link displayed in the error pages.
 */
export class Link {
    public label: string;
    public url: string;
    public external: boolean;

    /**
     * Constructor
     * @param label Label for the url link to display.
     * @param url Target for the location to navigate to, can be relative.
     * @param external Defines to the target is external (opens in new tab), or internal (opens in same tab) to the application.
     */
    constructor(label: string, url: string, external: boolean = false) {
        this.label = label;
        this.url = url;
        this.external = external;
    }
}

export enum MErrorTemplateSkin {
    Information = 'information',
    Warning = 'warning',
    Error = 'error'
}
@WithRender
@Component
export class MErrorTemplate extends ModulVue {

    @Prop({validator: value =>
        value === MErrorTemplateSkin.Information ||
        value === MErrorTemplateSkin.Error ||
        value === MErrorTemplateSkin.Warning})
    public skin: MErrorTemplateSkin;

    @Prop()
    public iconName: string;

    @Prop()
    public title: string;

    @Prop()
    public hints?: string[];

    @Prop()
    public links?: Link[];

    get showHints(): boolean {
        return this.hints && this.hints.length > 0 ? true : false;
    }

    get showlinks(): boolean {
        return this.links && this.links.length > 0 ? true : false;
    }

    isTargetExternal(isExternal: boolean): string {
        return isExternal ? '_blank' : '' ;
    }
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
