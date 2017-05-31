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
        isExternalUrl: {
            type: Boolean,
            default: false
        },
        isWithoutVisit: {
            type: Boolean,
            default: false
        }
    }
})
export class MLink extends Vue {
    private componentName: string = LINK_NAME;

    public get hasIconeLeft(): boolean {
        return !!this.$slots['icon-left'];
    }

    public get hasIconeRight(): boolean {
        return !!this.$slots['icon-right'];
    }

    // public get values(): string[] {
    //     return ['v1', 'v3', 'v3'];
    // }
}
