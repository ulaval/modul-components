import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { SCROLL_TOP_NAME } from '../component-names';
import WithRender from './scroll-top.sandbox.html?style=./scroll-top.sandbox.scss';
import ScrollTopPlugin from './scroll-top';


@WithRender
@Component
export class MScrollTopSandbox extends Vue {
}

const ScrollTopSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ScrollTopPlugin);
        v.component(`${SCROLL_TOP_NAME}-sandbox`, MScrollTopSandbox);
    }
};

export default ScrollTopSandboxPlugin;
