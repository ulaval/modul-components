import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './link.html?style=./link.scss';
import { LINK_NAME } from '../component-names';

@WithRender
@Component
export class MLink extends Vue {
    @Prop({ default: '/' })
    public url: string;
    @Prop({ default: 'router-link' })
    public type: string;
    @Prop({ default: false })
    public isWithoutVisit: boolean;

    public componentName: string = LINK_NAME;

    private propsUrl: string;
    private isRouterLink: boolean = false;
    private isLink: boolean = false;
    private isExternalLink: boolean = false;
    private isButton: boolean = false;
    private hrefAttribute: string;
    private targetAttribute: string = '_blanck';
    private titleAttribute: string = 'Cet hyperlien s\'ouvrira dans une nouvelle fenêtre.';

    private mounted(): void {
        this.propsUrl = this.$props.url;
        this.hrefAttribute = this.url;
        switch (this.$props.type) {
            case 'link':
                this.isLink = true;
                break;
            case 'external-link':
                this.isExternalLink = true;
                break;
            case 'button':
                this.propsUrl = '#';
                this.isButton = true;
                break;
            default:
                this.isRouterLink = true;
        }
    }

    private onClick(event): void {
        this.$emit('onClick');
        this.$el.blur();
        if (this.isButton) {
            event.preventDefault();
        }
    }

    private get getTargetAttribute(): string {
        return this.isExternalLink ? this.targetAttribute : '';
    }

    private get getTitleAttribute(): string {
        return this.isExternalLink ? this.titleAttribute : '';
    }

    private get hasIconeLeft(): boolean {
        return !!this.$slots['icon-left'];
    }

    private get hasIconeRight(): boolean {
        return !!this.$slots['icon-right'];
    }
}

const LinkPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(LINK_NAME, MLink);
    }
};

export default LinkPlugin;
