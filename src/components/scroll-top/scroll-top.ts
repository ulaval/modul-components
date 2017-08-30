import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './scroll-top.html?style=./scroll-top.scss';
import { SCROLL_TOP_NAME } from '../component-names';

export enum MScrollTopPosition {
    STICKY = 'sticky',
    RELATIVE = 'relative'
}

@WithRender
@Component
export class MScrollTop extends Vue {
    @Prop({ default: MScrollTopPosition.STICKY })
    public position: string;

    public componentName = SCROLL_TOP_NAME;
    public scrollBreakPoint: number = window.innerHeight * 2;

    protected mounted(): void {
        console.log(this.scrollBreakPoint);
    }

    private scrollTop(): void {
        console.log(document.body.offsetHeight);
    }

    private onScroll(): void {
        console.log('test');
    }

}

const ScrollTopPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SCROLL_TOP_NAME, MScrollTop);
    }
};

export default ScrollTopPlugin;
