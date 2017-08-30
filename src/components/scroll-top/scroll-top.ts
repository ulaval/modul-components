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
    private scrollBreakPoint: number = window.innerHeight * 2;
    private isFocus: boolean = false;

    protected mounted(): void {
        console.log(this.scrollBreakPoint);
        window.document.body.onscroll = function() {
            console.log('in');
        };

    }

    private scrollTop(): void {
        console.log(document.body.offsetHeight);
    }

    private onClick(event) {
        console.log(this.$el);
        this.$emit('click');
        this.$el.blur();
    }

}

const ScrollTopPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SCROLL_TOP_NAME, MScrollTop);
    }
};

export default ScrollTopPlugin;
