import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './link.html?style=./link.scss';
import { LINK_NAME } from '../component-names';

@WithRender
@Component
export class MLink extends Vue {
    @Prop({ default: '#' })
    private url: string;
    @Prop({ default: 'routerLink' })
    private type: string;
    @Prop({ default: false })
    private isWithoutVisit: boolean;

    private componentName: string = LINK_NAME;
    private isRouterLink: boolean = false;
    private isLink: boolean = false;
    private isExternalLink: boolean = false;
    private isButton: boolean = false;
    private hrefAttribute: string;
    private targetAttribute: string = '_blanck';
    private titleAttribute: string = 'Cet hyperlien s\'ouvrira dans une nouvelle fenêtre.';

    private mounted() {
        this.hrefAttribute = this.url;
        switch (this.$props.type) {
            case 'link':
                this.isLink = true;
                break;
            case 'externalLink':
                this.isExternalLink = true;
                break;
            case 'button':
                this.isButton = true;
                break;
            default:
                this.url = this.url == '#' ? '/' : this.url;
                this.isRouterLink = true;
        }
    }

    private onClick(event) {
        this.$emit('onClick');
        if(this.isButton) {
            event.preventDefault();
        }
    }

    public get getTargetAttribute(): string {
        return this.isExternalLink ? this.targetAttribute : '';
    }

    public get getTitleAttribute(): string {
        return this.isExternalLink ? this.titleAttribute : '';
    }

    public get hasIconeLeft(): boolean {
        return !!this.$slots['icon-left'];
    }

    public get hasIconeRight(): boolean {
        return !!this.$slots['icon-right'];
    }
}

const LinkPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(LINK_NAME, MLink);
    }
};

export default LinkPlugin;
