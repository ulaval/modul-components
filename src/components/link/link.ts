import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './link.html?style=./link.scss';
import { LINK_NAME } from '../component-names';

export enum MLinkMode {
    RouterLink = 'router-link',
    ExternalLink = 'external-link',
    Link = 'link',
    Button = 'button'
}

@WithRender
@Component
export class MLink extends ModulVue {
    @Prop({ default: '/' })
    public url: string;
    @Prop({ default: MLinkMode.RouterLink })
    public mode: MLinkMode;
    @Prop({ default: false })
    public unvisited: boolean;
    @Prop({ default: true })
    public underline: boolean;
    @Prop({ default: false })
    public noStyle: boolean;
    @Prop()
    public hiddenText: string;

    public componentName: string = LINK_NAME;

    protected mounted(): void {
        if (this.isExternalLink) {
            this.$refs['link']['setAttribute']('title', this.$i18n.translate('m-link:open-new-tab'));
            this.$refs['link']['setAttribute']('target', '_blank');
        }
    }

    private onClick(event): void {
        this.$el.blur();
        if (this.isButton) {
            event.preventDefault();
        }
        this.$emit('click', event);
    }

    private get isRouterLink(): boolean {
        return this.mode == MLinkMode.RouterLink || (this.mode != MLinkMode.Button && this.mode != MLinkMode.ExternalLink && this.mode != MLinkMode.Link);
    }

    private get isLink(): boolean {
        return this.mode == MLinkMode.Link;
    }

    private get isExternalLink(): boolean {
        return this.mode == MLinkMode.ExternalLink;
    }

    private get isButton(): boolean {
        return this.mode == MLinkMode.Button;
    }

    private get propUrl(): string {
        return this.mode == MLinkMode.Button ? '#' : this.url;
    }

    private get hasIconeLeft(): boolean {
        return !!this.$slots['icon-left'];
    }

    private get hasIconeRight(): boolean {
        return !!this.$slots['icon-right'];
    }
    private get hasHiddenText(): boolean {
        return this.hiddenText == undefined || this.hiddenText == '' ? false : true;
    }
}

const LinkPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(LINK_NAME, MLink);
    }
};

export default LinkPlugin;
