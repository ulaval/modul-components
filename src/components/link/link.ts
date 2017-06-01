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
    @Prop({ default: 'routerLink' })
    public type: string;
    @Prop({ default: false })
    public isWithoutVisit: boolean;

    private componentName: string = LINK_NAME;
    private isRouterLink: boolean = false;
    private isLink: boolean = false;
    private isExternalLink: boolean = false;

    public mounted() {
        switch(this.$props.type) {
            case 'link':
                this.isLink = true;
                break;
            case 'externalLink':
                this.isExternalLink = true;
                break;
            default:
                this.isRouterLink = true;
        }
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
