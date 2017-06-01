import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './link.html?style=./link.scss';
import { LINK_NAME } from '../component-names';

@WithRender
@Component({
    props: {
        url : {
            type: String,
            default: '/'
        },
        type: {
            type: String,
            default: 'routerLink'
        },
        isWithoutVisit: {
            type: Boolean,
            default: false
        }
    }
})

export class MLink extends Vue {
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
