import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { SCROLL_TOP_NAME } from '../component-names';
import { MScrollTopPosition } from './scroll-top';
import WithRender from './scroll-top.sandbox.html?style=./scroll-top.sandbox.scss';


@WithRender
@Component
export class MScrollTopSandbox extends Vue {
    public scrollTopPositionFixed: string = MScrollTopPosition.Fixed;
    public scrollTopPositionRelative: string = MScrollTopPosition.Relative;

    // public scrollTopDurationLong: ScrollToDuration = ScrollToDuration.Long;
}

const ScrollTopSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${SCROLL_TOP_NAME}-sandbox`, MScrollTopSandbox);
    }
};

export default ScrollTopSandboxPlugin;
